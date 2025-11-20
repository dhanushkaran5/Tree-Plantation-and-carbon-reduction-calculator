// EcoTree Impact Analyzer - Shared Utilities

// Tree species data with comprehensive attributes
// Formula: 1 adult needs ~740 kg oxygen per year
const TREE_SPECIES = {
    'Neem': {
        co2PerYear: 20,
        oxygenPerYear: 1750, // kg O2/year
        waterPerWeek: 18, // liters
        soilTypes: ['Sandy', 'Clay', 'Alluvial', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical', 'Arid'],
        pollutionTolerance: 'Very High',
        diseaseResistance: 'High',
        lifespan: 200, // years
        costPerSapling: 150, // INR
        maintenanceCost: 200, // INR/year
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Mango': {
        co2PerYear: 22,
        oxygenPerYear: 1650,
        waterPerWeek: 45,
        soilTypes: ['Alluvial', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'Medium',
        lifespan: 300,
        costPerSapling: 200,
        maintenanceCost: 300,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Banyan': {
        co2PerYear: 48,
        oxygenPerYear: 2100,
        waterPerWeek: 25,
        soilTypes: ['Alluvial', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Very High',
        diseaseResistance: 'Very High',
        lifespan: 500,
        costPerSapling: 500,
        maintenanceCost: 400,
        bestPlantingMonths: ['June', 'July', 'August', 'September'],
        survivalRisk: 'Very Low'
    },
    'Eucalyptus': {
        co2PerYear: 30,
        oxygenPerYear: 1800,
        waterPerWeek: 20,
        soilTypes: ['Sandy', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical', 'Temperate'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 150,
        costPerSapling: 100,
        maintenanceCost: 150,
        bestPlantingMonths: ['July', 'August', 'September'],
        survivalRisk: 'Low'
    },
    'Peepal': {
        co2PerYear: 45,
        oxygenPerYear: 2350,
        waterPerWeek: 22,
        soilTypes: ['Alluvial', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Very High',
        diseaseResistance: 'Very High',
        lifespan: 2000,
        costPerSapling: 300,
        maintenanceCost: 250,
        bestPlantingMonths: ['June', 'July', 'August', 'September'],
        survivalRisk: 'Very Low'
    },
    'Bamboo': {
        co2PerYear: 40,
        oxygenPerYear: 1350,
        waterPerWeek: 15,
        soilTypes: ['Sandy', 'Alluvial', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 120,
        costPerSapling: 50,
        maintenanceCost: 100,
        bestPlantingMonths: ['May', 'June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Oak': {
        co2PerYear: 25,
        oxygenPerYear: 1600,
        waterPerWeek: 30,
        soilTypes: ['Clay', 'Loamy'],
        climateZones: ['Temperate', 'Subtropical'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'Medium',
        lifespan: 400,
        costPerSapling: 250,
        maintenanceCost: 250,
        bestPlantingMonths: ['October', 'November', 'December'],
        survivalRisk: 'Medium'
    },
    'Teak': {
        co2PerYear: 28,
        oxygenPerYear: 1700,
        waterPerWeek: 35,
        soilTypes: ['Alluvial', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 250,
        costPerSapling: 350,
        maintenanceCost: 300,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Acacia': {
        co2PerYear: 15,
        oxygenPerYear: 1200,
        waterPerWeek: 12,
        soilTypes: ['Sandy', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical', 'Arid'],
        pollutionTolerance: 'Very High',
        diseaseResistance: 'Very High',
        lifespan: 100,
        costPerSapling: 80,
        maintenanceCost: 100,
        bestPlantingMonths: ['July', 'August', 'September'],
        survivalRisk: 'Very Low'
    },
    'Pine': {
        co2PerYear: 12,
        oxygenPerYear: 1100,
        waterPerWeek: 25,
        soilTypes: ['Sandy', 'Loamy'],
        climateZones: ['Temperate', 'Subtropical'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'Medium',
        lifespan: 150,
        costPerSapling: 120,
        maintenanceCost: 150,
        bestPlantingMonths: ['October', 'November', 'December', 'January'],
        survivalRisk: 'Medium'
    },
    'Cedar': {
        co2PerYear: 35,
        oxygenPerYear: 1900,
        waterPerWeek: 28,
        soilTypes: ['Loamy', 'Clay'],
        climateZones: ['Temperate', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 300,
        costPerSapling: 400,
        maintenanceCost: 350,
        bestPlantingMonths: ['October', 'November', 'December'],
        survivalRisk: 'Low'
    },
    'Gulmohar': {
        co2PerYear: 18,
        oxygenPerYear: 1400,
        waterPerWeek: 20,
        soilTypes: ['Sandy', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'Medium',
        lifespan: 80,
        costPerSapling: 150,
        maintenanceCost: 200,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Medium'
    },
    'Mahogany': {
        co2PerYear: 32,
        oxygenPerYear: 1850,
        waterPerWeek: 32,
        soilTypes: ['Alluvial', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 350,
        costPerSapling: 450,
        maintenanceCost: 400,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Jamun': {
        co2PerYear: 24,
        oxygenPerYear: 1550,
        waterPerWeek: 40,
        soilTypes: ['Alluvial', 'Clay'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'Medium',
        lifespan: 150,
        costPerSapling: 180,
        maintenanceCost: 250,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Arjun': {
        co2PerYear: 26,
        oxygenPerYear: 1680,
        waterPerWeek: 24,
        soilTypes: ['Alluvial', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Very High',
        diseaseResistance: 'High',
        lifespan: 250,
        costPerSapling: 220,
        maintenanceCost: 220,
        bestPlantingMonths: ['June', 'July', 'August', 'September'],
        survivalRisk: 'Low'
    },
    'Banyan Fig': {
        co2PerYear: 44,
        oxygenPerYear: 2050,
        waterPerWeek: 23,
        soilTypes: ['Alluvial', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Very High',
        diseaseResistance: 'Very High',
        lifespan: 800,
        costPerSapling: 400,
        maintenanceCost: 350,
        bestPlantingMonths: ['June', 'July', 'August', 'September'],
        survivalRisk: 'Very Low'
    }
};

// Helper function to get tree data (backwards compatible)
function getTreeData(species) {
    const tree = TREE_SPECIES[species];
    if (!tree) return null;
    if (typeof tree === 'number') {
        // Legacy format - convert to new format
        return { co2PerYear: tree, oxygenPerYear: tree * 60 };
    }
    return tree;
}

// Achievement thresholds
const ACHIEVEMENTS = {
    'Seed Planter': { trees: 10, co2: 0 },
    'Eco Warrior': { trees: 100, co2: 0 },
    'City Saver': { trees: 0, co2: 1000 } // 1 tonne in kg
};

// LocalStorage Keys
const STORAGE_KEYS = {
    CALCULATIONS: 'ecotree_calculations',
    MAP_PINS: 'ecotree_map_pins',
    USER_PROGRESS: 'ecotree_user_progress',
    ACHIEVEMENTS: 'ecotree_achievements'
};

// LocalStorage Utilities
const Storage = {
    // Get data from localStorage
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },

    // Set data to localStorage
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },

    // Remove data from localStorage
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
};

// Calculation Management
const Calculations = {
    // Save a calculation
    save(calculation) {
        const calculations = Storage.get(STORAGE_KEYS.CALCULATIONS, []);
        calculation.id = Date.now();
        calculation.timestamp = new Date().toISOString();
        calculations.push(calculation);
        Storage.set(STORAGE_KEYS.CALCULATIONS, calculations);
        this.updateProgress(calculation);
        return calculation;
    },

    // Get all calculations
    getAll() {
        return Storage.get(STORAGE_KEYS.CALCULATIONS, []);
    },

    // Get calculations by species
    getBySpecies(species) {
        return this.getAll().filter(calc => calc.species === species);
    },

    // Update user progress
    updateProgress(calculation) {
        const progress = Storage.get(STORAGE_KEYS.USER_PROGRESS, {
            totalTrees: 0,
            totalCO2: 0,
            speciesCount: {}
        });

        progress.totalTrees += calculation.count || 0;
        progress.totalCO2 += calculation.totalCO2 || 0;
        
        const species = calculation.species || 'Custom';
        progress.speciesCount[species] = (progress.speciesCount[species] || 0) + (calculation.count || 0);

        Storage.set(STORAGE_KEYS.USER_PROGRESS, progress);
        Achievements.checkAchievements(progress);
    },

    // Get user progress
    getProgress() {
        return Storage.get(STORAGE_KEYS.USER_PROGRESS, {
            totalTrees: 0,
            totalCO2: 0,
            speciesCount: {}
        });
    }
};

// Achievement System
const Achievements = {
    // Check and unlock achievements
    checkAchievements(progress) {
        const unlocked = Storage.get(STORAGE_KEYS.ACHIEVEMENTS, []);
        const newAchievements = [];

        for (const [name, threshold] of Object.entries(ACHIEVEMENTS)) {
            if (unlocked.includes(name)) continue;

            const treesMet = threshold.trees > 0 && progress.totalTrees >= threshold.trees;
            const co2Met = threshold.co2 > 0 && progress.totalCO2 >= threshold.co2;

            if (treesMet || co2Met) {
                unlocked.push(name);
                newAchievements.push(name);
            }
        }

        if (newAchievements.length > 0) {
            Storage.set(STORAGE_KEYS.ACHIEVEMENTS, unlocked);
            this.showAchievementNotification(newAchievements);
        }
    },

    // Show achievement notification
    showAchievementNotification(achievements) {
        achievements.forEach(achievement => {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'alert alert-success';
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.zIndex = '3000';
            notification.style.minWidth = '300px';
            notification.innerHTML = `
                <strong>🎉 Achievement Unlocked!</strong><br>
                ${achievement}
            `;
            document.body.appendChild(notification);

            // Remove after 5 seconds
            setTimeout(() => {
                notification.remove();
            }, 5000);
        });
    },

    // Get all unlocked achievements
    getUnlocked() {
        return Storage.get(STORAGE_KEYS.ACHIEVEMENTS, []);
    }
};

// Map Pins Management
const MapPins = {
    // Save a map pin
    save(pin) {
        const pins = Storage.get(STORAGE_KEYS.MAP_PINS, []);
        pin.id = Date.now();
        pin.timestamp = new Date().toISOString();
        pins.push(pin);
        Storage.set(STORAGE_KEYS.MAP_PINS, pins);
        return pin;
    },

    // Get all map pins
    getAll() {
        return Storage.get(STORAGE_KEYS.MAP_PINS, []);
    },

    // Get pins by location
    getByLocation(location) {
        return this.getAll().filter(pin => pin.location === location);
    },

    // Delete a pin
    delete(pinId) {
        const pins = this.getAll();
        const filtered = pins.filter(pin => pin.id !== pinId);
        Storage.set(STORAGE_KEYS.MAP_PINS, filtered);
        return true;
    }
};

// Leaderboard System
const Leaderboard = {
    // Get city leaderboard
    getCityLeaderboard() {
        const pins = MapPins.getAll();
        const calculations = Calculations.getAll();
        
        const cityData = {};

        // Process map pins
        pins.forEach(pin => {
            const city = pin.location || 'Unknown';
            if (!cityData[city]) {
                cityData[city] = { trees: 0, co2: 0 };
            }
            cityData[city].trees += pin.count || 0;
            cityData[city].co2 += this.calculateCO2ForPin(pin);
        });

        // Process calculations with locations
        calculations.forEach(calc => {
            if (calc.location) {
                const city = calc.location;
                if (!cityData[city]) {
                    cityData[city] = { trees: 0, co2: 0 };
                }
                cityData[city].trees += calc.count || 0;
                cityData[city].co2 += calc.totalCO2 || 0;
            }
        });

        // Convert to array and sort
        const leaderboard = Object.entries(cityData).map(([city, data]) => ({
            city,
            trees: data.trees,
            co2: data.co2
        }));

        return leaderboard.sort((a, b) => b.co2 - a.co2);
    },

    // Calculate CO2 for a pin
    calculateCO2ForPin(pin) {
        const species = pin.species || 'Custom';
        const tree = getTreeData(species);
        const co2PerYear = tree ? (tree.co2PerYear || tree) : (pin.co2PerYear || 20);
        const years = pin.years || 1;
        const count = pin.count || 1;
        return co2PerYear * years * count;
    },

    // Get top performing species
    getTopSpecies(limit = 5) {
        const progress = Calculations.getProgress();
        const speciesArray = Object.entries(progress.speciesCount || {})
            .map(([species, count]) => ({ species, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
        
        return speciesArray;
    }
};

// Utility Functions
const Utils = {
    // Format number with commas
    formatNumber(num) {
        return new Intl.NumberFormat('en-IN').format(num);
    },

    // Convert kg to tonnes
    kgToTonnes(kg) {
        return (kg / 1000).toFixed(2);
    },

    // Calculate car equivalents (4.6 tonnes per car per year)
    calculateCarEquivalents(co2Tonnes) {
        return (co2Tonnes / 4.6).toFixed(2);
    },

    // Show modal
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    },

    // Hide modal
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    },

    // Show alert
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        const container = document.querySelector('.container') || document.body;
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
};

// Initialize achievements check on page load
document.addEventListener('DOMContentLoaded', () => {
    const progress = Calculations.getProgress();
    Achievements.checkAchievements(progress);
});

