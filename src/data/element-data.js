"use strict"; // execute in strict mode

// Holds information about the default values for elemental-related data
Game.Elements = {

    allElements: {
        "ruby": {
            element: "ruby",
            elementName: "Ruby",
            color: "#800020"
        },

        "cloud": {
            element: "cloud",
            elementName: "Cloud",
            color: "#581845"
        }
    },

    mapElements() {
        $.each(this.allElements, function(elementID, element) {
            for (var key in element) {
                Game.Elements.elementToDragon[elementID][key] = element[key]
                Game.Elements.elementToEgg[elementID][key] = element[key]
            };

        })

    },

    init() {
        this.mapElements();
    },

    elementToDragon: {
        "ruby": {
            income: {  
                // key: resourceID, value: income amount
                "fire": 0.01,
                "eggRuby": 0.001
            },
            release: {  
                // key: resourceID, value: release reward
                "fire": 10
            },
            levelUpStats: {
                exponent: 1.5,
                baseXP: 50
            },
            combat: {
                "baseHP": 10,
                "baseAttack": 3,
                "baseDefense": 3,
                "baseSpeed": 3
            }
        },

        "cloud": {
            income: {  
                // key: resourceID, value: income amount
                "air": 0.01,
                "eggCloud": 0.001
            },
            release: {  
                // key: resourceID, value: release reward
                "air": 10
            },
            levelUpStats: {
                exponent: 1.5,
                baseXP: 100
            },
            combat: {
                "baseHP": 0,
                "baseAttack": 0,
                "baseDefense": 0,
                "baseSpeed": 0
            }
        }
    },

    elementToEgg: {
        "ruby": {
            hatchingSpeed: 1,
            minHatchingTemperature: 10,
            maxHatchingTemperature: 60
        },

        "cloud": {
            hatchingSpeed: 0.5,
            minHatchingTemperature: 20,
            maxHatchingTemperature: 40
        },

    },

    mapElementToDragon(element) {
        return this.elementToDragon[element]
    },

    mapElementToEgg(element) {
        return this.elementToEgg[element]
    }



};

