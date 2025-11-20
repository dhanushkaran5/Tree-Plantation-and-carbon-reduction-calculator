// Advanced Calculator JavaScript

let oxygenChart = null;
let futureChart = null;

// Tab navigation
function showFeature(featureId) {
    // Hide all features
    document.querySelectorAll('.feature-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.feature-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected feature
    document.getElementById(featureId).classList.add('active');
    event.target.classList.add('active');
}

// Oxygen Calculator
function calculateOxygen(event) {
    event.preventDefault();

    const species = document.getElementById('oxygenSpecies').value;
    const count = parseInt(document.getElementById('oxygenCount').value);
    const years = parseInt(document.getElementById('oxygenYears').value);

    if (!species || !count || !years) {
        Utils.showAlert('Please fill in all fields', 'error');
        return;
    }

    const result = OxygenCalculator.calculateOxygen(species, count, years);
    const overTime = OxygenCalculator.calculateOxygenOverTime(species, count, years);
    const peopleSupported = OxygenCalculator.calculatePeopleSupported(result.total);

    // Display results
    document.getElementById('annualOxygen').textContent = Utils.formatNumber(Math.round(result.annual));
    document.getElementById('totalOxygen').textContent = Utils.formatNumber(Math.round(result.total));
    document.getElementById('peopleSupported').textContent = peopleSupported;
    document.getElementById('oxygenYearsDisplay').textContent = years;

    // Draw chart
    drawOxygenChart(overTime);

    document.getElementById('oxygenResults').style.display = 'block';
    document.getElementById('oxygenResults').scrollIntoView({ behavior: 'smooth' });
}

// Draw Oxygen Chart
function drawOxygenChart(data) {
    const ctx = document.getElementById('oxygenChart').getContext('2d');

    if (oxygenChart) {
        oxygenChart.destroy();
    }

    oxygenChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => `Year ${d.year}`),
            datasets: [
                {
                    label: 'Cumulative Oxygen (kg)',
                    data: data.map(d => d.cumulative),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Annual Oxygen (kg)',
                    data: data.map(d => d.annual),
                    borderColor: '#2c6e49',
                    backgroundColor: 'rgba(44, 110, 73, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'People Supported',
                    data: data.map(d => d.peopleSupported),
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: true,
                    tension: 0.4,
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
                    text: 'Oxygen Production Over Time'
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
                        text: 'Oxygen (kg)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'People Supported'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Tree Optimizer
function optimizeTrees(event) {
    event.preventDefault();

    const targetCO2 = parseFloat(document.getElementById('targetCO2').value);

    if (!targetCO2 || targetCO2 < 1) {
        Utils.showAlert('Please enter a valid target CO₂', 'error');
        return;
    }

    const solutions = TreeOptimizer.optimize(targetCO2);
    const bestSolution = solutions[0];

    let html = `
        <div class="optimizer-result">
            <h3>Optimal Tree Combination</h3>
            <p><strong>Target:</strong> ${Utils.formatNumber(targetCO2)} kg CO₂/year</p>
            <p><strong>Efficiency:</strong> ${bestSolution.efficiency.toFixed(2)} kg CO₂ per ₹</p>
            <p><strong>Total Cost:</strong> ₹${Utils.formatNumber(Math.round(bestSolution.totalCost))}</p>
            <p><strong>Annual Water Required:</strong> ${Utils.formatNumber(Math.round(bestSolution.totalWaterPerYear))} liters</p>
            <p><strong>People Supported:</strong> ${bestSolution.peopleSupported} adults</p>
            
            <h4 style="margin-top: 1.5rem;">Recommended Tree Mix:</h4>
            <div style="display: grid; gap: 1rem; margin-top: 1rem;">
    `;

    bestSolution.trees.forEach(tree => {
        html += `
            <div class="result-item">
                <div>
                    <strong>${tree.species}</strong><br>
                    <small>CO₂: ${tree.co2Reduction} kg/year | O₂: ${Utils.formatNumber(Math.round(tree.oxygenProduction))} kg/year</small>
                </div>
                <div style="text-align: right;">
                    <strong style="font-size: 1.2rem; color: var(--green-primary);">${tree.count} trees</strong><br>
                    <small>Cost: ₹${tree.cost} | Water: ${Utils.formatNumber(Math.round(tree.waterRequired))} L/year</small>
                </div>
            </div>
        `;
    });

    html += `
            </div>
            ${solutions.length > 1 ? `
            <details style="margin-top: 1rem;">
                <summary style="cursor: pointer; color: var(--green-primary); font-weight: bold;">View Alternative Solutions (${solutions.length - 1})</summary>
                <div style="margin-top: 1rem;">
            ` : ''}
    `;

    if (solutions.length > 1) {
        solutions.slice(1, 4).forEach((solution, index) => {
            html += `
                <div class="optimizer-result" style="margin-top: 1rem; opacity: 0.9;">
                    <strong>Alternative ${index + 2}:</strong>
                    <p>Cost: ₹${Utils.formatNumber(Math.round(solution.totalCost))} | 
                       Water: ${Utils.formatNumber(Math.round(solution.totalWaterPerYear))} L/year |
                       Efficiency: ${solution.efficiency.toFixed(2)} kg/₹</p>
                    <small>${solution.trees.map(t => `${t.count} ${t.species}`).join(', ')}</small>
                </div>
            `;
        });
        html += `</div></details>`;
    }

    html += '</div>';

    document.getElementById('optimizerResults').innerHTML = html;
    document.getElementById('optimizerResults').scrollIntoView({ behavior: 'smooth' });
}

// Water Calculator
function calculateWater(event) {
    event.preventDefault();

    const species = document.getElementById('waterSpecies').value;
    const count = parseInt(document.getElementById('waterCount').value);
    const years = parseInt(document.getElementById('waterYears').value);

    if (!species || !count || !years) {
        Utils.showAlert('Please fill in all fields', 'error');
        return;
    }

    const result = WaterCalculator.calculateWaterRequirements(species, count, years);

    document.getElementById('waterPerWeek').textContent = Utils.formatNumber(Math.round(result.perWeek));
    document.getElementById('waterPerMonth').textContent = Utils.formatNumber(Math.round(result.perMonth));
    document.getElementById('waterPerYear').textContent = Utils.formatNumber(Math.round(result.perYear));

    document.getElementById('waterResults').style.display = 'block';
    document.getElementById('waterResults').scrollIntoView({ behavior: 'smooth' });
}

// Cost Estimator
function calculateCost(event) {
    event.preventDefault();

    const species = document.getElementById('costSpecies').value;
    const count = parseInt(document.getElementById('costCount').value);
    const years = parseInt(document.getElementById('costYears').value);

    if (!species || !count || !years) {
        Utils.showAlert('Please fill in all fields', 'error');
        return;
    }

    const result = CostEstimator.calculateTotalCost(species, count, years);

    document.getElementById('saplingCost').textContent = '₹' + Utils.formatNumber(Math.round(result.saplingCost));
    document.getElementById('maintenanceCost').textContent = '₹' + Utils.formatNumber(Math.round(result.maintenanceCost));
    document.getElementById('totalCost').textContent = '₹' + Utils.formatNumber(Math.round(result.totalCost));

    document.getElementById('costResults').style.display = 'block';
    document.getElementById('costResults').scrollIntoView({ behavior: 'smooth' });
}

// Soil Suitability
function findSoilTrees(event) {
    event.preventDefault();

    const soilType = document.getElementById('soilType').value;
    const climateZone = document.getElementById('climateZone').value;

    if (!soilType || !climateZone) {
        Utils.showAlert('Please select soil type and climate zone', 'error');
        return;
    }

    const trees = SoilSuitability.getBestTreeForConditions(soilType, climateZone);

    let html = '<div style="margin-top: 1.5rem;"><h3>Recommended Trees:</h3>';
    html += '<div style="display: grid; gap: 1rem; margin-top: 1rem;">';

    trees.forEach(tree => {
        const treeData = getTreeData(tree.species);
        html += `
            <div class="result-item">
                <div>
                    <strong>${tree.species}</strong><br>
                    <small>CO₂: ${tree.co2PerYear} kg/year | O₂: ${Utils.formatNumber(tree.oxygenPerYear)} kg/year</small><br>
                    <small>Pollution Tolerance: ${tree.pollutionTolerance} | 
                           Disease Resistance: ${tree.diseaseResistance} | 
                           Survival Risk: ${tree.survivalRisk}</small>
                </div>
                <div style="text-align: right;">
                    <span style="color: var(--green-primary); font-weight: bold;">✓ Suitable</span>
                </div>
            </div>
        `;
    });

    html += '</div></div>';

    document.getElementById('soilResults').innerHTML = html;
    document.getElementById('soilResults').scrollIntoView({ behavior: 'smooth' });
}

// Future Prediction
function predictFuture(event) {
    event.preventDefault();

    const presentTrees = parseInt(document.getElementById('presentTrees').value) || 0;
    const annualPlanting = parseInt(document.getElementById('annualPlanting').value);
    const years = parseInt(document.getElementById('predictionYears').value);
    const currentAQI = parseInt(document.getElementById('currentAQI').value);

    if (!annualPlanting || !years || !currentAQI) {
        Utils.showAlert('Please fill in all fields', 'error');
        return;
    }

    const predictions = FuturePredictor.predict(presentTrees, annualPlanting, years, currentAQI);

    // Draw chart
    drawFutureChart(predictions, currentAQI);

    document.getElementById('futureResults').style.display = 'block';
    document.getElementById('futureResults').scrollIntoView({ behavior: 'smooth' });
}

// Draw Future Chart
function drawFutureChart(predictions, currentAQI) {
    const ctx = document.getElementById('futureChart').getContext('2d');

    if (futureChart) {
        futureChart.destroy();
    }

    futureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: predictions.map(p => `Year ${p.year}`),
            datasets: [
                {
                    label: 'Total Trees',
                    data: predictions.map(p => p.totalTrees),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: 'Predicted AQI',
                    data: predictions.map(p => p.predictedAQI),
                    borderColor: '#FF9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    fill: true,
                    yAxisID: 'y1'
                },
                {
                    label: 'Pollution Reduction %',
                    data: predictions.map(p => p.pollutionReduction),
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: true,
                    yAxisID: 'y2'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Future Environment Prediction'
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
                        text: 'Total Trees'
                    },
                    position: 'left'
                },
                y1: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'AQI'
                    },
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    }
                },
                y2: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Reduction %'
                    },
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Survival Risk Calculator
function calculateRisk(event) {
    event.preventDefault();

    const species = document.getElementById('riskSpecies').value;
    const city = document.getElementById('riskCity').value;
    const aqi = parseInt(document.getElementById('riskAQI').value);
    const waterSupply = document.getElementById('waterSupply').value;
    const heatLevel = document.getElementById('heatLevel').value;

    if (!species || !city || !aqi) {
        Utils.showAlert('Please fill in all required fields', 'error');
        return;
    }

    const risk = SurvivalRiskCalculator.calculateRisk(species, city, aqi, waterSupply, heatLevel);

    document.getElementById('riskPercentage').textContent = risk.percentage + '%';
    document.getElementById('riskCategory').textContent = risk.category + ' Risk';
    document.getElementById('riskBar').style.width = risk.percentage + '%';
    
    // Color code the risk
    const riskBar = document.getElementById('riskBar');
    if (risk.percentage > 70) {
        riskBar.style.background = 'linear-gradient(90deg, #dc3545 0%, #c82333 100%)';
    } else if (risk.percentage > 50) {
        riskBar.style.background = 'linear-gradient(90deg, #ff9800 0%, #f57c00 100%)';
    } else if (risk.percentage > 30) {
        riskBar.style.background = 'linear-gradient(90deg, #ffc107 0%, #ffa000 100%)';
    } else {
        riskBar.style.background = 'linear-gradient(90deg, #4caf50 0%, #388e3c 100%)';
    }

    document.getElementById('riskResults').style.display = 'block';
    document.getElementById('riskResults').scrollIntoView({ behavior: 'smooth' });
}

