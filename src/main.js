"use strict"; // execute in strict mode
window.Game = window.Game || {};

// Core Variables
$.extend(Game, {
    GAME_NAME: "The Dragons' Guardian",
    // Version information
    CURRENT_VERSION: "0.2.05",
    ORIGINAL_VERSION: "0.1",
    VERSION_NAME: "Locals Saved",
    // Number handling
    EPSILON: 1e-6,  // accuracy for floating-point equality comparisons
    MAX_SAFE_NUMBER: Math.pow(2, 36) - 1,  // for 5 decimal place precision
    // Game loop settings
    GAME_INTERVAL: 50,
    AUTOSAVE_INTERVAL: 2000,
});

Game.Main = {

    timestampAutosave: new Date(),

    init() {

        $("#game-name").empty();
        $("#game-name").append(Game.GAME_NAME)
        $("#game-version").empty();
        $("#game-version").append("version " + Game.CURRENT_VERSION)

        main.restartGame();
        main.restoreGameFromSave();
        main.setupGame();
        

    },

    restartGame() {

        // reset all variables to their default values.

        // UI
        log.init();
        roster.init();
        tooltip.init();

        // Resources
        Game.Elements.init();
        Game.Resources.init();
        Game.ActionHandler.init();
        Game.Advancements.init();

        //// Areas
        explore.init();
        field.init();
        hatchery.init();
        reserve.init();

        //// Area Handler
        Game.AreaHandler.init();

    },

    restoreGameFromSave() { 
        // Check if save data exists; if so, load it.
        if (Game.Save.savedGameExists()) {
            try {
                Game.Save.loadGame();
                console.log("Loaded game.");
            } catch (err) {
                console.log(err)
            }
        } else {
            $("#game-start-modal").attr("style", "display: block;")     
        }
    },

    setupGame () {
        // Use currently loaded data to set-up the game.
        //// Resources
        Game.Resources.setup();
        Game.Advancements.setup();
        Game.ActionHandler.setup();

        //// Areas
        field.setup();
        hatchery.setup();
        reserve.setup();
        explore.setup();

        // Start game ticks.
        setInterval(main.gameTick, Game.GAME_INTERVAL);
        setInterval(main.autosave, Game.AUTOSAVE_INTERVAL);
        
        // Load area
        Game.AreaHandler.loadCurrentArea();
   
    },

    prestigeGame() {
        // Game prestige placeholder.
    },

    gameTick() {

        // Process things that should happen every game tick.
        Game.Advancements.checkAdvancements();
        resources.update();

        // Check Area Progress.
        field.update();
        hatchery.update();
        reserve.update();
        explore.update();

        // Update last autosave time.
        $("#last-autosave").html("Last autosave was " + Math.round((Date.now() - Game.Main.timestampAutosave)/1000) + " seconds ago.")

        
    },

    autosave() {
        Game.Save.saveGame();
        main.lastAutosave = Date.now();
        console.log("Autosave.")
    }

};

window.addEventListener('load', function() {
    $("#game").show();
    main.init();
}); 














