"use strict"; // execute in strict mode


// Holds information on which resources the player has unlocked, and the amount they have.
Game.Resources = {

    PlayerResources: {},  // key: resourceID, value: {resource}

    init() {
        $.each(Game.ResourceData, (resourceID, resource) => {
            Game.Resources.PlayerResources[resourceID] = resource;
        });
    },

    setup() {  // load values from saved data.

    },

    update() {  // update resources on game tick.

        this.calculateIncome();
        this.generateIncome();

        // Reset content
        const resourceContainerID = $("#player-resources")
        resourceContainerID.empty();
        // Panel title
        resourceContainerID.append($("<div>")
            .attr("id", "player-resources-title")
            .html("Your Resources"));

        // Update resource values.
        $.each(Game.Resources.PlayerResources, ( _ , resource) => {
            if (resource.isVisible) {
                resourceContainerID.append($("<div>")
                    .attr("class", "resource " + resource.type)
                    .html(resource.resourceName + ": " + Decimal.floor(resource.amount) + " (" + Decimal(resource.income * Game.GAME_INTERVAL).toSD(4) + "/s)"))
            }
        });
  
    },

    calculateIncome() {
        // Reset income.
        $.each(playerResources, ( _ , resource) => {
            resource.income = 0;
        })

        // Calculate generation from creatures.
        $.each(playerResources, ( _ , resource) => {
            if (resource.generation.length > 0) {
                $.each(resource.generation, ( _ , generation) => {
                    playerResources[generation.resource].income += (generation.baseGeneration * resource.amount)
                })
            }
        })

        // Calculate income from different areas.
        reserve.calculateIncome();

        // Show new resources with non-zero income.
        $.each(Game.Resources.PlayerResources, ( _ , resource) => {
            if (resource.amount != 0 && !resource.isVisible) {
                resource.isVisible = true;
            }
        })
    },

    generateIncome() {
        // generate tick income based on current income values.
        $.each(Game.Resources.PlayerResources, ( _ , resource) => {
            resource.amount += resource.income;
        });
    }




    
}