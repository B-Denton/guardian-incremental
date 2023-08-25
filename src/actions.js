"use strict"; // execute in strict mode

// Actions are visually separated based on type.
Game.ActionTypes = ["player", "build", "upgrade"];

// Holds the current information about actions that the players can take to generate and spend resources.
Game.ActionsList = {

}

// Store current data on actions, and process actions.
Game.ActionHandler = {

    init() {
        $.each(Game.ActionsData, (actionID, action) => {
            Game.ActionsList[actionID] = {...action};
        });
    },

    setup() {

    },
    
    loadDataFromSave(actionData) {
        $.each(actionData, (actionID, actionData) => {
            for (var key in actionData) {
                    Game.ActionsList[actionID][key] = actionData[key];
            };
        });
    },

    setupActions(container) {
        // Reset content
        container.empty();       
        // Create container to hold each action type
        $.each(Game.ActionTypes, ( _ , type) => {
            container.append($("<div>")
                .attr("class", "action-type-container")
                .attr("id", type + "-container")
            );
        }); 
        // Create buttons
        $.each(Game.ActionsList, ( _ , action) => {
            if (action.isVisible) {
                var containerID = $("#" + action.type + "-container");
                containerID.append(this.createActionButton(action));
            }
        });

    },

    createActionButton(action) {
        const actionButton = $("<button>")
            .attr("class", "action button")
            .attr("id", "action-button-" + action.actionID)
            .html(action.actionName)
            .hover(
                function() { // Handler In
                    Game.Tooltip.showActionTooltip(action);   
                },
                function() { // Handler Out
                    Game.Tooltip.showEmptyTooltip();   
                }
            )
            .on("click", function() {
                if (Game.ActionHandler.isAffordable(action)) {
                    // Take Action
                    action.action();
                    // Remove cost from player resources
                    Game.ActionHandler.payActionCost(action);
                    // Increment action count
                    action.count++;
                    // Update Tooltip
                    Game.ActionHandler.updateTooltipCosts(action);
                    // Update Build Count
                    if (action.type == "build" || action.type == "upgrade") {
                        Game.ActionHandler.updateBuildCount(action);
                    }
                    // Visual Cooldown Effect
                    var btn = $(this);
                    btn.prop('disabled', true);
                    setTimeout(function(){
                        btn.prop('disabled', false);
                    }, 500);
                }
            });

        if (action.type == "build" || action.type == "upgrade") {
            if (action.repeatable) {
                this.createBuildCount(actionButton, action);
            } 
        }
        
        return actionButton
    },

    createBuildCount(actionButton, action) {
        const buildCount = $("<div>")
            .attr("class", "build-count")
            .attr("id", "build-count-" + action.actionID)
            .html("<p>" + action.count + "</p>");
        actionButton.append(buildCount);
    },

    isAffordable(action) {
        var isAffordable = true;
        $.each(action.cost, ( _ , cost) => {
            if (this.calculateResourceCost(action, cost) > playerResources[cost.resource].amount) {
                isAffordable = false;
            }
        });
        return isAffordable;
    },

    updateUnaffordableButtons() {
        $.each(Game.ActionsList, ( _ , action) => {
            var buttonID = $("#action-button-" + action.actionID);
            if (!this.isAffordable(action)) {
                buttonID.addClass('unaffordable');
            } else {
                buttonID.removeClass('unaffordable');
            }

        });
    },

    updateTooltipCosts(action) {
        $.each(action.cost, (i, cost) => {
            $("#action-tooltip-cost-" + action.actionID + cost.resource).html("- " + this.calculateResourceCost(action, cost) + " " + playerResources[cost.resource].resourceName)
        });
    },

    updateTooltipProduce(action) {
        $.each(action.produce, (produceID, produceDisplay) => {
            $("#action-tooltip-cost-" + action.actionID + "-" + produceID).html("+ " + produceDisplay);
        });
    },

    updateBuildCount(action) {
        $("#build-count-" + action.actionID).html("<p>" + action.count + "</p>");
    },

    calculateResourceCost(action, cost) {
        return Math.floor(cost.baseCost * (Math.pow(cost.growthRate, action.count)));
    },

    payActionCost(action) {
        $.each(action.cost, (i, cost) => {
            playerResources[cost.resource].amount -= this.calculateResourceCost(action, cost);
        });
    }

};