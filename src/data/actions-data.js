"use strict"; // execute in strict mode

// Holds the default information about actions that the players can take to generate and spend resources.
Game.ActionsData = {

    // PLAYER

    "search": {
        actionID: "search",
        actionName: "Search",
        actionDescription: "Search the debris",
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
            if (this.count > 0 && this.count % 10 == 0) {
                playerResources["eggRuby"].amount += 1;
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
                    console.log(teamSize)
                    dragon.xp += Math.floor(12 / teamSize);
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
        }
    },

    // UPGRADE

    "jackalopeMatingRituals": {
        actionID: "jackalopeMatingRituals",
        actionName: "Jackalope Mating Rituals",
        actionDescription: "Find a way to encourage the jackalope to... make more jackalope.",
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
            Game.ActionsList["jackalopeMatingRituals"].isVisible = false;
            Game.Field.activate();
        }
    },

};