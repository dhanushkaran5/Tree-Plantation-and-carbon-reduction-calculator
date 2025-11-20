// City Pollution Comparator Logic

// Load cities data from shared file
const CITY_COORDINATES = {};
// Populate from INDIAN_CITIES if available
if (typeof INDIAN_CITIES !== 'undefined') {
    Object.keys(INDIAN_CITIES).forEach(city => {
        CITY_COORDINATES[city] = {
            lat: INDIAN_CITIES[city].lat,
            lng: INDIAN_CITIES[city].lng,
            country: 'IN'
        };
    });
} else {
    // Fallback to basic cities
    CITY_COORDINATES['Delhi'] = { lat: 28.6139, lng: 77.2090, country: 'IN' };
    CITY_COORDINATES['Chennai'] = { lat: 13.0827, lng: 80.2707, country: 'IN' };
    CITY_COORDINATES['Bangalore'] = { lat: 12.9716, lng: 77.5946, country: 'IN' };
    CITY_COORDINATES['Mumbai'] = { lat: 19.0760, lng: 72.8777, country: 'IN' };
    CITY_COORDINATES['Hyderabad'] = { lat: 17.3850, lng: 78.4867, country: 'IN' };
    CITY_COORDINATES['Kolkata'] = { lat: 22.5726, lng: 88.3639, country: 'IN' };
    CITY_COORDINATES['Pune'] = { lat: 18.5204, lng: 73.8567, country: 'IN' };
    CITY_COORDINATES['Jaipur'] = { lat: 26.9124, lng: 75.7873, country: 'IN' };
    CITY_COORDINATES['Ahmedabad'] = { lat: 23.0225, lng: 72.5714, country: 'IN' };
}

let comparisonChart = null;
let cityDataCache = {};

// Load city pollution data
async function loadCityData() {
    const citySelect = document.getElementById('citySelect');
    const city = citySelect.value;

    if (!city) {
        document.getElementById('pollutionData').style.display = 'none';
        return;
    }

    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');
    const pollutionData = document.getElementById('pollutionData');

    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    pollutionData.style.display = 'none';

    try {
        // Check cache first
        if (cityDataCache[city] && (Date.now() - cityDataCache[city].timestamp) < 300000) {
            // Use cached data if less than 5 minutes old
            displayPollutionData(city, cityDataCache[city].data);
            loading.style.display = 'none';
            return;
        }

        // Fetch from OpenAQ API
        const coords = CITY_COORDINATES[city];
        const radius = 25000; // 25km radius

        // OpenAQ API v2 endpoint
        const url = `https://api.openaq.org/v2/latest?limit=1&page=1&offset=0&sort=desc&radius=${radius}&coordinates=${coords.lat}%2C${coords.lng}`;

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            // Fallback to mock data if API doesn't return results
            const mockData = getMockPollutionData(city);
            cityDataCache[city] = { data: mockData, timestamp: Date.now() };
            displayPollutionData(city, mockData);
        } else {
            const result = data.results[0];
            const measurements = result.measurements || [];
            
            const pollutionData = {
                pm25: null,
                pm10: null,
                aqi: null
            };

            measurements.forEach(measurement => {
                if (measurement.parameter === 'pm25') {
                    pollutionData.pm25 = measurement.value;
                } else if (measurement.parameter === 'pm10') {
                    pollutionData.pm10 = measurement.value;
                }
            });

            // Calculate AQI (simplified)
            if (pollutionData.pm25) {
                pollutionData.aqi = calculateAQI(pollutionData.pm25, 'pm25');
            } else if (pollutionData.pm10) {
                pollutionData.aqi = calculateAQI(pollutionData.pm10, 'pm10');
            }

            // Cache the data
            cityDataCache[city] = { data: pollutionData, timestamp: Date.now() };
            displayPollutionData(city, pollutionData);
        }

        loading.style.display = 'none';
    } catch (error) {
        console.error('Error fetching pollution data:', error);
        
        // Fallback to mock data
        const mockData = getMockPollutionData(city);
        cityDataCache[city] = { data: mockData, timestamp: Date.now() };
        displayPollutionData(city, mockData);
        loading.style.display = 'none';
        
        errorMessage.style.display = 'block';
        errorMessage.textContent = `Using estimated data. API error: ${error.message}`;
    }
}

