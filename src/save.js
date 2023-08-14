"use strict"; // execute in strict mode

Game.Save = {

    saveFileName: "Game Save",

    saveGame() {
        var saveData = {
            version: Game.CURRENT_VERSION,
            activeArea: "",  // Area that player is viewing at time of save [areaID]
            resources: {},
            areaUnlocked: {}  // key: areaID, value: object containing area information
        }

        // Save the player's current resource amounts.

        $.each(Game.PlayerResources, (resourceID, resource) => {
            saveData.resources[resourceID] = {
                // Store information about the resource amounts here, e.g.
                amount: resource.amount
            }
        });

        // Save the player's unlocked areas.
        saveData.activeArea = Game.AreaHandler.currentArea;
        $.each(Game.UnlockedAreas, (areaID, area) => {
            saveData.areaUnlocked[areaID] = area
        });

        // Convert save object to string for localStorage compatability
        //// TO ADD: Data compression.
        encodedSaveData = JSON.stringify(saveData);

        // Save to localStorage
        //// TO ADD: Checks for browser compatability.
        localStorage.setItem(saveFileName, encodedSaveData);
    },

    decodeSave(encodedSaveData) {
        try {
            return JSON.parse(encodedSaveData);
        } catch (error) {
            const errorMessage = "Unable to parse and load saved data.";
            throw new Error(errorMessage);
        }
    },

    loadGame(encodedSaveData) {
        // Check valid JSON string has been given.
        if (!encodedSaveData) {
            throw new Error("Unable to load game. No previous game data found.");
        } else if (typeof encodedSaveData !== "string") {
            throw new Error("Unable to load game. Save not encoded correctly.");
        }

        // Decode JSON string.
        saveData = this.decodeSave(encodedSaveData)

        // If decoding successful, load data.
        if (saveData) {
            //// Areas
            Game.AreaHandler.currentArea = activeArea;
            $.each(saveData.areaUnlocked, (areaID, area) => {
                Game.AreaHandler.allAreas[areaID] = area
            });

            //// Resources
            $.each(saveData.resources, function(resourceID, resource) {
                // Confirm resource type is still used in current version before loading.
                if (Game.PlayerResources.has(resourceID)) {  
                    Game.PlayerResources.get(resourceID).amount = isNaN(resource.amount) ? 0 : resource.amount;
                }
            });
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
        return localStorage.getItem(self.saveFileName) !== null;
    },

    deleteSave() {
        localStorage.removeItem(self.saveFileName);
    },

}