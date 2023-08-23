"use strict"; // execute in strict mode

Game.Field = {

    init() {

        // Load Default Data
        const data = Game.AreaData["field"];
        for (var key in data) {
            this[key] = data[key]
        };

        Game.AreaHandler.addArea(this);

        this.createStartingModal();
    },

    setup() { 


    
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
        Game.ActionHandler.updateUnaffordableButtons()
    },

    createStartingModal() {
        // Modal Container
        $("#game").append($("<div>")
            .attr("class", "modal")
            .attr("id", "game-start-modal")
        );
        var modalID = $("#game-start-modal");

        // Modal Close button
        modalID.append($("<div>")
            .attr("class", "close-modal")
            .on("click", () => {
                $("#game-start-modal").attr("style", "display: none;");
            })
            .html("&times;")
        );

        // Modal Content
        modalID.append($("<div>")
            .attr("class", "modal-text")
            .html(
                "<h1> Welcome to <u>The Dragons' Guardian</u> Incremental. </h1>" +
                " Your Guardian Circle has received news concerning a recent <br> \
                  string of disasters plaguing the nearby island of Nereus. <br> \
                  Rumours say that the dragons who once protected its land have been lost; <br> \
                  the creatures who call it home have been left defenseless. <br><br> \
                  Your Circle have sent you alone on the mission to recover Nereus, <br> \
                  to find out what caused such disaster, and to restore it to its former glory."
            )
        );
    }

    

    





}

