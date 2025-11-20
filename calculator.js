// Carbon Calculator Logic

let currentCalculation = null;
let co2Chart = null;

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculatorForm');
    const speciesSelect = document.getElementById('species');

    // Handle species selection
    speciesSelect.addEventListener('change', (e) => {
        const isCustom = e.target.value === 'Custom';
        document.getElementById('customSpeciesGroup').style.display = isCustom ? 'block' : 'none';
        document.getElementById('customCO2Group').style.display = isCustom ? 'block' : 'none';
        
        if (isCustom) {
            document.getElementById('customSpeciesName').required = true;
            document.getElementById('customCO2').required = true;
        } else {
            document.getElementById('customSpeciesName').required = false;
            document.getElementById('customCO2').required = false;
        }
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateImpact();
    });

    // Close modal on outside click
    window.onclick = (event) => {
        const modal = document.getElementById('compareModal');
        if (event.target === modal) {
            Utils.hideModal('compareModal');
        }
    };
});

// Calculate carbon impact
function calculateImpact() {
    const species = document.getElementById('species').value;
    const count = parseInt(document.getElementById('count').value);
    const years = parseInt(document.getElementById('years').value);
    const location = document.getElementById('location').value;

    if (!species || !count || !years) {
        Utils.showAlert('Please fill in all required fields', 'error');
        return;
    }

    let speciesName = species;
    let co2PerYear;

    if (species === 'Custom') {
        speciesName = document.getElementById('customSpeciesName').value;
        co2PerYear = parseFloat(document.getElementById('customCO2').value);
        
        if (!speciesName || !co2PerYear) {
            Utils.showAlert('Please enter custom species details', 'error');
            return;
        }
    } else {
        const tree = getTreeData(species);
        co2PerYear = tree ? (tree.co2PerYear || tree) : 20;
    }

    // Calculate CO2 absorption
    const annualCO2 = co2PerYear * count;
    const totalCO2 = annualCO2 * years;
    const totalCO2Tonnes = parseFloat(Utils.kgToTonnes(totalCO2));
    const carEquivalents = parseFloat(Utils.calculateCarEquivalents(totalCO2Tonnes));

    // Store calculation
    currentCalculation = {
        species: speciesName,
        count: count,
        years: years,
        co2PerYear: co2PerYear,
        annualCO2: annualCO2,
        totalCO2: totalCO2,
        totalCO2Tonnes: totalCO2Tonnes,
        carEquivalents: carEquivalents,
        location: location
    };

    // Save to localStorage
    Calculations.save(currentCalculation);

    // Display results
    displayResults(currentCalculation);
    
    // Draw chart
    drawChart(currentCalculation);

    Utils.showAlert('Calculation saved successfully!', 'success');
}

// Display calculation results
function displayResults(calc) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');

    resultsContent.innerHTML = `
        <div class="results">
            <div class="result-item">
                <span><strong>Species:</strong> ${calc.species}</span>
            </div>
            <div class="result-item">
                <span><strong>Number of Trees:</strong> ${Utils.formatNumber(calc.count)}</span>
            </div>
            <div class="result-item">
                <span><strong>CO₂ Absorption Rate:</strong> ${calc.co2PerYear} kg per tree per year</span>
            </div>
            <div class="result-item">
                <span><strong>Annual CO₂ Absorption:</strong> ${Utils.formatNumber(calc.annualCO2)} kg (${calc.totalCO2Tonnes} tonnes)</span>
            </div>
            <div class="result-item">
                <span><strong>Total CO₂ over ${calc.years} years:</strong> ${Utils.formatNumber(calc.totalCO2)} kg (${calc.totalCO2Tonnes} tonnes)</span>
            </div>
            <div class="result-item">
                <span><strong>Car Equivalents Offset:</strong> ${calc.carEquivalents} cars (4.6 tonnes per car per year)</span>
            </div>
            ${calc.location ? `<div class="result-item">
                <span><strong>Location:</strong> ${calc.location}</span>
            </div>` : ''}
        </div>
    `;

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Draw CO2 absorption chart
function drawChart(calc) {
    const ctx = document.getElementById('co2Chart').getContext('2d');
    
    // Calculate year-by-year data with growth curve
    const years = [];
    const cumulativeCO2 = [];
    const annualCO2Data = [];
    
    for (let year = 1; year <= calc.years; year++) {
        years.push(`Year ${year}`);
        // Apply growth curve (trees absorb more as they grow)
        const growthFactor = 0.5 + (year / calc.years) * 0.5; // Starts at 50%, reaches 100%
        const yearCO2 = calc.annualCO2 * growthFactor;
        annualCO2Data.push(Math.round(yearCO2));
        
        const prevCumulative = cumulativeCO2.length > 0 ? cumulativeCO2[cumulativeCO2.length - 1] : 0;
        cumulativeCO2.push(Math.round(prevCumulative + yearCO2));
    }

    // Destroy existing chart if it exists
    if (co2Chart) {
        co2Chart.destroy();
    }

    co2Chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Cumulative CO₂ Absorption (kg)',
                    data: cumulativeCO2,
                    borderColor: '#2c6e49',
                    backgroundColor: 'rgba(44, 110, 73, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Annual CO₂ Absorption (kg)',
                    data: annualCO2Data,
                    borderColor: '#1a4d2e',
                    backgroundColor: 'rgba(26, 77, 46, 0.1)',
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
                    text: 'CO₂ Absorption Over Time'
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
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
}

