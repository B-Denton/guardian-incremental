"use strict"; // execute in strict mode

Game.AdvancementData = {
    // Stores information about various conditions that enable game progression,
    // and what happens when they trigger.
    // key: advancementID, value: advancement data


    // AREA UNLOCKS

    "caveUnlock": { 
        advancementID: "caveUnlock",  
        hasTriggered: false,  // boolean: whether advancement has already been achieved
        shouldTrigger: () =>  { // return boolean: condition needed to trigger advancement
            return resources.PlayerResources["eggRuby"].amount > 0
        },
        activate: () => {  // to run when advancement triggered. 
            // Player discovers that they can generate ruby eggs from searching debris.
            Game.ActionsList["searchField"].produce["eggRuby"] = "Ruby Eggs";
            Game.ActionHandler.updateTooltipProduce(Game.ActionsList["searchField"]);
            // Hatchery area becomes available
            Game.AreaHandler.unlockArea("hatchery")
            log.addNotification("You find a dragon's egg hidden beneath a toppled tree, but it's icy-cold to the touch. \
            A nearby cave looks like the perfect place to start a hatchery.", "progress")
            // Build Nest Action unlocks.
            Game.ActionsList["buildNest"].isVisible = true;
            if (Game.AreaHandler.currentArea == "field") {
                field.activate();
            }   
        }
    },

    "reserveUnlock": {  
        hasTriggered: false, 
        shouldTrigger: () =>  { 
            return ( reserve.reserveDragons.some(item => item != undefined) );
        },
        activate: () => {  
            Game.AreaHandler.unlockArea("reserve");
            log.addNotification("The newly-hatched dragon sniffs the world curiously, and runs outside to explore.", "progress")
        }
    },

    "exploreUnlock": {
        hasTriggered: false, 
        shouldTrigger: () =>  { 
            return ( playerResources["jackalope"].amount >= 10 );
        },
        activate: () => {  
            Game.AreaHandler.unlockArea("explore");
            log.addNotification("The jackalope are grateful for your help. \
                                They eagerly tell you about a purple egg they saw beyond the forest.", "progress");
        }
    },

    // CREATURE UNLOCKS

    "jackalopeUnlock": {  
        hasTriggered: false, 
        shouldTrigger: () =>  { 
            return ( playerResources["fire"].amount >= 10  );
        },
        activate: () => {  
            Game.ActionsList["buildJackalopeWarren"].isVisible = true;
            log.addNotification("With a dragon guarding the area, some jackalope begin to emerge from hiding. \
            Their homes must have been destroyed in the recent explosions.", "progress");
            if (Game.AreaHandler.currentArea == "field") {
                field.activate();
            }   
        }
    },

    "bugbearUnlock": {  
        hasTriggered: false, 
        shouldTrigger: () =>  { 
            return ( playerResources["logs"].amount >= 5  );
        },
        activate: () => {  
            Game.ActionsList["buildBugbearDen"].isVisible = true;
            log.addNotification("Although the forest is clear of danger, it's still in disarray. \
            You notice some bugbear wandering around sadly, looking for their old homes.", "progress");
            if (Game.AreaHandler.currentArea == "field") {
                field.activate();
            }   
        }
    },

    // DRAGON UNLOCKS

    "cloudDragonUnlock": {  
        hasTriggered: false, 
        shouldTrigger: () =>  { 
            return ( Game.ExploreData["forest"]["area"].isBeaten );
        },
        activate: () => {  
            resources.PlayerResources["eggCloud"].amount++;
        }
    },

    // ACTION UNLOCKS

    //// PLAYER ACTION UNLOCKS

    // SEARCHING 
    "searchForestUnlock": {  
        hasTriggered: false, 
        shouldTrigger: () =>  { 
            return (Game.ExploreData["forest"]["area"].isBeaten);
        },
        activate: () => {  
            Game.ActionsList["searchForest"].isVisible = true;
        }
    },

    // OTHER

    "teamTrainingUnlock": {  
        hasTriggered: false, 
        shouldTrigger: () =>  { 
            return (Game.Roster.rosterDragons.some(item => item != undefined));
        },
        activate: () => {  
            Game.ActionsList["train"].isVisible = true;
            log.addNotification("These dragons seem strong... but inexperienced. Some training may help them prepare for the fights ahead.", "progress");
        }
    },

    //// UPGRADE ACTION UNLOCKS

    "jackalopeCourtingRitualsUnlock": {  
        hasTriggered: false, 
        shouldTrigger: () =>  { 
            return (playerResources["jackalope"].amount >= 2 );
        },
        activate: () => {  
            Game.ActionsList["jackalopeCourtingRituals"].isVisible = true;
            if (Game.AreaHandler.currentArea == "field") {
                field.activate();
            }   
        }
    },

    "EggWarmingUpgradeUnlock": {  
        hasTriggered: false, 
        shouldTrigger: () =>  { 
            return (playerResources["fire"].amount >= 5 );
        },
        activate: () => {  
            Game.ActionsList["eggWarmingEfficiency"].isVisible = true;
            if (Game.AreaHandler.currentArea == "field") {
                field.activate();
            }   
        }
    },


}