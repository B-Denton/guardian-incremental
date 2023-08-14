"use strict"; // execute in strict mode

Game.Tooltip = {

    init() {
        this.showEmptyTooltip() 
    },

    setup() {

    },

    showBasicDescription(description) {
        this.resetTooltip()
         // Create tooltip box.
        const tooltipContainer = $("<div>")
            .attr("class", "tooltip basic")
        $("#tooltip-panel").append(tooltipContainer);
        // Add description of button.
        tooltipContainer.append($("<div>")
            .attr("class", "tooltip-text weighted")
            .html("<br>" + description)
        );

    },

    showActionTooltip(action) {
        this.resetTooltip()
        // Create tooltip box.
            const tooltipContainer = $("<div>")
                .attr("class", "action tooltip")
                .attr("id", "action-tooltip-" + action.actionID);
            $("#tooltip-panel").append(tooltipContainer);
    
            // Add description of action.
            tooltipContainer.append($("<div>")
                .attr("class", "action tooltip-text description")
                .html(action.actionDescription + "<br>")
            );
                
            // Add cost of action.
            $.each(action.cost, (i, cost) => {
                tooltipContainer.append($("<div>")
                    .attr("class", "action tooltip-text cost")
                    .attr("id", "action-tooltip-cost-" + action.actionID + cost.resource)
                    .html("- " + Game.ActionHandler.calculateResourceCost(action, cost) + " " + playerResources[cost.resource].resourceName)
                );
            })
    
            // Spacing
            if (Object.keys(action.produce).length > 0) {
                tooltipContainer.append($("<div>").html("<div>").attr("style", "margin: 5px;"));
            }
    
            // Add benefit of action.
            $.each(action.produce, (produceID, produceDisplay) => {
                tooltipContainer.append($("<div>")
                    .attr("class", "action tooltip-text produce")
                    .attr("id", "action-tooltip-cost-" + action.actionID + "-" + produceID)
                    .html("+ " + produceDisplay)
                );
            }); 
    },

    showDragonSlotTooltip(dragon) {
        this.resetTooltip()
        // Create tooltip
        const tooltipContainer = $("<div>")
            .attr("class", "attributes tooltip")
            .attr("id", "attributes-tooltip-" + dragon.index);
        $("#tooltip-panel").append(tooltipContainer);
        // Tooltip Title
        tooltipContainer.append($("<div>")
            .attr("class", "tooltip-text weighted")
            .html(dragon.name + "'s Attributes")
        );          
        // Add information
        tooltipContainer.append($("<div>")
            .attr("class", "reserve tooltip-text")
            .html("Level " + dragon.level + "<br>Experience: " + dragon.xp + " / " + dragon.experienceNeeded(dragon.level))
        );
        var attributes = [dragon.hp, dragon.attack, dragon.defense, dragon.speed];
        $.each(attributes, (i, stat) => {
        if (stat.id == "hp") {
            var displayText = stat.value + " / " + stat.max;
        } else {
            var displayText = stat.value
        }
        tooltipContainer.append($("<div>")
            .attr("class", "reserve tooltip-text")
            .html(attributes[i].name + ": " + displayText)
        );
        });
    },

    showDragonReleaseTooltip(dragon) {
        this.resetTooltip()
        // Create tooltip box.
        const tooltipContainer = $("<div>")
            .attr("class", "reserve tooltip")
            .attr("id", "release-tooltip-" + dragon.id);
        $("#tooltip-panel").append(tooltipContainer);
        // Tooltip Title
        tooltipContainer.append($("<div>")
            .attr("class", "tooltip-text description")
            .html("Release " + dragon.name + ", so that they can go help the other islands.")
        );  
        $.each(dragon.release, (resourceID, releaseValue) => {
            tooltipContainer.append($("<div>")
                .attr("class", "reserve tooltip-text produce")
                .html("+ " + releaseValue + " " + Game.ResourceData[resourceID].resourceName)
            );
        });
    },

    showExploreAreaTooltip(areaID) {
        // Helper function for generating button tooltips for selecting an Explore area
        this.resetTooltip()
        var area = Game.ExploreData[areaID]["area"]
        // Create tooltip box.
        const tooltipContainer = $("<div>")
            .attr("class", "explore tooltip")
            .attr("id", "explore-tooltip-" + areaID);
        $("#tooltip-panel").append(tooltipContainer);
        // Add description of area.
        tooltipContainer.append($("<div>")
            .attr("class", "explore tooltip-text description")
            .html(area.areaDescription + "<br>")
        );
    },

    showStrategyTooltip(strategy) {
        // Helper function for generating button tooltips for selecting an encounter strategy
        this.resetTooltip()
        // Create tooltip box.
        const tooltipContainer = $("<div>")
            .attr("class", "strategy tooltip")
            .attr("id", "strategy-tooltip-" + strategy.id);
        $("#tooltip-panel").append(tooltipContainer);
        // Add description of area.
         tooltipContainer.append($("<div>")
            .attr("class", "strategy tooltip-text description")
            .html(strategy.description + "<br><br>" + strategy.effectDescription)
        );

    },

    resetTooltip() {
        $("#tooltip-panel").empty();
    },

    showEmptyTooltip() {
        $("#tooltip-panel").empty();
        $("#tooltip-panel").append($("<div>")
            .attr("class", "tooltip-text blank")
            .html("Extra information will appear here when you hover over features.")
        )

    }



}