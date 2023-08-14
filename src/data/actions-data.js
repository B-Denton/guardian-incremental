"use strict"; // execute in strict mode

// Holds the default information about actions that the players can take to generate and spend resources.
Game.ActionsData = {
    "search": {
        actionID: "search",
        actionName: "Search",
        actionDescription: "Search the debris",
        type: "player",
        isVisible: true,
        count: 0, 
        cost: [],
        produce: { // key: ID string, value: display string
            "twigs": "Twigs",
            "eggRuby": "???" 
        },
        action: function() {
            resources.PlayerResources["twigs"].amount += 1;
            if (this.count > 0 && this.count % 10 == 0) {
                playerResources["eggRuby"].amount += 1;
            }
        },
    },

    "buildNest": {
        actionID: "buildNest",
        actionName: "Dragon Nest",
        actionDescription: "Build a dragon's nest",
        type: "build",
        isVisible: false,
        count: 0,
        cost: [
            { resource: "twigs", growthRate: 1.5, baseCost: 10 }
        ],
        produce: {
            "nest": "Hatchery Nest"
        },
        action: function() {
            hatchery.numOfSlots++;
            log.addNotification("You build a nest for dragon eggs.", "none")
            hatchery.addHatcherySlot(new HatcherySlot());
        },
    },

    "buildJackalopeWarren": {
        actionID: "buildJackalopeWarren",
        actionName: "Jackalope Warren",
        actionDescription: "Build a cosy warren for Jackalopes",
        type: "build",
        isVisible: false,
        count: 0,
        cost: [
            { resource: "twigs", growthRate: 1.5, baseCost: 10 },
            { resource: "fire", growthRate: 1.5, baseCost: 5 }
        ],
        produce: { 
            "jackalope": "Jackalopes" 
        },
        action: function() {
            log.addNotification("You build a new warren for a Jackalope pair.", "none")
            playerResources["jackalope"].amount += 2;
        }
    }

};