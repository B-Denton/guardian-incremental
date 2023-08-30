"use strict"; // execute in strict mode

Game.Settings = {

    init() {
        // Load Default Data
        const data = Game.AreaData["settings"];
        for (var key in data) {
            this[key] = data[key]
        };
        Game.AreaHandler.addArea(this);
    },

    setup() {



    },

    activate() {
        const areaContent = $("#area-content");
        // Reset content
        areaContent.empty();
        // Area description
        areaContent.append($("<div>")      
            .attr("class", "area-description")
            .html(settings.description)
        );
        // Create grid for settings
        areaContent.append($("<div>")
            .attr("id", "settings-grid")
        );  
        // Load settings
        this.loadSettingsElements($("#settings-grid"));
        this.showCorrectElements();
    },

    loadSettingsElements(container) {

         // Turn Autosave On
        container.append($("<button>")
            .attr("class", "settings button small")
            .attr("id", "autosave-turn-on")
            .on("click", () => {
                if (Game.Main.autosaveInterval == undefined) {
                    Game.Main.autosaveInterval = setInterval(Game.Main.autosave, Game.AUTOSAVE_INTERVAL);
                    Game.Settings.showCorrectElements();
                }
            })
            .html("Turn On Autosave")
        );

        // Turn Autosave Off
        container.append($("<button>")
            .attr("class", "settings button small")
            .attr("id", "autosave-turn-off")
            .on("click", () => {
                if (Game.Main.autosaveInterval != undefined) {
                    clearInterval(Game.Main.autosaveInterval)
                    Game.Main.autosaveInterval = undefined;
                    $("#last-autosave").html("Autosave off.");
                    Game.Settings.showCorrectElements();
                }
            })
            .html("Turn Off Autosave")
        );

        // Wipe Local Save
        container.append($("<button>")
            .attr("class", "settings button small")
            .attr("id", "delete-local-save")
            .on("click", () => {
                Game.Save.deleteSave();
            })
            .html("Delete Local Save")
        );

        // Wipe Saved Data and Restart Game
            container.append($("<button>")
            .attr("class", "settings button small")
            .attr("id", "restart-game")
            .on("click", () => {
                Game.Save.deleteSave();
                Game.Main.restartGame();
                Game.Main.setupGame();
            })
            .html("Restart Game")
        );

    },

    showCorrectElements() {   
        if (Game.Main.autosaveInterval == undefined) {  
            $("#autosave-turn-on").attr("style", "display: block");
            $("#autosave-turn-off").attr("style", "display: none");
        } else {
            $("#autosave-turn-on").attr("style", "display: none");
            $("#autosave-turn-off").attr("style", "display: block");
        }
    },

}