// Get mock pollution data (fallback)
function getMockPollutionData(city) {
    // Mock data based on typical pollution levels in Indian cities
    const mockData = {
        'Delhi': { pm25: 150, pm10: 250, aqi: 300 },
        'Chennai': { pm25: 80, pm10: 120, aqi: 150 },
        'Bangalore': { pm25: 70, pm10: 110, aqi: 140 },
        'Mumbai': { pm25: 100, pm10: 150, aqi: 200 },
        'Hyderabad': { pm25: 85, pm10: 130, aqi: 160 },
        'Kolkata': { pm25: 110, pm10: 170, aqi: 210 },
        'Pune': { pm25: 75, pm10: 115, aqi: 145 },
        'Jaipur': { pm25: 95, pm10: 140, aqi: 185 },
        'Ahmedabad': { pm25: 105, pm10: 160, aqi: 205 }
    };

    return mockData[city] || { pm25: 100, pm10: 150, aqi: 200 };
}

// Calculate AQI from PM value (simplified)
function calculateAQI(pmValue, type) {
    // Simplified AQI calculation
    // In production, use proper AQI formula
    if (type === 'pm25') {
        if (pmValue <= 12) return Math.round((pmValue / 12) * 50);
        if (pmValue <= 35.4) return Math.round(50 + ((pmValue - 12) / 23.4) * 50);
        if (pmValue <= 55.4) return Math.round(100 + ((pmValue - 35.4) / 20) * 50);
        if (pmValue <= 150.4) return Math.round(150 + ((pmValue - 55.4) / 95) * 50);
        if (pmValue <= 250.4) return Math.round(200 + ((pmValue - 150.4) / 100) * 50);
        return Math.round(300 + ((pmValue - 250.4) / 149.6) * 100);
    } else {
        // PM10
        if (pmValue <= 54) return Math.round((pmValue / 54) * 50);
        if (pmValue <= 154) return Math.round(50 + ((pmValue - 54) / 100) * 50);
        if (pmValue <= 254) return Math.round(100 + ((pmValue - 154) / 100) * 50);
        if (pmValue <= 354) return Math.round(150 + ((pmValue - 254) / 100) * 50);
        if (pmValue <= 424) return Math.round(200 + ((pmValue - 354) / 70) * 50);
        return Math.round(300 + ((pmValue - 424) / 176) * 100);
    }
}

// Display pollution data
function displayPollutionData(city, data) {
    document.getElementById('aqiValue').textContent = data.aqi || 'N/A';
    document.getElementById('pm25Value').textContent = data.pm25 ? Math.round(data.pm25) : 'N/A';
    document.getElementById('pm10Value').textContent = data.pm10 ? Math.round(data.pm10) : 'N/A';

    // Calculate tree recommendations
    calculateTreeRecommendations(city, data);

    // Calculate daily offset
    calculateDailyOffset(city);

    // Show before/after simulation
    showBeforeAfterSimulation(city, data);

    document.getElementById('pollutionData').style.display = 'block';
}

// Calculate daily offset
function calculateDailyOffset(city) {
    const calculations = Calculations.getAll();
    const userTrees = calculations.map(calc => ({
        species: calc.species,
        count: calc.count || 0
    })).filter(tree => tree.count > 0);

    const dailyOffset = RealTimeAQI.calculateDailyOffset(city, userTrees);
    const dailyOffsetDiv = document.getElementById('dailyOffset');

    let html = `
        <div class="metric-card" style="background: ${dailyOffset.healthImpact.color}; color: white; margin-bottom: 1rem;">
            <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">Today's AQI: ${dailyOffset.todayAQI}</div>
            <div style="font-size: 2rem; font-weight: bold; margin: 0.5rem 0;">${dailyOffset.healthImpact.level}</div>
            <div>Health Risk: ${dailyOffset.healthImpact.risk}</div>
        </div>

        <div class="summary-grid" style="margin-top: 1rem;">
            <div class="summary-card">
                <h3>${Utils.formatNumber(Math.round(dailyOffset.dailyCO2Offset))}</h3>
                <p>Daily CO₂ Offset (kg)</p>
            </div>
            <div class="summary-card">
                <h3>${Utils.formatNumber(Math.round(dailyOffset.dailyO2Production))}</h3>
                <p>Daily O₂ Production (kg)</p>
            </div>
            <div class="summary-card">
                <h3>${dailyOffset.projectedAQI}</h3>
                <p>Projected AQI (with trees)</p>
            </div>
        </div>

        <div class="alert alert-info" style="margin-top: 1rem;">
            <strong>💡 ${dailyOffset.message}</strong>
            ${dailyOffset.treesNeededForHealthy > 0 ? `<br><small>Need ${Utils.formatNumber(dailyOffset.treesNeededForHealthy)} more trees to reach healthy AQI (50)</small>` : ''}
        </div>
    `;

    dailyOffsetDiv.innerHTML = html;
}

