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
        // Create grid for hatchery slots
        areaContent.append($("<div>")
            .attr("id", "settings-grid")
        );  

        this.loadSettingsElements($("#settings-grid"));

        //<div id="delete-save" onclick="Game.Save.deleteSave()">Delete Local Save</div>

    },


    loadSettingsElements(container) {

        // Wipe Local Save
        container.append($("<button>")
            .attr("class", "settings button small")
            .attr("id", "delete-local-save")
            .on("click", () => {
                Game.Save.deleteSave();
            })
            .html("Delete Local Save")
        );

        // Wipe Local Save
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

}