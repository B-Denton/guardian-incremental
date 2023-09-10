"use strict"; // execute in strict mode


Game.ActionsData = {
    // Holds the default information about actions 
    // that the players can take to generate and spend resources.
    // key: actionID, value: action data

    // PLAYER

    "searchField": {
        actionID: "searchField",
        actionName: "Search (Field)",
        actionDescription: "Search the debris around the field.",
        type: "player",
        repeatable: true,
        isVisible: true,
        count: 0, 
        cost: [],
        produce: { // key: ID string, value: display string
            "twigs": "Twigs",
            "eggRuby": "???" 
        },
        action: function() {
            resources.PlayerResources["twigs"].amount += 1;
            if (this.count > 0 && this.count % 10 == 0 && playerResources["eggRuby"].amount < 1) {
                playerResources["eggRuby"].amount += 1;
            }
        },
    },

    "searchForest": {
        actionID: "searchForest",
        actionName: "Search (Forest)",
        actionDescription: "Search the debris around the forest.",
        type: "player",
        repeatable: true,
        isVisible: false,
        count: 0, 
        cost: [],
        produce: { // key: ID string, value: display string
            "logs": "Logs",
            "eggCloud": "Cloud Egg" 
        },
        action: function() {
            resources.PlayerResources["logs"].amount += 1;
            if (this.count > 0 && this.count % 10 == 0 && playerResources["eggCloud"].amount < 1) {
                playerResources["eggCloud"].amount += 1;
            }
        },
    },

    "train": {
        actionID: "train",
        actionName: "Team Training",
        actionDescription: "Run through some combat exercises with the dragons on your team!",
        type: "player",
        repeatable: true,
        isVisible: false,
        count: 0, 
        cost: [{ resource: "fire", growthRate: 1.01, baseCost: 5 }],
        produce: { 
        },
        action: function() {
            $.each(Game.Roster.rosterDragons, (i, dragon) => {
                if (dragon) {
                    var teamSize = Game.Roster.rosterDragons.filter(function(value) { return value !== undefined }).length;
                    dragon.xp += Math.floor(12 / teamSize);
                    if (dragon.checkLevelUp()) {
                        dragon.levelUp();
                        log.addNotification(dragon.name + " levelled up! They are now Level " + dragon.level + "!", "none")
                    }
                    Game.Roster.updateRosterSlot(i, dragon); 
                }
            })
        },
    },

    // BUILD

    "buildNest": {
        actionID: "buildNest",
        actionName: "Dragon Nest",
        actionDescription: "Build a dragon's nest",
        type: "build",
        repeatable: true,
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
        repeatable: true,
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
            playerResources["jackalope"].maximum += 10;
        }
    },

    "buildBugbearDen": {
        actionID: "buildBugbearDen",
        actionName: "Bugbear Den",
        actionDescription: "Build a sturdy den for bugbears",
        type: "build",
        repeatable: true,
        isVisible: false,
        count: 0,
        cost: [
            { resource: "twigs", growthRate: 1.5, baseCost: 20 },
            { resource: "logs", growthRate: 1.5, baseCost: 10 }
        ],
        produce: { 
            "bugbear": "Bugbears" 
        },
        action: function() {
            log.addNotification("You build a new den for a bugbear and their friend.", "none")
            playerResources["bugbear"].amount += 2;
            playerResources["bugbear"].maximum += 10;
        }
    },

    // UPGRADE

    //// UPGRADE CREATURES

    "jackalopeCourtingRituals": {
        actionID: "jackalopeCourtingRituals",
        actionName: "Jackalope Courting Rituals",
        actionDescription: "Encourage the jackalope to... make more jackalope.",
        type: "upgrade",
        repeatable: false,
        isVisible: false,
        count: 0,
        cost: [
            { resource: "fire", growthRate: 1.5, baseCost: 20 },
        ],
        produce: { 
            "jackalopeProductionUpgrade": "Jackalope Production" 
        },
        action: function() {
            log.addNotification("Jackalope will now produce offspring!", "none")
            Game.Resources.PlayerResources['jackalope'].generation.push({"resource": "jackalope", "baseGeneration": 0.00001}) 
            Game.ActionsList["jackalopeCourtingRituals"].isVisible = false;
            Game.Field.activate();
        }
    },

    //// UPGRADE HATCHERY

    "eggWarmingEfficiency": {
        actionID: "eggWarmingEfficiency",
        actionName: "Improved Egg Warming",
        actionDescription: "Use dragons' fire to better warm the hatchery nests!",
        type: "upgrade",
        repeatable: true,
        isVisible: false,
        count: 0,
        cost: [
            { resource: "fire", growthRate: 1.5, baseCost: 30 },
        ],
        produce: { 
            "eggWarming": "Egg Warming Efficiency" 
        },
        action: function() {
            log.addNotification("The warming fires inside the hatchery glow brighter.", "none")
            Game.Hatchery.slotsData.temperatureIncrementOnClick += 2;
            $.each(Game.Hatchery.HatcherySlots, ( _ , slot) => {
                slot.temperatureIncrementOnClick += 2;
            })      
        }
    },

};