// Show before/after simulation
function showBeforeAfterSimulation(city, pollutionData) {
    const calculations = Calculations.getAll();
    const totalTrees = calculations.reduce((sum, calc) => sum + (calc.count || 0), 0);
    const avgSpecies = calculations.length > 0 ? calculations[0].species : 'Neem';

    const scenario = {
        city: city,
        currentAQI: pollutionData.aqi || 200,
        treesToPlant: totalTrees || 100,
        species: avgSpecies
    };

    const simulation = PollutionSimulation.simulate(scenario);
    
    // Add before/after section if not exists
    let beforeAfterDiv = document.getElementById('beforeAfterSimulation');
    if (!beforeAfterDiv) {
        const comparisonDiv = document.querySelector('.card:last-of-type');
        beforeAfterDiv = document.createElement('div');
        beforeAfterDiv.id = 'beforeAfterSimulation';
        beforeAfterDiv.className = 'card';
        beforeAfterDiv.style.marginTop = '2rem';
        comparisonDiv.parentNode.insertBefore(beforeAfterDiv, comparisonDiv.nextSibling);
    }

    let html = `
        <h2 class="card-title">Before/After Pollution Impact Simulation</h2>
        <p>See how different tree planting scenarios affect air quality</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
            <!-- Before -->
            <div class="card" style="border-left: 5px solid #dc3545;">
                <h3 style="color: #dc3545; margin-bottom: 1rem;">Current (Before)</h3>
                <div class="metric-card" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);">
                    <div style="font-size: 2rem; font-weight: bold;">AQI: ${simulation.before.aqi}</div>
                    <div style="margin-top: 0.5rem;">${simulation.before.healthImpact.level}</div>
                </div>
                <div style="margin-top: 1rem;">
                    <p><strong>PM2.5:</strong> ${Math.round(simulation.before.pm25)} μg/m³</p>
                    <p><strong>PM10:</strong> ${Math.round(simulation.before.pm10)} μg/m³</p>
                    <p><strong>Health Risk:</strong> ${simulation.before.healthImpact.risk}</p>
                </div>
            </div>

            <!-- After 100 Trees -->
            <div class="card" style="border-left: 5px solid #ff9800;">
                <h3 style="color: #ff9800; margin-bottom: 1rem;">100 Trees</h3>
                <div class="metric-card" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">
                    <div style="font-size: 2rem; font-weight: bold;">AQI: ${simulation.after100.aqi}</div>
                    <div style="margin-top: 0.5rem;">${simulation.after100.healthImpact.level}</div>
                </div>
                <div style="margin-top: 1rem;">
                    <p><strong>Improvement:</strong> ${Math.round(simulation.after100.improvement)}%</p>
                    <p><strong>CO₂ Offset:</strong> ${Utils.formatNumber(Math.round(simulation.after100.co2Offset))} kg/year</p>
                    <p><strong>Health Risk:</strong> ${simulation.after100.healthImpact.risk}</p>
                </div>
            </div>

            <!-- After 500 Trees -->
            <div class="card" style="border-left: 5px solid #4CAF50;">
                <h3 style="color: #4CAF50; margin-bottom: 1rem;">500 Trees</h3>
                <div class="metric-card" style="background: linear-gradient(135deg, #4CAF50 0%, #388e3c 100%);">
                    <div style="font-size: 2rem; font-weight: bold;">AQI: ${simulation.after500.aqi}</div>
                    <div style="margin-top: 0.5rem;">${simulation.after500.healthImpact.level}</div>
                </div>
                <div style="margin-top: 1rem;">
                    <p><strong>Improvement:</strong> ${Math.round(simulation.after500.improvement)}%</p>
                    <p><strong>CO₂ Offset:</strong> ${Utils.formatNumber(Math.round(simulation.after500.co2Offset))} kg/year</p>
                    <p><strong>Health Risk:</strong> ${simulation.after500.healthImpact.risk}</p>
                </div>
            </div>

            <!-- After 1000 Trees -->
            <div class="card" style="border-left: 5px solid #2196F3;">
                <h3 style="color: #2196F3; margin-bottom: 1rem;">1000 Trees</h3>
                <div class="metric-card" style="background: linear-gradient(135deg, #2196F3 0%, #1976d2 100%);">
                    <div style="font-size: 2rem; font-weight: bold;">AQI: ${simulation.after1000.aqi}</div>
                    <div style="margin-top: 0.5rem;">${simulation.after1000.healthImpact.level}</div>
                </div>
                <div style="margin-top: 1rem;">
                    <p><strong>Improvement:</strong> ${Math.round(simulation.after1000.improvement)}%</p>
                    <p><strong>CO₂ Offset:</strong> ${Utils.formatNumber(Math.round(simulation.after1000.co2Offset))} kg/year</p>
                    <p><strong>Health Risk:</strong> ${simulation.after1000.healthImpact.risk}</p>
                </div>
            </div>

            <!-- Optimal -->
            <div class="card" style="border-left: 5px solid #9C27B0;">
                <h3 style="color: #9C27B0; margin-bottom: 1rem;">Optimal (Target)</h3>
                <div class="metric-card" style="background: linear-gradient(135deg, #9C27B0 0%, #7b1fa2 100%);">
                    <div style="font-size: 2rem; font-weight: bold;">AQI: ${simulation.optimal.aqi}</div>
                    <div style="margin-top: 0.5rem;">${simulation.optimal.healthImpact.level}</div>
                </div>
                <div style="margin-top: 1rem;">
                    <p><strong>Trees Needed:</strong> ${Utils.formatNumber(simulation.optimal.trees)}</p>
                    <p><strong>Improvement:</strong> ${Math.round(simulation.optimal.improvement)}%</p>
                    <p><strong>CO₂ Offset:</strong> ${Utils.formatNumber(Math.round(simulation.optimal.co2Offset))} kg/year</p>
                    <p><strong>Health Risk:</strong> ${simulation.optimal.healthImpact.risk}</p>
                </div>
            </div>
        </div>
    `;

    beforeAfterDiv.innerHTML = html;
}