// Climate Planner
function getClimateRecommendations(event) {
    event.preventDefault();

    const city = document.getElementById('climateCity').value;

    if (!city) {
        Utils.showAlert('Please select a city', 'error');
        return;
    }

    // Get climate recommendations
    const recommendations = ClimateRecommender.getClimateRecommendations(city);
    const calendar = ClimateCalendar.getPlantingCalendar(city);

    // Display climate information
    const climateInfo = `
        <div class="result-item">
            <div><strong>City:</strong> ${city}</div>
            <div><strong>Climate Zone:</strong> ${recommendations.climate.zone}</div>
            <div><strong>Subzone:</strong> ${recommendations.climate.subzone}</div>
            <div><strong>Average Temperature:</strong> ${recommendations.climate.avgTemp}°C</div>
            <div><strong>Annual Rainfall:</strong> ${recommendations.climate.rainfall} mm</div>
            <div><strong>Humidity:</strong> ${recommendations.climate.humidity}%</div>
        </div>
    `;
    document.getElementById('climateInfo').innerHTML = climateInfo;

    // Display recommended trees
    let treesHtml = '<div style="display: grid; gap: 1rem; margin-top: 1rem;">';
    recommendations.recommendedTrees.forEach((tree, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        treesHtml += `
            <div class="result-item">
                <div>
                    <strong>${medal} ${tree.species}</strong><br>
                    <small>CO₂: ${tree.co2PerYear} kg/year | O₂: ${Utils.formatNumber(tree.oxygenPerYear)} kg/year</small><br>
                    <small>Pollution Tolerance: ${tree.pollutionTolerance} | Survival Risk: ${tree.survivalRisk} | Water: ${tree.waterPerWeek} L/week</small>
                </div>
                <div style="text-align: right;">
                    <span style="color: var(--green-primary); font-weight: bold;">Score: ${Math.round(tree.score)}</span>
                </div>
            </div>
        `;
    });
    treesHtml += '</div>';
    document.getElementById('climateTrees').innerHTML = treesHtml;

    // Display best planting months
    let monthsHtml = '<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem;">';
    recommendations.bestPlantingMonths.forEach(month => {
        monthsHtml += `
            <span class="achievement-badge unlocked" style="font-size: 1rem; padding: 0.75rem 1rem;">
                ${month}
            </span>
        `;
    });
    monthsHtml += '</div>';
    document.getElementById('plantingMonths').innerHTML = monthsHtml;

    // Display considerations
    let considerationsHtml = '<ul style="margin-top: 1rem; padding-left: 1.5rem;">';
    recommendations.considerations.forEach(consideration => {
        considerationsHtml += `<li style="margin-bottom: 0.5rem;">${consideration}</li>`;
    });
    considerationsHtml += '</ul>';
    document.getElementById('climateConsiderations').innerHTML = considerationsHtml;

    // Display planting calendar
    let calendarHtml = '<div style="margin-top: 1rem;">';
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    months.forEach(month => {
        if (calendar.calendar[month] && calendar.calendar[month].length > 0) {
            calendarHtml += `
                <div class="card" style="margin-bottom: 1rem;">
                    <h4 style="color: var(--green-primary); margin-bottom: 1rem;">${month}</h4>
                    <div style="display: grid; gap: 0.75rem;">
            `;
            calendar.calendar[month].slice(0, 5).forEach(tree => {
                calendarHtml += `
                    <div style="background: var(--green-light); padding: 0.75rem; border-radius: 6px; border-left: 4px solid var(--green-primary);">
                        <strong>${tree.species}</strong> - ${tree.co2PerYear} kg CO₂/year
                        <span style="float: right; color: var(--green-primary); font-weight: bold;">
                            Priority: ${Math.round(tree.priority)}
                        </span>
                    </div>
                `;
            });
            calendarHtml += '</div></div>';
        }
    });
    calendarHtml += '</div>';
    document.getElementById('plantingCalendar').innerHTML = calendarHtml;

    document.getElementById('climateResults').style.display = 'block';
    document.getElementById('climateResults').scrollIntoView({ behavior: 'smooth' });
}

