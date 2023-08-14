"use strict"; // execute in strict mode

class HatcherySlot {
    // Slot for hatching eggs in the hatchery.
    constructor() {
        this.currentTemperature = 0;
        this.temperatureIncrementOnClick = 2;
        this.temperatureDrain = -0.1;
    };
};

Game.Hatchery = {
    // Required area variables
    id: "hatchery",
    name: "Hatchery",
    description: "A small cave, protected from the outside elements.",
    isUnlocked: false,
    // Area-specific variables
    numberOfSlots: 0,
    minimumTemperature: 0,
    maximumTemperature: 100,

    HatcheryEggs: [],
    HatcherySlots: [],

    init() {
        Game.AreaHandler.addArea(this);
        for (let i=0; i < this.numberOfSlots; i++) {
            hatchery.addHatcherySlot(new HatcherySlot());
        }

    },

    setup() {  // TO ADD: load area variables from saved data
        
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
        $.each(hatchery.HatcherySlots, (i, slot) => {
            hatchery.loadHatcherySlot(i, slot, hatchery.HatcheryEggs[i]);
        });
    },

    update() {  // update area on game tick.
        $.each(hatchery.HatcherySlots, (i, slot) => {
            // Update slot temperature.
            slot.currentTemperature = Math.max(slot.currentTemperature + slot.temperatureDrain, hatchery.minimumTemperature);
            // Update egg-related attributes, if slot has egg.
            if (Game.Hatchery.HatcheryEggs[i]) {
                // Show/hide relevant containers
                $("#slot-container-empty-"+i).attr("style", "display: none");
                $("#slot-container-full-"+i).attr("style", "display: block");
                // Update hatchery temperature
                $("#current-temperature-"+i).html("Temperature: " + Math.round(slot.currentTemperature)   + "°C");
                // Update egg-related elements
                const egg = hatchery.HatcheryEggs[i]
                if (!egg.isHatched) {
                    // Show relevant elements.
                    $("#increase-heat-button-"+i).attr("style", "display: inline-block")
                    $("#is-egg-hatching-"+i).attr("style", "display: block")
                    $("#hatch-egg-"+i).attr("style", "display: none")
                    // Update hatching progress.
                    egg.updateHatchingProgress(slot.currentTemperature);  
                    egg.isHatched = egg.hatchingProgress >= 100; // confirm whether egg has hatched.
                    // Update HTML elements.
                    $("#hatching-progress-"+i).html("Hatching Progress: " + Math.round(Math.min(egg.hatchingProgress, 100)) + "%");
                    $("#is-egg-hatching-"+i).html(egg.getIsEggHatchingText(slot.currentTemperature));
                } else {
                    // Hide hatching elements when egg has hatched.
                    $("#increase-heat-button-"+i).attr("style", "display: none")
                    $("#is-egg-hatching-"+i).attr("style", "display: none")
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
        }) 
    },

    addHatcherySlot(slot) {
        hatchery.HatcherySlots.push(slot);
        hatchery.HatcheryEggs.push(undefined);
    },

    addEgg(egg, index) {
        hatchery.HatcheryEggs[index] = egg;
    },

    loadHatcherySlot(i, slot, egg) {
        // HTML for all Hatchery Slots
        $("#hatchery-grid").append($("<div>")
            .attr("class", "hatchery-slot")
            .attr("id", "hatchery-slot-"+i)
        );
        const hatcherySlotID = $("#hatchery-slot-"+i);
        hatcherySlotID.append($("<h4>").html("Hatchery Nest")); // Slot Title

        // HTML for Full Hatchery Slots
        hatcherySlotID.append($("<div>")
                                .attr("class", "hatchery-slot-container-full")
                                .attr("id", "hatchery-slot-container-full-"+i));
        const fullSlotContainer = $("#hatchery-slot-container-full-"+i);
        hatchery.loadFullSlotElements(fullSlotContainer, i, slot, egg);
       
        // HTML for empty Hatchery Slots
        hatcherySlotID.append($("<div>")
                            .attr("class", "hatchery-slot-container-empty")
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
        containerID.append($("<p>")
            .html("The slot is empty...<br><br>Select an egg to hatch!<br><br><hr>"));
        // Container for egg options
        containerID.append($("<div>")
            .attr("class", "egg-select-container")
            .attr("id", "egg-select-container-"+i));                        
        const eggSelectContainer = $("#egg-select-container-"+i);
        // Create clickable option for each egg type
        $.each(Game.Resources.PlayerResources, ( resourceID , resource) => {
            if (resource.type == "egg") {
                eggSelectContainer.append($("<a>")
                    .attr("class", "egg-select-option")
                    .attr("id", "egg-select-option-"+resource.element+"-"+i)
                    .attr("style", "color: " + Game.Elements.allElements[resource.element].color)
                    .attr("href", "javascript:;")
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
                        hatchery.HatcheryEggs[i] = new Egg(resource.element);
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
            containerID.append($("<p>")
                .attr("id", "current-temperature-"+i)
                .html("Temperature: " + Math.round(slot.currentTemperature) + "°C")
            );                  
            // Egg      
            containerID.append($("<p>")
                .html("Egg (" + egg.elementName + ")")
                .attr("style", "color:" + egg.color)
            ); 
            // Egg's Hatching Progress
            containerID.append($("<p>")
                .attr("id", "hatching-progress-"+i)
                .html("Hatching Progress: " + Math.round(Math.min(egg.hatchingProgress, 100)) + "%")
                .attr("style", "color:" + egg.color)
            ); 
            // Increase Temperature Button
            containerID.append($("<button>")
                .attr("class", "button small")
                .attr("id", "increase-heat-button-"+i)
                .attr("style", "display: inline-block")
                .html("Stoke the flames...")
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
            // Hatching Description Text
            containerID.append($("<p>")
                .attr("id", "is-egg-hatching-"+i)
                .html(egg.getIsEggHatchingText(slot.currentTemperature))
            );
            // Hatch Egg Button
            containerID.append($("<button>")
                .attr("class", "button small")
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
                        hatchery.HatcheryEggs[i] = undefined; // remove egg from hatchery.
                        Game.Tooltip.showEmptyTooltip();
                        hatchery.activate();
                    }
                })
            );
        }
    }

}