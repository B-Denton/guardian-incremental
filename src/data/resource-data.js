"use strict"; // execute in strict mode

// Holds default data about all resources available in game.
Game.ResourceData = {

    // PLAYER-COLLECTED RESOURCES

    "twigs": {
        resourceID: "twigs",
        resourceName: "Twigs",
        type: "player",
        element: "none",
        amount: 0,
        income: 0,
        maximum: 100,
        generation: [],
        isVisible: false
    },

    // CREATURES

    "jackalope": {
        resourceID: "jackalope",
        resourceName: "Jackalope",
        type: "creature",
        element: "none",
        amount: 0,
        income: 0,
        maximum: 0,
        generation: [
            {"resource": "twigs", "baseGeneration": 0.01}
        ],
        isVisible: false
    },

    // DRAGON-GENERATED RESOURCES

    "fire": {
        resourceID: "fire",
        resourceName: "Fire",
        type: "dragon",
        element: "none",
        amount: 0,
        income: 0,
        maximum: 100,
        generation: [],
        isVisible: false
    },

    "air": {
        resourceID: "air",
        resourceName: "Air",
        type: "dragon",
        element: "none",
        amount: 0,
        income: 0,
        maximum: 100,
        generation: [],
        isVisible: false
    },

    // DRAGON EGGS:

    "eggRuby": {
        resourceID: "eggRuby",
        resourceName: "Ruby Egg",
        type: "egg",
        element: "ruby",
        amount: 0,
        income: 0,
        maximum: 10,
        generation: [],
        isVisible: false
    },

    "eggCloud": {
        resourceID: "eggCloud",
        resourceName: "Cloud Egg",
        type: "egg",
        element: "cloud",
        amount: 0,
        income: 0,
        maximum: 10,
        generation: [],
        isVisible: false
    }


}