// Growth Simulation
let growthChart = null;

function simulateGrowth(event) {
    event.preventDefault();

    const species = document.getElementById('growthSpecies').value;
    const count = parseInt(document.getElementById('growthCount').value);
    const years = parseInt(document.getElementById('growthYears').value);

    if (!species || !count || !years) {
        Utils.showAlert('Please fill in all fields', 'error');
        return;
    }

    const simulation = GrowthSimulation.generateGrowthAnimation(species, count, years);

    // Draw growth chart
    drawGrowthChart(simulation);

    // Display growth stages
    displayGrowthStages(simulation);

    document.getElementById('growthResults').style.display = 'block';
    document.getElementById('growthResults').scrollIntoView({ behavior: 'smooth' });
}

// Draw Growth Chart
function drawGrowthChart(simulation) {
    const ctx = document.getElementById('growthChart').getContext('2d');

    if (growthChart) {
        growthChart.destroy();
    }

    growthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: simulation.stages.map(s => `Year ${s.year} (${s.stage})`),
            datasets: [
                {
                    label: 'Annual CO₂ Absorption (kg)',
                    data: simulation.stages.map(s => Math.round(s.annualCO2)),
                    borderColor: '#2c6e49',
                    backgroundColor: 'rgba(44, 110, 73, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Cumulative CO₂ (kg)',
                    data: simulation.stages.map(s => Math.round(s.cumulativeCO2)),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Tree Growth & CO₂ Absorption Over Time'
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
                        text: 'CO₂ (kg)'
                    }
                }
            }
        }
    });
}

