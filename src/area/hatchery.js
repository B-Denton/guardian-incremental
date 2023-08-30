"use strict"; // execute in strict mode


class HatcherySlot {
    // Slot for hatching eggs in the hatchery.
    constructor() {
        this.currentTemperature = Game.Hatchery.slotsData.currentTemperature;
        this.temperatureIncrementOnClick = Game.Hatchery.slotsData.temperatureIncrementOnClick;
        this.temperatureDrain = Game.Hatchery.slotsData.temperatureDrain;
    };
};

Game.Hatchery = {

    init() {
        // Load Default Data
        var hatcheryData = structuredClone(Game.AreaData["hatchery"]);
        Game.Hatchery = Object.assign(Game.Hatchery, hatcheryData);
        Game.AreaHandler.addArea(this);
    },

    setup() {

        // Add Hatchery Slots
        for (let i=0; i < Game.Hatchery.numberOfSlots; i++) {
            hatchery.addHatcherySlot(new HatcherySlot());
        }

        if (testing) {
            hatchery.isUnlocked = true;
            if (hatchery.hatcherySlots.length == 0) {
                hatchery.hatcherySlots = [];
                hatchery.addHatcherySlot(new HatcherySlot());
                hatchery.addHatcherySlot(new HatcherySlot());
            }
        }

    },

    activate() {  // load area when selected from nav bar.
        const areaContent = $("#area-content");
        // Reset content
        areaContent.empty();
        // Area description
        areaContent.append($("<div>")      
            .attr("class", "area-description")
            .html(hatchery.description)
        );
        // Create grid for hatchery slots
        areaContent.append($("<div>")
            .attr("id", "hatchery-grid")
        );  
        // Load hatchery slots
        $.each(hatchery.hatcherySlots, (i, slot) => {
            hatchery.loadSlotElements(i, slot, hatchery.hatcheryEggs[i]);
        });
    },

    update() {  // update area on game tick.
        $.each(hatchery.hatcherySlots, (i, slot) => {
            hatchery.updateSlotElements(i, slot);
        }) 
    },

    loadSlotDataFromSave(slots) {
        $.each(slots, (i, slotData) => {
            var slot = new HatcherySlot();
            for (var key in slotData) {
                slot[key] = slotData[key];
            };
            Game.Hatchery.hatcherySlots[i] = slot;
        });
    },

    loadEggDataFromSave(eggs) {
        $.each(eggs, (i, eggData) => {
            if (eggData) {
                var egg = new Egg(eggData.element);
                for (var key in eggData) {
                    egg[key] = eggData[key];
                };
                Game.Hatchery.hatcheryEggs[i] = egg;
            }
        });
    },

    addHatcherySlot(slot) {
        hatchery.hatcherySlots.push(slot);
        hatchery.hatcheryEggs.push(undefined);
    },

    addEgg(egg, index) {
        hatchery.hatcheryEggs[index] = egg;
    },

    loadSlotElements(i, slot, egg) {
        // HTML for all Hatchery Slots
        $("#hatchery-grid").append($("<div>")
            .attr("class", "hatchery-slot")
            .attr("id", "hatchery-slot-"+i)
        );
        const hatcherySlotID = $("#hatchery-slot-"+i);
        // Slot Title
        hatcherySlotID.append($("<div>")
            .attr("class", "weighted title")
            .html("Hatchery Nest")
        ); 
        // HTML for Full Hatchery Slots
        hatcherySlotID.append($("<div>")
                                .attr("id", "hatchery-slot-container-full-"+i));
        const fullSlotContainer = $("#hatchery-slot-container-full-"+i);
        hatchery.loadFullSlotElements(fullSlotContainer, i, slot, egg);
       
        // HTML for empty Hatchery Slots
        hatcherySlotID.append($("<div>")
                            .attr("id", "hatchery-slot-container-empty-"+i));
        const emptySlotContainer = $("#hatchery-slot-container-empty-"+i);
        hatchery.loadEmptySlotElements(emptySlotContainer, i, slot);

        // Hide/display elements based on if the slot has an egg, and that egg's hatching progress.
        if (egg) {  // Full slots
            $("#hatchery-slot-container-empty-"+i).attr("style", "display: none");
            $("#hatchery-slot-container-full-"+i).attr("style", "display: block");
            if (!egg.isHatched) {  
                $("#hatch-egg-"+i).attr("style", "display: none")
            } else {  
                $("#increase-heat-button-"+i).attr("style", "display: none")
                $("#is-egg-hatching-"+i).attr("style", "display: none")
            }
        } else {  // Empty slots
            $("#hatchery-slot-container-empty-"+i).attr("style", "display: block");
            $("#hatchery-slot-container-full-"+i).attr("style", "display: none");
            $.each(Game.Resources.PlayerResources, ( _ , resource) => { 
                if (resource.type == "egg") {
                    if (resource.amount > 1) {
                        $("#egg-select-option-" + resource.element + "-" + i)
                            .attr("style", "display: inline-block; \
                                            color: "+ Game.Elements.allElements[resource.element].color);
                    } else {
                        $("#egg-select-option-" + resource.element + "-" + i)
                            .attr("style", "display: none");
                    }
                }
            });
        }
    },

    loadEmptySlotElements(containerID, i, slot) {
        // Create div elements for representing a hatchery slot that has no current egg.
        // Descriptor Text
        containerID.append($("<div>")
            .attr("style", "margin: 10px 0px;")
            .html("This slot is empty... <br> \
                   Select an egg to hatch!"));
        // Container for egg options
        containerID.append($("<div>")
            .attr("class", "egg-select-container")
            .attr("id", "egg-select-container-"+i));                        
        const eggSelectContainer = $("#egg-select-container-"+i);
        // Create clickable option for each egg type
        $.each(Game.Resources.PlayerResources, ( resourceID , resource) => {
            if (resource.type == "egg") {
                eggSelectContainer.append($("<div>")
                    .attr("class", "egg-select-option")
                    .attr("id", "egg-select-option-"+resource.element+"-"+i)
                    .attr("style", "color: " + Game.Elements.allElements[resource.element].color)
                    .html(resource.resourceName)
                    .hover(
                        function() { // Handler In
                            Game.Tooltip.showBasicDescription("Place a " + resource.resourceName + " in this hatchery slot.");   
                        },
                        function() { // Handler Out
                            Game.Tooltip.showEmptyTooltip();   
                        }
                    )
                    .on("click", function() {
                        Game.Resources.PlayerResources[resourceID].amount -= 1;
                        hatchery.hatcheryEggs[i] = new Egg(resource.element);
                        Game.Tooltip.showEmptyTooltip();
                        hatchery.activate();
                }));
            }
        });
        // Append elements to container
        containerID.append(eggSelectContainer);
    },

    loadFullSlotElements(containerID, i, slot, egg) {
    // Create div elements for representing a hatchery slot containing an egg.
        if (egg) {  
            // Slot Temperature
                containerID.append($("<div>")
                    .attr("id", "current-temperature-"+i)
                    .attr("style", "margin-top: 10px;")
                    .html("Temperature: " + Math.round(slot.currentTemperature) + "°C")
            );   
            // Hatching Description Text
            containerID.append($("<div>")
                .attr("class", "weighted")
                .attr("id", "is-egg-hatching-"+i)
                .html(egg.getIsEggHatchingText(slot.currentTemperature, egg.hatchingProgress))
            );    

            // Increase Temperature Button
            containerID.append($("<button>")
                .attr("class", "increase-heat button small")
                .attr("id", "increase-heat-button-"+i)
                .html("Warm the nest")
                .hover(
                    function() { // Handler In
                        Game.Tooltip.showBasicDescription("Increases the temperature of this hatchery nest. <br><br> Different types of egg will start hatching at different temperatures!");   
                    },
                    function() { // Handler Out
                        Game.Tooltip.showEmptyTooltip();   
                    }
                )
                .on("click", function() { 
                    slot.currentTemperature = 
                        Math.min(slot.currentTemperature 
                        + slot.temperatureIncrementOnClick, 
                        hatchery.maximumTemperature);
                })
            );

            // Hatch Egg Button
            containerID.append($("<button>")
                .attr("class", "hatch-egg button small")
                .attr("id", "hatch-egg-"+i)
                .attr("style", "display: inline-block")
                .html("Hatch!")
                .hover(
                    function() { // Handler In
                        Game.Tooltip.showBasicDescription("Hatch the new dragon and send them to the Reserve, if you have space for them.");   
                    },
                    function() { // Handler Out
                        Game.Tooltip.showEmptyTooltip();   
                    }
                )
                .on("click", function() {
                    // Attempt to add dragon to reserve: returns -1 if reserve is full.
                    const isReserveFull = Game.Reserve.addDragon(new Dragon(egg.element))  
                    if (isReserveFull == -1) {  // If reserve is full.
                        Game.Log.addNotification("The reserve is already full - Try releasing some dragons!", "warning")
                    } else {
                        hatchery.hatcheryEggs[i] = undefined; // remove egg from hatchery.
                        Game.Tooltip.showEmptyTooltip();
                        hatchery.activate();
                    }
                })
            );


            // Egg      
            containerID.append($("<div>")
                .attr("style", "color:" + egg.color)
                .html(egg.elementName + " Egg")
                
            ); 
            // Egg's Hatching Progress
            containerID.append($("<div>")
                .attr("id", "hatching-progress-"+i)
                .html("Hatching Progress: " + Math.round(Math.min(egg.hatchingProgress, 100)) + "%")
                .attr("style", "color:" + egg.color)
            ); 


        }
    },

    updateSlotElements(i, slot) {
        // Update slot temperature.
        slot.currentTemperature = Math.max(slot.currentTemperature + slot.temperatureDrain, hatchery.minimumTemperature);
        // Update egg-related attributes, if slot has egg.
        if (Game.Hatchery.hatcheryEggs[i]) {
            // Show/hide relevant containers
            $("#slot-container-empty-"+i).attr("style", "display: none");
            $("#slot-container-full-"+i).attr("style", "display: block");
            // Update hatchery temperature
            $("#current-temperature-"+i).html("Temperature: " + Math.round(slot.currentTemperature)   + "°C");
            // Update egg-related elements
            const egg = hatchery.hatcheryEggs[i]
            if (!egg.isHatched) {
                // Show relevant elements.
                $("#increase-heat-button-"+i).attr("style", "display: inline-block")
                $("#hatch-egg-"+i).attr("style", "display: none")
                // Update hatching progress.
                egg.updateHatchingProgress(slot.currentTemperature);  
                egg.isHatched = egg.hatchingProgress >= 100; // confirm whether egg has hatched.
                // Update HTML elements.
                $("#hatching-progress-"+i).html("Hatching Progress: " + Math.round(Math.min(egg.hatchingProgress, 100)) + "%");
                $("#is-egg-hatching-"+i).html(egg.getIsEggHatchingText(slot.currentTemperature, egg.hatchingProgress));
            } else {
                // Hide hatching elements when egg has hatched.
                $("#increase-heat-button-"+i).attr("style", "display: none")
                $("#hatch-egg-"+i).attr("style", "display: inline-block")
            }
        } else {
            $("#slot-container-empty-"+i).attr("style", "display: block");
            $("#slot-container-full-"+i).attr("style", "display: none");
            // Show available eggs.
            $.each(Game.Resources.PlayerResources, ( _ , resource) => {
                if (resource.type == "egg") {
                    if (resource.amount >= 1) {
                        $("#egg-select-option-" + resource.element + "-" + i)
                            .attr("style", "display: inline-block; \
                                            color: "+ Game.Elements.allElements[resource.element].color);
                    } else {
                        $("#egg-select-option-" + resource.element + "-" + i)
                            .attr("style", "display: none");
                    }
                }
            });
        }
    }

}