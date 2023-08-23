"use strict"; // execute in strict mode

Game.Roster = {

    numberOfSlots: 6,
    rosterDragons: [],

    init() {
        for (let i=0; i < this.numberOfSlots; i++) {
            this.rosterDragons[i] = undefined;
        };
        this.loadRosterElements();
    },

    setup() {  // load values from saved data.
        
    },

    update() {  // update on game tick.

    },

    loadRosterElements() {

        var teamDragonsCount = this.rosterDragons.filter(function(value) { return value !== undefined }).length;

        const rosterID = $("#roster")
        rosterID.empty();
        rosterID.append($("<div>")
            .attr("id", "left-roster-title")
            .html("Team (" + teamDragonsCount + " / " + this.numberOfSlots + ")"));
        rosterID.append($("<div>").attr("id", "roster-container"))

        $.each(this.rosterDragons, (i, dragon) => {
            this.createRosterSlot(i, dragon);
            this.updateRosterSlot(i, dragon)
        })

    },

    loadDragonsFromSave(dragonData) {
        Game.Roster.numberOfSlots = dragonData.numberOfSlots;
        var team = dragonData.dragons;
        $.each(team, (i, oldDragon) => {
            if (oldDragon != undefined) {
                var newDragon = new Dragon(oldDragon.element);
                for (var key in oldDragon) {
                    newDragon[key] = oldDragon[key];
                };
                this.updateRosterSlot(i, newDragon);
            } else {
                this.updateRosterSlot(i, undefined);
            }
        });
    },

    createRosterSlot(i, dragon) {
        $("#roster-container").append($("<div>")
            .attr("class", "left-roster-slot")
            .attr("id", "left-roster-slot-"+i)
        );
   
        $("#left-roster-slot-"+i).append($("<div>")
            .attr("class", "left-roster-slot-items")
            .attr("id", "left-roster-slot-items-"+i)
            .hover(
                function() { // Handler In
                    if (dragon) {
                        Game.Tooltip.showDragonSlotTooltip(dragon);
                    }
                },
                function() { // Handler Out
                    Game.Tooltip.showEmptyTooltip();   
                }
            ));

        const rosterItems = ["name", "hp", "level", "xp"]
        $.each(rosterItems, ( _ , item) => {
            $("#left-roster-slot-items-"+i).append($("<div>")
                .attr("class", "left-roster-slot-item " + item)
                .attr("id", "left-roster-slot-" + i + "-" + item)
            );
        })

        $("#left-roster-slot-"+i).append($("<div>")
            .attr("class", "return-to-garden button")
            .attr("id", "return-to-garden-"+i)
            .html("X")
            .hover(
                function() { // Handler In
                    Game.Tooltip.showBasicDescription("Return this dragon to the Reserve.");
                },
                function() { // Handler Out
                    Game.Tooltip.showEmptyTooltip();   
                }
            )
            .on("click", function callback() {
                var isReserveFull = Game.Reserve.addDragon(Game.Roster.rosterDragons[i]);
                if (isReserveFull != -1) {
                    Game.Tooltip.showEmptyTooltip(); 
                    Game.Reserve.activate();
                    Game.Roster.rosterDragons[i] = undefined;
                    Game.Roster.updateRosterSlot(i, undefined);
                } else {
                    Game.Log.addNotification("Your reserve is already full - Try releasing some dragons!", "warning");
                }  
            })
        );
    },

    updateRosterSlot(i, dragon) {
        if (dragon != undefined) {
            $("#left-roster-slot-"+i)[0].classList.remove('empty');
            $("#left-roster-slot-"+i)[0].classList.add('filled');
            $("#return-to-garden-"+i).attr("style", "display: inline");
            var dragonColor = Game.Elements.allElements[dragon.element].color
            $("#left-roster-slot-" + i).attr("style", "color: " + dragonColor + "; border: 1px " + dragonColor + " solid;");
            $("#left-roster-slot-" + i + "-name").attr("style", "font-weight: bold;").html(dragon.name);
            $("#left-roster-slot-" + i + "-level").html("Level: " + dragon.level);
            $("#left-roster-slot-" + i + "-hp").html("HP: " + Math.max(0, dragon.hp.value) + " / " + dragon.hp.max);
            $("#left-roster-slot-" + i + "-xp").html("XP: " + dragon.xp + " / " + dragon.experienceNeeded(dragon.level));

        } else {
            $("#left-roster-slot-"+i)[0].classList.remove('filled');
            $("#left-roster-slot-"+i)[0].classList.add('empty');
            $("#return-to-garden-"+i).attr("style", "display: none");
            $("#left-roster-slot-" + i).attr("style", "color: var(--dark); border: 1px var(--main-color-2) dashed;");
            $("#left-roster-slot-" + i + "-name").html("");
            $("#left-roster-slot-" + i + "-level").html("");
            $("#left-roster-slot-" + i + "-hp").html("");
            $("#left-roster-slot-" + i + "-xp").html("");
        }
    },

    addDragon(dragon) {
        // add dragon to roster, or return -1 if roster is full.
        const index = this.rosterDragons.indexOf(undefined)
        if (index != -1) {
            this.rosterDragons[index] = dragon;
            this.loadRosterElements();
        } 
        return index;

    }

};

