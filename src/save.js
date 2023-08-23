"use strict"; // execute in strict mode

Game.Save = {

    saveFileName: "Game Save",

    saveGame() {
        var saveData = {
            // Game version
            version: Game.CURRENT_VERSION,
            // UI
            log: {},
            // Areas
            currentArea: "",  // Area that player is viewing at time of save [areaID]
            areas: {},  // key: areaID, value: object containing area information
            // Player Data
            actions: {},
            advancements: {},
            resources: {},
            roster: []
        }

        // Areas Data
        saveData.currentArea = Game.AreaHandler.currentArea;
        $.each(Game.AreaHandler.areas, (areaID , area) => {
            saveData.areas[areaID] = area;
        });

        // Actions Data
        $.each(Game.ActionsList, (actionID, action) => {
            saveData.actions[actionID] = {
                // Store variable information about actions  
                isVisible: action.isVisible,
                count: action.count,
                cost: action.cost, 
            }
        });

        // Advancements Data
        $.each(Game.Advancements.AdvancementsList, (advancementID, advancement) => {
            saveData.advancements[advancementID] = {
                // Store variable information about actions  
                hasTriggered: advancement.hasTriggered
            }
        });

        // Resources Data
        $.each(Game.Resources.PlayerResources, (resourceID, resource) => {
            saveData.resources[resourceID] = {
                amount: resource.amount,
                maximum: resource.maximum,
                generation: resource.generation,
                isVisible: resource.isVisible
            }
        });

        // Roster Data
        saveData.roster = {
            numberOfSlots: Game.Roster.numberOfSlots,
            dragons: Game.Roster.rosterDragons
        }

        // Log Data
        saveData.log = {
            notificationList: Game.Log.notificationList,
            totalNotifications: Game.Log.totalNotifications
        }

        // Convert save object to string for localStorage compatability
        //// TO ADD: Data compression.
        var encodedSaveData = JSON.stringify(saveData);

        // Save to localStorage
        //// TO ADD: Checks for browser compatability.
        localStorage.setItem(this.saveFileName, encodedSaveData);

    },

    decodeSave(encodedSaveData) {
        try {
            return JSON.parse(encodedSaveData);
        } catch (error) {
            const errorMessage = "Unable to parse and load saved data.";
            throw new Error(errorMessage);
        }
    },

    loadGame(importedSaveData) {

        const encodedSaveData = importedSaveData || localStorage.getItem(Game.Save.saveFileName);
        
        // Check valid JSON string has been given.
        if (!encodedSaveData) {
            throw new Error("Unable to load game. No previous game data found.");
        } else if (typeof encodedSaveData !== "string") {
            throw new Error("Unable to load game. Save not encoded correctly.");
        }

        // Decode JSON string.
        var saveData = this.decodeSave(encodedSaveData)

        // If decoding successful, load data.
        if (saveData) {

            // Areas
            Game.AreaHandler.currentArea = saveData.currentArea;
            $.each(saveData.areas, (areaID, areaInformation) => {
                Game.AreaHandler.loadDataFromSave(areaID, areaInformation);
            });

            // Actions
            Game.ActionHandler.loadDataFromSave(saveData.actions);

            // Advancements
            Game.Advancements.loadDataFromSave(saveData.advancements);

            // Resources
            Game.Resources.loadDataFromSave(saveData.resources);
        
            // Dragons
            //// Roster
            Game.Roster.loadDragonsFromSave(saveData.roster);
            //// Reserve
            Game.Reserve.loadDragonsFromSave(saveData.areas.reserve.reserveDragons);

            // Hatchery
            //// Slots
            Game.Hatchery.loadSlotDataFromSave(saveData.areas.hatchery.hatcherySlots);
            //// Eggs
            Game.Hatchery.loadEggDataFromSave(saveData.areas.hatchery.hatcheryEggs);

            // Notifications
            Game.Log.loadDataFromSave(saveData.log)


        }

    },

    importData(encodedSaveData) {
        // Take a JSON string containing save data, and set-up the game.
        main.restartGame();
        Game.Save.loadGame(encodedSaveData);
        main.setupGame(); 
    },

    exportData() {
        // export data
    },

    savedGameExists() {
        return localStorage.getItem(Game.Save.saveFileName) !== null;
    },

    deleteSave() {
        localStorage.removeItem(Game.Save.saveFileName);
        console.log("Save Deleted.")
    },

}