// Display Growth Stages
function displayGrowthStages(simulation) {
    const stagesDiv = document.getElementById('growthStages');

    let html = '<h3 style="margin-top: 2rem;">Growth Stages:</h3>';
    html += '<div style="display: grid; gap: 1rem; margin-top: 1rem;">';

    // Show key stages
    const keyStages = [1, Math.ceil(simulation.years / 3), Math.ceil(simulation.years / 2), simulation.years].filter((v, i, arr) => arr.indexOf(v) === i);

    keyStages.forEach(year => {
        const stage = simulation.stages[year - 1];
        if (stage) {
            html += `
                <div class="card" style="border-left: 5px solid var(--green-primary);">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="font-size: 3rem;">${stage.icon}</div>
                        <div style="flex: 1;">
                            <h3>Year ${year}: ${stage.stage}</h3>
                            <p><strong>${stage.description}</strong></p>
                            <p><strong>Growth Factor:</strong> ${(stage.growthFactor * 100).toFixed(0)}%</p>
                            <p><strong>Annual CO₂:</strong> ${Utils.formatNumber(Math.round(stage.annualCO2))} kg</p>
                            <p><strong>Cumulative CO₂:</strong> ${Utils.formatNumber(Math.round(stage.cumulativeCO2))} kg</p>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    html += '</div>';
    stagesDiv.innerHTML = html;
}

// Multi-City Planner Functions
let cityInputCounter = 1;

function addCityInput() {
    cityInputCounter++;
    const cityInputs = document.getElementById('cityInputs');
    
    // Generate city options
    let cityOptions = '<option value="">Select city</option>';
    if (typeof INDIAN_CITIES !== 'undefined') {
        const cities = Object.keys(INDIAN_CITIES).sort();
        cities.forEach(city => {
            cityOptions += `<option value="${city}">${city}</option>`;
        });
    } else {
        cityOptions += '<option value="Delhi">Delhi</option><option value="Mumbai">Mumbai</option><option value="Chennai">Chennai</option><option value="Bangalore">Bangalore</option><option value="Hyderabad">Hyderabad</option><option value="Kolkata">Kolkata</option>';
    }
    
    const cityDiv = document.createElement('div');
    cityDiv.className = 'card';
    cityDiv.style.marginBottom = '1rem';
    cityDiv.innerHTML = `
        <h3>City ${cityInputCounter}</h3>
        <div class="form-group">
            <label>City</label>
            <select class="city-select" required>
                ${cityOptions}
            </select>
        </div>
        <div class="form-group">
            <label>Species</label>
            <select class="city-species" required>
                <option value="">Select species</option>
                <option value="Neem">Neem</option>
                <option value="Mango">Mango</option>
                <option value="Banyan">Banyan</option>
                <option value="Peepal">Peepal</option>
            </select>
        </div>
        <div class="form-group">
            <label>Count</label>
            <input type="number" class="city-count" min="1" value="10" required>
        </div>
        <div class="form-group">
            <label>Years</label>
            <input type="number" class="city-years" min="1" value="5" required>
        </div>
        <button type="button" class="btn btn-secondary" onclick="this.parentElement.remove();">Remove</button>
    `;
    
    cityInputs.appendChild(cityDiv);
}

function planMultiCity() {
    const cityInputs = document.querySelectorAll('#cityInputs .card');
    const plantations = [];

    cityInputs.forEach(card => {
        const city = card.querySelector('.city-select').value;
        const species = card.querySelector('.city-species').value;
        const count = parseInt(card.querySelector('.city-count').value);
        const years = parseInt(card.querySelector('.city-years').value);

        if (city && species && count && years) {
            plantations.push({ city, species, count, years });
        }
    });

    if (plantations.length === 0) {
        Utils.showAlert('Please add at least one city plan', 'error');
        return;
    }

    const planner = window.MultiCityPlanner || MultiCityPlannerEnhanced;
    const plan = planner.planMultiCity(plantations);

    // Display results
    displayMultiCityResults(plan);

    document.getElementById('multicityResults').style.display = 'block';
    document.getElementById('multicityResults').scrollIntoView({ behavior: 'smooth' });
}

function displayMultiCityResults(plan) {
    // Display city plans
    let cityPlansHtml = '<div style="display: grid; gap: 1.5rem; margin-top: 1rem;">';
    
    plan.cityPlans.forEach(cityPlan => {
        const climate = cityPlan.climate;
        cityPlansHtml += `
            <div class="card" style="border-left: 4px solid var(--green-primary);">
                <h3 style="color: var(--green-primary); margin-bottom: 1rem;">
                    ${cityPlan.city} (${climate.zone})
                </h3>
                <div style="display: grid; gap: 1rem;">
                    <div class="result-item">
                        <div><strong>Total Trees:</strong> ${Utils.formatNumber(cityPlan.totalCount)}</div>
                        <div><strong>Total CO₂:</strong> ${Utils.formatNumber(Math.round(cityPlan.totalCO2))} kg</div>
                        <div><strong>Total O₂:</strong> ${Utils.formatNumber(Math.round(cityPlan.totalO2))} kg</div>
                    </div>
                    <div>
                        <strong>Trees by Species:</strong>
                        <div style="margin-top: 0.5rem;">
                            ${cityPlan.trees.map(t => 
                                `<span class="achievement-badge" style="margin: 0.25rem;">${t.species}: ${t.count}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    cityPlansHtml += '</div>';
    document.getElementById('cityPlansList').innerHTML = cityPlansHtml;

    // Display totals
    let totalsHtml = `
        <div class="summary-grid">
            <div class="summary-card">
                <h3>${plan.totals.cities}</h3>
                <p>Cities</p>
            </div>
            <div class="summary-card">
                <h3>${Utils.formatNumber(plan.totals.totalTrees)}</h3>
                <p>Total Trees</p>
            </div>
            <div class="summary-card">
                <h3>${Utils.formatNumber(Math.round(plan.totals.totalCO2))}</h3>
                <p>Total CO₂ (kg)</p>
            </div>
            <div class="summary-card">
                <h3>${Utils.formatNumber(Math.round(plan.totals.totalO2))}</h3>
                <p>Total O₂ (kg)</p>
            </div>
            <div class="summary-card">
                <h3>${plan.totals.peopleSupported}</h3>
                <p>People Supported</p>
            </div>
        </div>
    `;

    if (plan.recommendations && plan.recommendations.length > 0) {
        totalsHtml += `
            <div style="margin-top: 2rem;">
                <h3>Recommendations:</h3>
                <div style="margin-top: 1rem;">
                    ${plan.recommendations.map(rec => `
                        <div class="alert alert-${rec.priority === 'High' ? 'error' : 'info'}" style="margin-bottom: 1rem;">
                            <strong>${rec.type}:</strong> ${rec.message}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    document.getElementById('totalImpact').innerHTML = totalsHtml;
}

// Visual Calendar Functions
function showCalendar(event) {
    event.preventDefault();
    
    const city = document.getElementById('calendarCity').value;
    if (!city) {
        Utils.showAlert('Please select a city', 'error');
        return;
    }

    const calendarHTML = PlantationCalendar.getCalendarHTML(city);
    document.getElementById('visualCalendar').innerHTML = calendarHTML;
    document.getElementById('calendarResults').style.display = 'block';
    document.getElementById('calendarResults').scrollIntoView({ behavior: 'smooth' });
}

function showVisualCalendar(city) {
    const calendarHTML = PlantationCalendar.getCalendarHTML(city);
    
    // Create modal or update existing
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 90%; max-height: 90vh; overflow-y: auto;">
            <span class="close" onclick="this.parentElement.parentElement.remove();">&times;</span>
            <h2>Planting Calendar for ${city}</h2>
            ${calendarHTML}
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