// Calculate tree recommendations
function calculateTreeRecommendations(city, pollutionData) {
    const recommendationsDiv = document.getElementById('treeRecommendations');
    
    // Estimate annual CO2 emissions per person in the city
    // Average Indian city: ~2 tonnes CO2 per person per year
    // For high pollution cities, estimate higher
    const avgCO2PerPerson = pollutionData.aqi > 200 ? 2.5 : 2.0; // tonnes
    const cityPopulation = {
        'Delhi': 19000000,
        'Chennai': 11000000,
        'Bangalore': 13000000,
        'Mumbai': 20000000,
        'Hyderabad': 10000000,
        'Kolkata': 14800000,
        'Pune': 8000000,
        'Jaipur': 4000000,
        'Ahmedabad': 8400000
    }[city] || 10000000;

    const totalAnnualCO2 = avgCO2PerPerson * cityPopulation; // tonnes
    const totalAnnualCO2kg = totalAnnualCO2 * 1000; // kg

    // Calculate trees needed for each species
    const recommendations = Object.keys(TREE_SPECIES).map(species => {
        const tree = getTreeData(species);
        const co2PerYear = tree ? (tree.co2PerYear || tree) : 20;
        const treesNeeded = Math.ceil(totalAnnualCO2kg / co2PerYear);
        return { species, treesNeeded, co2PerYear };
    }).sort((a, b) => a.treesNeeded - b.treesNeeded);

    let html = `
        <div class="alert alert-info">
            <strong>Estimated Annual CO₂ Emissions for ${city}:</strong> ${Utils.formatNumber(Math.round(totalAnnualCO2))} tonnes
            <br><small>Based on population and pollution levels</small>
        </div>
        <h3 style="margin-top: 1.5rem;">Recommended Trees to Offset Annual Emissions:</h3>
        <div style="display: grid; gap: 1rem; margin-top: 1rem;">
    `;

    recommendations.forEach(rec => {
        html += `
            <div class="result-item">
                <div>
                    <strong>${rec.species}</strong><br>
                    <small>CO₂ absorption: ${rec.co2PerYear} kg/tree/year</small>
                </div>
                <div style="text-align: right;">
                    <strong style="font-size: 1.2rem; color: var(--green-primary);">
                        ${Utils.formatNumber(rec.treesNeeded)} trees
                    </strong>
                </div>
            </div>
        `;
    });

    html += '</div>';
    recommendationsDiv.innerHTML = html;
}

