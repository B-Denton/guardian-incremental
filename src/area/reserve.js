"use strict"; // execute in strict mode

Game.Reserve = {

    init() {
        // Load Default Data
        var reserveData = structuredClone(Game.AreaData["reserve"]);
        Game.Reserve = Object.assign(Game.Reserve, reserveData);

        // Add Reserve Slots
        for (let i=0; i < this.numberOfSlots; i++) {
            this.reserveDragons[i] = undefined;
        };

        Game.AreaHandler.addArea(this);

    },

    setup() { 



        if (testing) {
            Game.Reserve.isUnlocked = true;
            for (let i=0; i < 2; i++) {
                //reserve.addDragon(new Dragon("ruby"));
            };
        }
        
    },

    activate() {  // load area when selected from nav bar.
        const areaContent = $("#area-content");
        areaContent.empty();
        areaContent.append($("<div>")
            .attr("class", "area-description")
            .html(reserve.description)
        ); 
        areaContent.append($("<div>").attr("id", "reserve-grid"));  // Container for the Dragon Slots.
        $.each(this.reserveDragons, (i, dragon) => {
            reserve.loadReserveSlot(i, dragon);  // Load slots into area.
        });
    },

    update() {  // update area on game tick.
        $.each(this.reserveDragons, function(i, dragon) {
            if (dragon) {
                $("#reserve-slot-container-empty-"+i).attr("style", "display: none");
                $("#reserve-slot-container-full-"+i).attr("style", "display: block");
            } else {
                $("#reserve-slot-container-empty-"+i).attr("style", "display: block");
                $("#reserve-slot-containerfull-"+i).attr("style", "display: none");
            }
        });
    },

    addDragon(dragon) {
        // add dragon to reserve, or return -1 if reserve is full.
        const index = this.reserveDragons.indexOf(undefined)
        if (index != -1) {
            this.reserveDragons[index] = dragon;
        } 
        return index;
    },

    loadDragonsFromSave(dragonData) {
        for (let i=0; i < Game.Reserve.numberOfSlots; i++) {
            reserve.reserveDragons[i] = undefined;
        };
        $.each(dragonData, ( i , oldDragon) => {
            if (oldDragon != undefined) {
                var newDragon = new Dragon(oldDragon.element);
                for (var key in oldDragon) {
                    newDragon[key] = oldDragon[key];
                };
                reserve.reserveDragons[i] = newDragon;
            } else {
                reserve.reserveDragons[i] = undefined;
            }
            reserve.loadReserveSlot(i, newDragon)
        });
    },

    loadReserveSlot(i, dragon) {
        // HTML for all Reserve Slots
        $("#reserve-grid").append($("<div>").attr("class", "reserve-slot").attr("id", "reserve-slot-"+i));
        const reserveSlotID = $("#reserve-slot-"+i)

        // HTML for Full Reserve Slots
        reserveSlotID.append($("<div>")
                                .attr("class", "reserve-slot-container-full")
                                .attr("id", "reserve-slot-container-full-"+i)
                                .hover(
                                    function() { // Handler In
                                        Game.Tooltip.showDragonSlotTooltip(dragon);
                                    },
                                    function() { // Handler Out
                                        Game.Tooltip.showEmptyTooltip();   
                                    }
                                ));
        const fullSlotContainer = $("#reserve-slot-container-full-"+i);
        reserve.loadFullSlotElements(fullSlotContainer, i, dragon);

        // HTML for empty Reserve Slots
        reserveSlotID.append($("<div>")
                            .attr("class", "reserve-slot-container-empty")
                            .attr("id", "reserve-slot-container-empty-"+i));
        const emptySlotContainer = $("#reserve-slot-container-empty-"+i);
        reserve.loadEmptySlotElements(emptySlotContainer, i);

        // Hide/display elements based on if the slot has a dragon.
        if (dragon) {
            $("#reserve-slot-container-empty-"+i).attr("style", "display: none");
            $("#reserve-slot-container-full-"+i).attr("style", "display: block");
        } else {
            $("#reserve-slot-container-empty-"+i).attr("style", "display: block");
            $("#reserve-slot-container-full-"+i).attr("style", "display: none");
        }
    },

    loadFullSlotElements(container, i, dragon) {

        function addDragonIncomeInformation() {       
            // Create container for income information
            container.append($("<div>")
                .attr("class", "reserve income-container")
                .attr("id", "reserve-income-container-" + dragon.id)
                .attr("style", "border-top: 1px " + dragon.color + " solid; \
                                border-bottom: 1px " + dragon.color + " solid")
            );
            const incomeContainer = $("#reserve-income-container-" + dragon.id); 
            // Add information
            $.each(dragon.income, (resourceID, resourceIncome) => {
                incomeContainer.append($("<div>")
                    .attr("class", "reserve income-text")
                    .html(Game.Resources.PlayerResources[resourceID].resourceName + ": " + Decimal(resourceIncome * Game.GAME_INTERVAL).toSD(4) + "/s ")
                    .attr("style", "color:" + dragon.color)
                );
            });
        };

        if (dragon) {
            // Title: Dragon Name
            container.append($("<div>") 
                .attr("class", "reserve-text title")
                .attr("style", "color:" + dragon.color + "; \
                                padding: 0px 0px 10px 0px; \
                                border-bottom: 1px " + dragon.color + " solid")
                .html(dragon.name)
            );

            // Dragon Basic Information and Combat Attributes
            container.append($("<div>")
                .attr("class", "dragon-information-box")
                .attr("id", "dragon-information-box-" + dragon.id)
                .hover(
                    function() { // Handler In
                        Game.Tooltip.showDragonSlotTooltip(dragon);
                    },
                    function() { // Handler Out
                        Game.Tooltip.showEmptyTooltip();   
                    }
                )
            );
            const attributeBoxID = $("#dragon-information-box-" + dragon.id)

            attributeBoxID.append($("<div>") // dragon type.
                .attr("class", "reserve-text weighted") 
                .attr("style", "color:" + dragon.color)
                .html(dragon.elementName + " Dragon")
            );
            attributeBoxID.append($("<div>") // dragon level.
                .attr("class", "reserve-text weighted")
                .attr("style", "color:" + dragon.color)
                .html("Level " + dragon.level)
            );

            // Dragon Elemental Information
            addDragonIncomeInformation();

            // Move To Roster Button
            container.append($("<button>")
                .attr("class", "button small")
                .attr("id", "add-to-team-button-"+i)
                .attr("style", "display: inline-block")
                .html("Add to Team")
                .hover(
                    function() { // Handler In
                        Game.Tooltip.showBasicDescription("Add this dragon to your roster.");
                    },
                    function() { // Handler Out
                        Game.Tooltip.showEmptyTooltip();   
                    }
                )
                .on("click", function() { 
                    Game.Tooltip.showEmptyTooltip();   
                    reserve.moveDragonToRoster(i, dragon);
                })
            );

            // Release Dragon Button
            container.append($("<button>")
                .attr("class", "button small")
                .attr("id", "release-dragon-button-"+i)
                .attr("style", "display: inline-block")
                .html("Release")
                .hover(
                    function() { // Handler In
                        Game.Tooltip.showDragonReleaseTooltip(dragon);
                    },
                    function() { // Handler Out
                        Game.Tooltip.showEmptyTooltip();   
                    }
                )
                .on("click", function() { 
                    reserve.releaseDragon(i, dragon);
                })
            );  
        }
    },

    loadEmptySlotElements(container, i) {
        // Slot Title
        container.append($("<div>")
            .attr("class", "weighted title")
            .attr("style", "margin-top: 10px;")
            .html("Reserve Space")
            ); 
    },

    calculateIncome() {
        $.each(this.reserveDragons, (i, dragon) => {
            if (dragon) {
                $.each(dragon.income, (resourceID, resourceIncome) => {
                    Game.Resources.PlayerResources[resourceID].income += resourceIncome
                });
            }
        });
    },

    moveDragonToRoster(i, dragon) {
        $("#reserve-slot-container-full-"+i)
        if (dragon) {
            const isRosterFull = roster.addDragon(dragon);
            if (isRosterFull == -1) {  // If roster is full.
                Game.Log.addNotification("Your roster is already full.", "warning");
            } else {
                reserve.reserveDragons[i] = undefined; // remove dragon from reserve.
                reserve.activate();
            }
        }
    },

    releaseDragon(i, dragon) {
        if (dragon) {
            $("#reserve-slot-container-full-"+i).empty();
            $.each(dragon.release, (resourceID, releaseReward) => {
                resources.PlayerResources[resourceID].amount += releaseReward;
            })
            reserve.reserveDragons[i] = undefined;
        }
    }




}