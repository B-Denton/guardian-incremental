"use strict"; // execute in strict mode


class Egg {

    constructor(element) {
        // Set element-specific variables.
        this.element = element;
        this.extractElementData(element);
        // Set instance specific variables.
        this.hatchingProgress = 0;
        this.isHatched = false;
        
    };

    extractElementData() {
        // Get data related to element, and assign it to Egg instance.
        const elementData = Game.Elements.mapElementToEgg(this.element);
        for (var key in elementData) {
            this[key] = elementData[key];
        };
    }

    getIsEggHatchingText(temperature, hatchingProgress) {
        if (hatchingProgress >= 100) {
            return "The egg is ready to hatch!"
        }
        // return text, hinting player towards ideal temperature.
        if (temperature < this.minHatchingTemperature) {
            return "The egg is too cold...";
        }
        if (temperature > this.maxHatchingTemperature) {
            return "The egg is too hot!";
        }
        else {
            return "The egg seems happy.";
        } 
    }

    updateHatchingProgress(temperature) {
        // Increment hatching progress, if temperature is optimal.
        if (temperature >= this.minHatchingTemperature && temperature <= this.maxHatchingTemperature) {
            this.hatchingProgress += this.hatchingSpeed; 
        }
    }
    
};