// Compare all cities
async function compareAllCities() {
    const cities = Object.keys(CITY_COORDINATES);
    const comparisonData = {
        labels: [],
        pm25: [],
        pm10: [],
        aqi: []
    };

    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    // Load data for all cities
    for (const city of cities) {
        if (!cityDataCache[city] || (Date.now() - cityDataCache[city].timestamp) > 300000) {
            // Need to fetch data
            const coords = CITY_COORDINATES[city];
            try {
                const url = `https://api.openaq.org/v2/latest?limit=1&page=1&offset=0&sort=desc&radius=25000&coordinates=${coords.lat}%2C${coords.lng}`;
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.results && data.results.length > 0) {
                    const result = data.results[0];
                    const measurements = result.measurements || [];
                    const pollutionData = { pm25: null, pm10: null, aqi: null };
                    
                    measurements.forEach(measurement => {
                        if (measurement.parameter === 'pm25') pollutionData.pm25 = measurement.value;
                        if (measurement.parameter === 'pm10') pollutionData.pm10 = measurement.value;
                    });
                    
                    if (pollutionData.pm25) {
                        pollutionData.aqi = calculateAQI(pollutionData.pm25, 'pm25');
                    }
                    
                    cityDataCache[city] = { data: pollutionData, timestamp: Date.now() };
                } else {
                    cityDataCache[city] = { data: getMockPollutionData(city), timestamp: Date.now() };
                }
            } catch (error) {
                cityDataCache[city] = { data: getMockPollutionData(city), timestamp: Date.now() };
            }
        }

        const data = cityDataCache[city].data;
        comparisonData.labels.push(city);
        comparisonData.pm25.push(data.pm25 || 0);
        comparisonData.pm10.push(data.pm10 || 0);
        comparisonData.aqi.push(data.aqi || 0);
    }

    loading.style.display = 'none';

    // Draw comparison chart
    drawComparisonChart(comparisonData);
}

