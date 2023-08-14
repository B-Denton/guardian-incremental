"use strict"; // execute in strict mode

Game.Field = {
    // Required area variables
    id: "field",
    name: "Field",
    description: "You find yourself in a small clearing.",
    isUnlocked: true,
    // Area-specific variables
    uncoveredFirstEgg: false,

    init() {
        Game.AreaHandler.addArea(this);
    },

    setup() {  // load area variables from saved data
        
    },

    activate() {  // load area when selected from nav bar.
        const areaContent = $("#area-content");
        areaContent.empty();
        areaContent.append($("<div>")
            .attr("class", "area-description")
            .html(field.description)
        );
        areaContent.append($("<div>").attr("id", "player-actions-container"));
        // Set-up action buttons
        Game.ActionHandler.setupActions($("#player-actions-container"));

    },

    update() {

    },

    

    





}