// Reset calculator
function resetCalculator() {
    document.getElementById('calculatorForm').reset();
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('customSpeciesGroup').style.display = 'none';
    document.getElementById('customCO2Group').style.display = 'none';
    currentCalculation = null;
    
    if (co2Chart) {
        co2Chart.destroy();
        co2Chart = null;
    }
}

// Export to CSV
function exportToCSV() {
    if (!currentCalculation) {
        Utils.showAlert('No calculation to export', 'error');
        return;
    }

    const csv = [
        ['Field', 'Value'],
        ['Species', currentCalculation.species],
        ['Number of Trees', currentCalculation.count],
        ['Years', currentCalculation.years],
        ['CO₂ per Year (kg)', currentCalculation.co2PerYear],
        ['Annual CO₂ (kg)', currentCalculation.annualCO2],
        ['Total CO₂ (kg)', currentCalculation.totalCO2],
        ['Total CO₂ (tonnes)', currentCalculation.totalCO2Tonnes],
        ['Car Equivalents', currentCalculation.carEquivalents],
        ['Location', currentCalculation.location || 'N/A']
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecotree_calculation_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Generate PDF Tree Passport
function generatePDF() {
    if (!currentCalculation) {
        Utils.showAlert('No calculation to generate PDF', 'error');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(44, 110, 73);
    doc.text('EcoTree Impact Analyzer', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Tree Passport', 105, 30, { align: 'center' });
    
    // Line separator
    doc.setDrawColor(44, 110, 73);
    doc.line(20, 35, 190, 35);
    
    let yPos = 45;
    
    // Species Information
    doc.setFontSize(14);
    doc.text('Species Information', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text(`Species: ${currentCalculation.species}`, 20, yPos);
    yPos += 7;
    doc.text(`Number of Trees: ${currentCalculation.count}`, 20, yPos);
    yPos += 7;
    doc.text(`CO₂ Absorption Rate: ${currentCalculation.co2PerYear} kg/tree/year`, 20, yPos);
    yPos += 7;
    if (currentCalculation.location) {
        doc.text(`Location: ${currentCalculation.location}`, 20, yPos);
        yPos += 7;
    }
    
    yPos += 5;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    // CO2 Absorption Table
    doc.setFontSize(14);
    doc.text('Year-by-Year CO₂ Absorption', 20, yPos);
    yPos += 10;
    
    // Table header
    doc.setFontSize(10);
    doc.setFillColor(44, 110, 73);
    doc.rect(20, yPos - 5, 170, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Year', 25, yPos);
    doc.text('Annual CO₂ (kg)', 80, yPos);
    doc.text('Cumulative CO₂ (kg)', 140, yPos);
    
    yPos += 5;
    doc.setTextColor(0, 0, 0);
    
    // Table rows
    let cumulative = 0;
    for (let year = 1; year <= currentCalculation.years; year++) {
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        
        const growthFactor = 0.5 + (year / currentCalculation.years) * 0.5;
        const yearCO2 = currentCalculation.annualCO2 * growthFactor;
        cumulative += yearCO2;
        
        doc.text(year.toString(), 25, yPos);
        doc.text(Math.round(yearCO2).toString(), 80, yPos);
        doc.text(Math.round(cumulative).toString(), 140, yPos);
        yPos += 6;
    }
    
    yPos += 5;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    // Summary
    doc.setFontSize(14);
    doc.text('Summary', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text(`Total CO₂ Absorbed: ${Utils.formatNumber(currentCalculation.totalCO2)} kg (${currentCalculation.totalCO2Tonnes} tonnes)`, 20, yPos);
    yPos += 7;
    doc.text(`Car Equivalents Offset: ${currentCalculation.carEquivalents} cars`, 20, yPos);
    
    // QR Code
    yPos += 15;
    const qrData = `${window.location.origin}${window.location.pathname}?calc=${currentCalculation.id || Date.now()}`;
    
    QRCode.toDataURL(qrData, { width: 60, margin: 1 }, (err, url) => {
        if (!err) {
            doc.addImage(url, 'PNG', 145, yPos - 10, 30, 30);
        }
        doc.setFontSize(8);
        doc.text('Scan for details', 145, yPos + 25);
        
        // Footer
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 280, { align: 'center' });
        
        // Save PDF
        doc.save(`Tree_Passport_${currentCalculation.species}_${Date.now()}.pdf`);
    });
}

// Compare species
function compareSpecies() {
    const compareContent = document.getElementById('compareContent');
    const speciesList = Object.entries(TREE_SPECIES);
    
    let html = '<table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">';
    html += '<tr style="background-color: var(--green-primary); color: white;">';
    html += '<th style="padding: 0.75rem; text-align: left;">Species</th>';
    html += '<th style="padding: 0.75rem; text-align: right;">CO₂/year (kg)</th>';
    html += '</tr>';
    
    speciesList.forEach(([species, co2], index) => {
        html += `<tr style="background-color: ${index % 2 === 0 ? '#f5f5f5' : 'white'}; border-bottom: 1px solid #ddd;">`;
        html += `<td style="padding: 0.75rem;">${species}</td>`;
        html += `<td style="padding: 0.75rem; text-align: right;">${co2}</td>`;
        html += '</tr>';
    });
    
    html += '</table>';
    
    compareContent.innerHTML = html;
    Utils.showModal('compareModal');
}

// Make compareSpecies available globally
window.compareSpecies = compareSpecies;