// Draw comparison chart
function drawComparisonChart(data) {
    const ctx = document.getElementById('comparisonChart').getContext('2d');

    if (comparisonChart) {
        comparisonChart.destroy();
    }

    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'PM2.5 (μg/m³)',
                    data: data.pm25,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 2
                },
                {
                    label: 'PM10 (μg/m³)',
                    data: data.pm10,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 2
                },
                {
                    label: 'AQI',
                    data: data.aqi,
                    backgroundColor: 'rgba(255, 206, 86, 0.6)',
                    borderColor: 'rgb(255, 206, 86)',
                    borderWidth: 2,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'City Pollution Comparison'
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'PM2.5 & PM10 (μg/m³)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'AQI'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Top 20 Most Polluted Cities in India (based on AQI)
const TOP_20_POLLUTED_CITIES = [
    { name: 'Delhi', aqi: 342, pm25: 250, pm10: 400, population: 19000000, lat: 28.6139, lng: 77.2090 },
    { name: 'Ghaziabad', aqi: 338, pm25: 248, pm10: 395, population: 3800000, lat: 28.6692, lng: 77.4538 },
    { name: 'Noida', aqi: 335, pm25: 245, pm10: 390, population: 1200000, lat: 28.5355, lng: 77.3910 },
    { name: 'Gurgaon', aqi: 328, pm25: 240, pm10: 385, population: 900000, lat: 28.4089, lng: 77.0378 },
    { name: 'Lucknow', aqi: 320, pm25: 235, pm10: 375, population: 2900000, lat: 26.8467, lng: 80.9462 },
    { name: 'Kanpur', aqi: 315, pm25: 230, pm10: 370, population: 2800000, lat: 26.4499, lng: 80.3319 },
    { name: 'Faridabad', aqi: 312, pm25: 228, pm10: 365, population: 1400000, lat: 28.4089, lng: 77.3178 },
    { name: 'Agra', aqi: 308, pm25: 225, pm10: 360, population: 1600000, lat: 27.1767, lng: 78.0081 },
    { name: 'Patna', aqi: 305, pm25: 222, pm10: 355, population: 2000000, lat: 25.5941, lng: 85.1376 },
    { name: 'Varanasi', aqi: 300, pm25: 220, pm10: 350, population: 1200000, lat: 25.3176, lng: 82.9739 },
    { name: 'Allahabad', aqi: 298, pm25: 218, pm10: 345, population: 1100000, lat: 25.4358, lng: 81.8463 },
    { name: 'Ahmedabad', aqi: 295, pm25: 215, pm10: 340, population: 8400000, lat: 23.0225, lng: 72.5714 },
    { name: 'Jaipur', aqi: 290, pm25: 210, pm10: 335, population: 4000000, lat: 26.9124, lng: 75.7873 },
    { name: 'Meerut', aqi: 288, pm25: 208, pm10: 330, population: 1400000, lat: 28.9845, lng: 77.7064 },
    { name: 'Bareilly', aqi: 285, pm25: 205, pm10: 325, population: 900000, lat: 28.3670, lng: 79.4304 },
    { name: 'Raipur', aqi: 282, pm25: 202, pm10: 320, population: 1200000, lat: 21.2514, lng: 81.6296 },
    { name: 'Jodhpur', aqi: 280, pm25: 200, pm10: 315, population: 1100000, lat: 26.2389, lng: 73.0243 },
    { name: 'Kolkata', aqi: 278, pm25: 198, pm10: 310, population: 14800000, lat: 22.5726, lng: 88.3639 },
    { name: 'Ludhiana', aqi: 275, pm25: 195, pm10: 305, population: 1600000, lat: 30.9010, lng: 75.8573 },
    { name: 'Amritsar', aqi: 272, pm25: 192, pm10: 300, population: 1200000, lat: 31.6340, lng: 74.8723 }
];

// Get recommended trees based on pollution level
function getRecommendedTrees(aqi) {
    // High pollution (AQI > 250): Recommend high CO2 absorbing trees
    // Medium pollution (AQI 150-250): Recommend medium-high trees
    // Lower pollution (AQI < 150): Recommend variety of trees
    
    if (aqi > 250) {
        // Very high pollution - recommend trees with highest CO2 absorption
        return [
            { species: 'Banyan', co2PerYear: 48, priority: 'Very High' },
            { species: 'Peepal', co2PerYear: 45, priority: 'Very High' },
            { species: 'Banyan Fig', co2PerYear: 44, priority: 'Very High' },
            { species: 'Bamboo', co2PerYear: 40, priority: 'High' },
            { species: 'Semal', co2PerYear: 38, priority: 'High' },
            { species: 'Cedar', co2PerYear: 35, priority: 'High' },
            { species: 'Eucalyptus', co2PerYear: 30, priority: 'Medium' }
        ];
    } else if (aqi > 200) {
        // High pollution
        return [
            { species: 'Banyan', co2PerYear: 48, priority: 'Very High' },
            { species: 'Peepal', co2PerYear: 45, priority: 'Very High' },
            { species: 'Bamboo', co2PerYear: 40, priority: 'High' },
            { species: 'Semal', co2PerYear: 38, priority: 'High' },
            { species: 'Cedar', co2PerYear: 35, priority: 'High' },
            { species: 'Mahogany', co2PerYear: 32, priority: 'High' },
            { species: 'Eucalyptus', co2PerYear: 30, priority: 'Medium' }
        ];
    } else if (aqi > 150) {
        // Medium-high pollution
        return [
            { species: 'Banyan', co2PerYear: 48, priority: 'High' },
            { species: 'Bamboo', co2PerYear: 40, priority: 'High' },
            { species: 'Cedar', co2PerYear: 35, priority: 'High' },
            { species: 'Mahogany', co2PerYear: 32, priority: 'Medium' },
            { species: 'Teak', co2PerYear: 28, priority: 'Medium' },
            { species: 'Oak', co2PerYear: 25, priority: 'Medium' },
            { species: 'Jamun', co2PerYear: 24, priority: 'Medium' }
        ];
    } else {
        // Lower pollution - variety
        return [
            { species: 'Neem', co2PerYear: 20, priority: 'Good' },
            { species: 'Mango', co2PerYear: 22, priority: 'Good' },
            { species: 'Banyan', co2PerYear: 48, priority: 'Excellent' },
            { species: 'Peepal', co2PerYear: 45, priority: 'Excellent' },
            { species: 'Bamboo', co2PerYear: 40, priority: 'Excellent' },
            { species: 'Eucalyptus', co2PerYear: 30, priority: 'Good' },
            { species: 'Oak', co2PerYear: 25, priority: 'Good' }
        ];
    }
}

// Display top 20 most polluted cities
function displayTop20Cities() {
    const citiesList = document.getElementById('top20CitiesList');
    
    let html = '<div style="margin-top: 2rem;">';
    
    TOP_20_POLLUTED_CITIES.forEach((city, index) => {
        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
        const recommendedTrees = getRecommendedTrees(city.aqi);
        
        // Calculate trees needed per 1000 people
        const avgCO2PerPerson = city.aqi > 200 ? 2.5 : 2.0; // tonnes
        const annualCO2 = (avgCO2PerPerson * city.population) * 1000; // kg
        const treesNeeded = Math.ceil(annualCO2 / recommendedTrees[0].co2PerYear);
        
        html += `
            <div class="card" style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h3 style="color: var(--green-primary); margin-bottom: 0.5rem;">
                            ${medal} ${city.name}
                        </h3>
                        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
                            <div><strong>AQI:</strong> <span style="color: ${city.aqi > 300 ? '#dc3545' : city.aqi > 200 ? '#ff9800' : '#4caf50'}">${city.aqi}</span></div>
                            <div><strong>PM2.5:</strong> ${city.pm25} μg/m³</div>
                            <div><strong>PM10:</strong> ${city.pm10} μg/m³</div>
                            <div><strong>Population:</strong> ${Utils.formatNumber(city.population)}</div>
                        </div>
                    </div>
                </div>
                
                <div style="background: var(--green-light); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong>Estimated Annual CO₂ Emissions:</strong> ${Utils.formatNumber(Math.round(annualCO2 / 1000))} tonnes
                    <br><small>Estimated trees needed to offset (${recommendedTrees[0].species}): ${Utils.formatNumber(treesNeeded)}</small>
                </div>
                
                <div>
                    <strong>Recommended Trees (Priority Order):</strong>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 0.75rem;">
                        ${recommendedTrees.map(tree => `
                            <div style="background: white; padding: 0.75rem; border-radius: 6px; border-left: 4px solid var(--green-primary);">
                                <strong>${tree.species}</strong><br>
                                <small>${tree.co2PerYear} kg/year</small><br>
                                <span style="font-size: 0.85rem; color: ${tree.priority === 'Very High' || tree.priority === 'High' ? '#dc3545' : tree.priority === 'Medium' ? '#ff9800' : '#4caf50'}">
                                    ${tree.priority} Priority
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    citiesList.innerHTML = html;
}

// Initialize top 20 cities on page load
document.addEventListener('DOMContentLoaded', () => {
    displayTop20Cities();
});

// Make functions available globally
window.loadCityData = loadCityData;
window.compareAllCities = compareAllCities;


