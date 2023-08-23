"use strict"; // execute in strict mode

Game.AreaData = {
    // Stores default information about the game areas and their settings.

    "field": {
        // Required area variables
        id: "field",
        name: "Field",
        description: "You find yourself in a small clearing.",
        isUnlocked: true,
        // Area-specific variables
        uncoveredFirstEgg: false,
    },

    "hatchery": {
        // Required area variables
        id: "hatchery",
        name: "Hatchery",
        description: "A small cave, protected from the outside elements.",
        isUnlocked: false,
        // Area-specific variables
        numberOfSlots: 0, // Move to hatcheryslotdata
        minimumTemperature: 0,
        maximumTemperature: 100,
        hatcheryEggs: [],
        hatcherySlots: [],
        slotsData: {    
            currentTemperature: 0,
            temperatureIncrementOnClick: 2,
            temperatureDrain: -0.1
        },
    },

    "reserve": {
        // Required area variables
        id: "reserve",
        name: "Reserve",
        description: "A quiet space for dragons to rest and relax.",
        isUnlocked: false,
        // Area-specific variables
        numberOfSlots: 5,
        reserveDragons: [],
    },

    "explore": {
        // Required area variables
        id: "explore",
        name: "Explore",
        description: "It's time to venture further into the island.",
        isUnlocked: false,
        // Area-specific variables
        maximumEnemies: 6,
        maximumRounds: 10,
        roundTimer: 200,
        inEncounter: false,
        currentAreaID: undefined,
        currentEncounter: undefined,
        encounterStarted: false,
        currentStrategy: undefined,
    }




}