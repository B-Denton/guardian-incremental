"use strict"; // execute in strict mode

Game.Explore = {
    // Required area variables
    id: "explore",
    name: "Explore",
    description: "It's time to venture further into the island.",
    isUnlocked: false,
    // Area-specific variables
    maximumEnemies: 6,
    maximumRounds: 10,
    roundTimer: 200,
    inEncounter: false,
    currentAreaID: undefined,
    currentEncounter: undefined,
    encounterStarted: false,
    currentStrategy: undefined,
    

    init() {
        Game.AreaHandler.addArea(this);
    },

    setup() {  // load area variables from saved data

        if (testing) {
            explore.isUnlocked = true;
        }
        
    },

    activate() {  // load area when selected from nav bar.
        const areaContent = $("#area-content");
        areaContent.empty();

        this.createAreaSelectElements(areaContent);
        this.createEncounterElements(areaContent);

        if (this.inEncounter) {
            $("#encounter-container").attr("style", "display: block");
            $("#explore-area-select-container").attr("style", "display: none");
            this.currentStrategy = undefined;
            this.loadEncounter(this.currentEncounter)
        } else {
            $("#explore-area-select-container").attr("style", "display: block");
            $("#encounter-container").attr("style", "display: none");
        }


    },

    update() {

    },

    createAreaSelectElements(areaContent) {

        function createAreaSelectButton(areaID) {
            // Helper function for generating buttons for selecting an Explore area
            var areaInformation = Game.ExploreData[areaID]["area"];

            if (areaInformation["isBeaten"]) {
                const exploreButton = $("<button>")
                .attr("class", "explore button area-beaten")
                .attr("id", "explore-button-" + areaID)
                .prop("disabled", true)
                .html("Explore the " + areaInformation.areaName)
                .hover(
                    function() { // Handler In
                        Game.Tooltip.showBasicDescription("This area has been fully explored!");
                    },
                    function() { // Handler Out
                        Game.Tooltip.showEmptyTooltip();   
                    }
                )
                return exploreButton;
            } else {
                const exploreButton = $("<button>")
                .attr("class", "explore button")
                .attr("id", "explore-button-" + areaID)
                .html("Explore the " + areaInformation.areaName)
                .hover(
                    function() { // Handler In
                        Game.Tooltip.showExploreAreaTooltip(areaID);
                    },
                    function() { // Handler Out
                        Game.Tooltip.showEmptyTooltip();   
                    }
                )
                .on("click", function() {
                    Game.Tooltip.showEmptyTooltip();
                    Game.Explore.loadNextEncounter(areaID);
                });
                return exploreButton;
            }

            
        }

        areaContent.append($("<div>")
            .attr("id", "explore-area-select-container")  
        );
        const containerID = $("#explore-area-select-container");
        containerID.empty();

        containerID.append($("<div>")      
            .attr("class", "area-description")
            .html(explore.description)
        );

        $.each(Game.ExploreData, (areaID, _ ) => {
            containerID.append(createAreaSelectButton(areaID));
        });

    },

    createEncounterElements(areaContent) {
        // Create elements needed for encounter area.
        areaContent.append($("<div>")
            .attr("id", "encounter-container")
        );

        $("#encounter-container").append($("<div>")
            .attr("id", "encounter-description")
        );

        // Exit Encounter Button
        $("#encounter-container").append($("<div>")
            .attr("class", "explore button")
            .attr("id", "area-return-button")
            .html("Exit Area")
            .on("click", function() {
                Game.Explore.inEncounter = false;
                Game.Explore.currentEncounter = undefined;
                $("#encounter-container").attr("style", "display: none");
                $("#explore-area-select-container").attr("style", "display: block");
            })
        );

        // Encounter Grid UI
        $("#encounter-container").append($("<div>")
            .attr("id", "encounter-grid")
        );
        const containerID = $("#encounter-grid");
        containerID.empty();

        // Left: Team Roster
        containerID.append($("<div>")
            .attr("class", "encounter col")
            .attr("id", "encounter-left")
        );

        $.each(Game.Roster.rosterDragons, (i, _) => {
            $("#encounter-left").append($("<div>")
                .attr("class", "encounter-slot team")
                .attr("id", "encounter-roster-slot-"+i)
            );
            const rosterItems = ["name", "attack", "level", "defense", "hp", "speed"]
            $.each(rosterItems, ( _ , item) => {
                $("#encounter-roster-slot-"+i).append($("<div>")
                    .attr("class", "encounter-slot-item roster " + item)
                    .attr("id", "encounter-roster-slot-" + i + "-" + item)
                );
            });
        })

        // Center: Battle Statistics, Strategy Options and Encounter Log
        containerID.append($("<div>")
            .attr("class", "encounter col")
            .attr("id", "encounter-center")
        );

        $("#encounter-center").append($("<div>")
            .attr("id", "encounter-in-progress")
        );

        $("#encounter-center").append($("<div>")
            .attr("id", "encounter-setup")
        );

        // Encounter Set-up:

        $("#encounter-setup").append($("<div>")
            .attr("class", "title")
            .attr("style", "padding-top: 20px; text-align: center; font-weight: bold;")
            .html("Battle Overview:")
        );

        $("#encounter-setup").append($("<div>")
            .attr("id", "encounter-stats-roster")
        );

        $("#encounter-setup").append($("<div>")
            .attr("id", "encounter-stats-enemy")
        );

        $("#encounter-setup").append($("<div>")
            .attr("class", "title")
            .attr("style", "padding-top: 20px; text-align: center; font-weight: bold;")
            .html("Select a strategy")
        );

        $("#encounter-setup").append($("<div>")
            .attr("id", "encounter-strategy-options")
        );

        $("#encounter-setup").append($("<div>")
        .attr("style", "text-align: center;")
        .html("Rounds until exhaustion: " + explore.maximumRounds)
    );

        $("#encounter-setup").append($("<div>")
            .attr("class","explore button")
            .attr("id", "start-encounter-button")
            .html("Start Encounter!")
            .on("click", function() {
                if (explore.currentStrategy) {
                    // Check there are dragons on team
                    if (!(roster.rosterDragons.every((dragon) => dragon == undefined))) {
                        // Check some dragons have health
                        var healthyDragons = roster.rosterDragons.filter(function(dragon) {
                            return dragon != undefined && dragon.hp.value > 0;
                        }); 
                        if (healthyDragons.length > 0) {
                            explore.startEncounter(explore.currentEncounter);
                        } else {
                            log.addNotification("Your dragons are too hurt to explore!", "warning")
                        }
                        
                    } else {
                        log.addNotification("You need dragons on your team to face encounters. Go to the Reserve to recruit some!", "warning")
                    }
                } else {
                    log.addNotification("You'll need to pick a strategy before facing this encounter.", "warning")
                }

            })
        );

        // Encounter in progress

        $("#encounter-in-progress").append($("<div>")
            .attr("id", "encounter-log")
        );

        $("#encounter-in-progress").append($("<div>")
            .attr("class", "explore button")
            .attr("id", "leave-encounter-button")
            .html("Retry Encounter")
            .on("click", function() {
                explore.loadNextEncounter(explore.currentAreaID); 
                $("#leave-encounter-button").attr("style", "display: none");
                $("#next-encounter-button").attr("style", "display: none");
            })
        );

        $("#encounter-in-progress").append($("<div>")
            .attr("class", "explore button")
            .attr("id", "next-encounter-button")
            .html("Continue Exploring")
            .on("click", function() {
                explore.loadNextEncounter(explore.currentAreaID); 
                $("#leave-encounter-button").attr("style", "display: none");
                $("#next-encounter-button").attr("style", "display: none");
            })
        );

        // Right: Enemy Roster
        containerID.append($("<div>")
            .attr("class", "encounter col")
            .attr("id", "encounter-right")
        );

        for (let i = 0; i < this.maximumEnemies; i++) {
            $("#encounter-right").append($("<div>")
                .attr("class", "encounter-slot enemy")
                .attr("id", "encounter-enemy-slot-"+i)
            );
            const enemyItems = ["name", "attack", "hp", "defense", "spare", "speed"]
            $.each(enemyItems, ( _ , item) => {
                $("#encounter-enemy-slot-"+i).append($("<div>")
                    .attr("class", "encounter-slot-item enemy " + item )
                    .attr("id", "encounter-enemy-slot-" + i + "-" + item)
                );
            });
        }
        
    },

    loadEncounter(encounter) {
        // Loads up-to-date information into the encounter elements.
        // Encounter Description
        $("#encounter-description").html(encounter.encounterDescription);
        // Roster Details
        Game.Explore.updateTeam();
        // Central Details

        // Team Overview
        explore.updateTeamOverview()

        // Enemy Overview
        var enemyTeamSize = explore.currentEncounter["enemies"].filter(function(value) { return value !== undefined }).length;
        var totalAttack = 0;
        var averageDefense = 0;
        var averageSpeed = 0;
        if (enemyTeamSize > 0) {      
            $.each(explore.currentEncounter["enemies"], (index, enemy) => {
                if (enemy) {
                    totalAttack += enemy.attack.value;
                    averageDefense += enemy.defense.value;
                    averageSpeed += enemy.speed.value;
                }
            });
            averageDefense = averageDefense / enemyTeamSize;
            averageSpeed = averageSpeed / enemyTeamSize;
        };

        var hasDefeatedAll = explore.currentEncounter["enemies"].every((enemy) => Game.Enemies[enemy.id].hasDefeated);
        var hasFacedEncounter = explore.currentEncounter.encounterFaced;

        if (hasDefeatedAll || hasFacedEncounter) {
            $("#encounter-stats-enemy").html(
                "Total Attack:  "   + totalAttack + 
                "<br>                                   \
                 Avg. Defense:  "   + averageDefense +
                "<br>                                   \
                 Avg. Speed:  "     + averageSpeed
            );
        } else {
            $("#encounter-stats-enemy").html(
                "Total Attack: ???                      \
                 <br>                                   \
                 Avg. Defense: ???                      \
                 <br>                                   \
                 Avg. Speed: ??? "
            );    
        }

        // Strategy Options

        function createStrategyOption(strategy) {
            // Helper function for generating buttons for selecting a strategy
            const strategyButton = $("<button>")
                .attr("class", "strategy button")
                .attr("id", "strategy-button-" + strategy.id)
                .html(strategy.name)
                .hover(
                    function() { // Handler In
                        Game.Tooltip.showStrategyTooltip(strategy);
                    },
                    function() { // Handler Out
                        Game.Tooltip.showEmptyTooltip();   
                    }
                )
                .on("click", function() {
                    explore.currentStrategy = strategy; 
                    Game.Tooltip.showEmptyTooltip();
                    // Visually unselect other strategies
                    for (var i =0; i < strategyButtonList.length; i++) {
                        strategyButtonList[i].classList.remove('selected')
                    }
                    // Visually select this strategy
                    this.classList.add('selected');
                    explore.updateTeamOverview()           
                });
            return strategyButton;
        }



        // Make a list of available battle strategies.
        var strategyOptions = [];
        if (explore.currentEncounter["standardStrategyAvailable"]) {
            $.each(Game.Strategies, ( _ , strategy) => {
                if (strategy.isAvailable()) {
                    strategyOptions.push(strategy);
                };
            });
        }

        // Create select buttons for the available strategies.
        $("#encounter-strategy-options").empty();
        $.each(strategyOptions, (i, strategy) => {
            $("#encounter-strategy-options").append(createStrategyOption(strategy))
        })
        var strategyButtonList = document.getElementsByClassName("strategy button");

        // Enemy Details
        for (let i = 0; i < this.maximumEnemies; i++) {
            var enemy = explore.currentEncounter["enemies"][i];
            if (enemy) {
                $("#encounter-enemy-slot-"+i)[0].classList.remove('empty');
                $("#encounter-enemy-slot-"+i)[0].classList.add('filled');
                // Update Roster values for current enemy.
                $("#encounter-enemy-slot-" + i).attr("style", "color: " + enemy["color"] + ";")
                $("#encounter-enemy-slot-" + i + "-name").html(enemy.name)
                if (Game.Enemies[enemy.id].hasDefeated || hasFacedEncounter) {
                    $("#encounter-enemy-slot-" + i + "-hp").html("HP: " + Math.max(0, enemy.hp.value) + " / " + enemy.hp.max);
                    $("#encounter-enemy-slot-" + i + "-attack").html("Attack: " + enemy.attack.value);
                    $("#encounter-enemy-slot-" + i + "-defense").html("Defense: " + enemy.defense.value);
                    $("#encounter-enemy-slot-" + i + "-speed").html("Speed: " + enemy.speed.value);
                } else {
                    $("#encounter-enemy-slot-" + i + "-hp").html("HP: " + Math.max(0, enemy.hp.value) + " / " + enemy.hp.max);
                    $("#encounter-enemy-slot-" + i + "-attack").html("???")
                    $("#encounter-enemy-slot-" + i + "-defense").html("")
                    $("#encounter-enemy-slot-" + i + "-speed").html("")
                }

            } else {
                // Reset elements if no enemy in slot.
                $("#encounter-enemy-slot-" + i)[0].classList.remove('filled');
                $("#encounter-enemy-slot-" + i)[0].classList.add('empty');
                $("#encounter-enemy-slot-" + i).html("")
                $("#encounter-enemy-slot-" + i).attr("style", "color: var(--dark);")
                $("#encounter-enemy-slot-" + i + "-name").empty()
                $("#encounter-enemy-slot-" + i + "-hp").empty()
                $("#encounter-enemy-slot-" + i + "-attack").empty()
                $("#encounter-enemy-slot-" + i + "-defense").empty()
                $("#encounter-enemy-slot-" + i + "-speed").empty()
            }      
        };

        if (explore.encounterStarted) {
            $("#encounter-in-progress").attr("style", "display: block");
            $("#encounter-setup").attr("style", "display: none");
        } else {
            $("#encounter-in-progress").attr("style", "display: none");
            $("#encounter-setup").attr("style", "display: block");
        }
    },

    startEncounter(encounter) {
        explore.encounterStarted = true;

        var rosterTeam = roster.rosterDragons;
        rosterTeam = rosterTeam.filter(function(creature) {
            return creature !== undefined;
        });


        var enemyTeam = encounter.enemies;
        enemyTeam = enemyTeam.filter(function(creature) {
            return creature !== undefined;
        });

        var encounterWon = false;
        var encounterLost = false;

        function createTurnOrder() {

            // Helper functions for creating the turn order each round.
            function findFastest() {
                var topSpeed = -Infinity;
                var fastestCreaturesIndex = []
                $.each(unsortedTurnOrder, (i, creature) => {
                    if (creature.type == "dragon") {
                        var creatureSpeed = creature.speed.value * explore.currentStrategy.effect.speed;
                    } else {
                        var creatureSpeed = creature.speed.value;
                    }

                    if (creatureSpeed == topSpeed) {
                        fastestCreaturesIndex.push(i)
                    } else if (creatureSpeed > topSpeed) {
                        fastestCreaturesIndex = [i];
                        topSpeed = creatureSpeed;
                    }
                });
                return fastestCreaturesIndex;
            }

            function shuffleArray(arr) {
                // Credit: grauw.nl
                for (var i = arr.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }

            // Combine teams for processing
            var unsortedTurnOrder = rosterTeam.concat(enemyTeam);
            var isSorted = false;
            var sortedTurnOrder = [];
            // Remove 'dead' creatures.
            unsortedTurnOrder = unsortedTurnOrder.filter(function(creature) {
                return creature.hp.value > 0;
            });  
            // Find fastest remaining creatures, until all creatures have been sorted.
            while (!isSorted) {
                // Get indices of creatures with fastest speeds.
                var fastestCreaturesIndex = findFastest();
                // Move fastest creatures to a separate array for shuffling,
                // working in reverse to preserve indexing.
                var fastestCreatures = []
                for (let i = fastestCreaturesIndex.length - 1; i >= 0; i--) {
                    fastestCreatures.push(unsortedTurnOrder.splice(fastestCreaturesIndex[i], 1)[0]);
                }
                // Shuffle order of creatures with equal speeds.
                shuffleArray(fastestCreatures);
                // Add creatures to turn order.
                $.each(fastestCreatures, ( _ , creature) => {
                    sortedTurnOrder.push(creature)
                })
                // Check if sorting is finished.
                isSorted = (unsortedTurnOrder.length == 0);             
            }
            return sortedTurnOrder;
        }

        function makeAttack(creature, isDragon) {
            // Establish which team to attack.
            if (isDragon) {
                var targetTeam = enemyTeam;
            } else {
                var targetTeam = rosterTeam;
            }
            // Remove dead creatures from possible targets.
            targetTeam = targetTeam.filter(function(creature) {
                return creature.hp.value > 0;
            }); 
            // Select creature to attack.
            var targetCreatureIndex = Math.floor(Math.random() * targetTeam.length);
            // Apply strategy differences
            var strategyEffects = explore.currentStrategy.effect;
            if (isDragon) {
                var damageDealt = Math.ceil((creature.attack.value * strategyEffects.attack) / (targetTeam[targetCreatureIndex].defense.value + 100 / 100))
            } else {
                var damageDealt = Math.ceil(creature.attack.value / ( (targetTeam[targetCreatureIndex].defense.value * strategyEffects.defense) + 100 / 100))
            }
            targetTeam[targetCreatureIndex].hp.value -= damageDealt; 
            // Log the attack
            $("#encounter-log").prepend($("<div>")
                .attr("class", "notification-message encounter none")
                .html(creature.name + " hits " + targetTeam[targetCreatureIndex].name + " for " + damageDealt + " HP!")
            );
        }

        function checkIsEncounterWon() {
            return enemyTeam.every((creature) => creature.hp.value <= 0);
        }

        function checkIsEncounterLost() {
            return rosterTeam.every((dragon) => dragon.hp.value <= 0)
        }

        function runEncounter(round) {
            // Allow player to watch the fight play out.
            setTimeout(function() {
                // Confirm both sides have surviving creatures.
                encounterWon = checkIsEncounterWon()
                encounterLost = checkIsEncounterLost()
                // Confirm both sides are playing with a valid team, for robustness.
                if (rosterTeam.length <= 0) {
                    encounterLost = true;
                }
                if (enemyTeam.length <= 0) {
                    encounterWon = true;
                }
                // Check whether encounter is over.
                if ((!encounterWon) && (!encounterLost)) {
                    // Announce start of round
                    $("#encounter-log").prepend($("<div>")
                        .attr("class", "notification-message encounter none")
                        .attr("style", "font-weight: bold; ; font-size: var(--font-size-medium);")
                        .html("Round " + round)
                    );
                    // Process encounter special effects at start of round.
                    encounter.startOfRound(rosterTeam, enemyTeam);
                    // Create turn order.
                    var turnOrder = createTurnOrder();
                    // Play turns
                    $.each(turnOrder, (i, creature) => {
                        var isDragon = creature["type"] == "dragon";
                        makeAttack(creature, isDragon);
                        encounterWon = checkIsEncounterWon();
                        encounterLost = checkIsEncounterLost();
                        if (encounterWon || encounterLost) {
                            $("#encounter-log").prepend($("<div>")
                                .attr("class", "notification-message encounter none")
                                .html("<hr><br>Calculating outcome....")
                            );
                            return false;
                        }
                    });
                    // Add visual aid to log to differentiate between rounds.
                    $("#encounter-log").prepend($("<div>")
                        .attr("class", "notification-message encounter none")
                        .attr("style", "font-weight: bold; font-size: var(--font-size-medium);")
                        .html("<hr>")
                    );
                    // Update encounter-based information on page.
                    explore.loadEncounter(encounter);
                } else {
                    // End encounter prematurely if it has been won or lost.
                    return false;
                }          
            }, explore.roundTimer * round);
        }

        // Fight automatically stops after maximum number of rounds.
        for (let round = 1; round <= explore.maximumRounds; round++) {
            runEncounter(round);
        };

        // wait until battle has concluded to validate board-state.
        setTimeout(function() {
            encounterWon = checkIsEncounterWon()
            encounterLost = checkIsEncounterLost()
            if (encounterWon) {
                explore.winEncounter();
                return false;
            } else {
                explore.loseEncounter()
                return false;
            }
        }, explore.roundTimer * (explore.maximumRounds+0.01));
    },

    winEncounter() {
        // Announce encounter outcome
        $("#encounter-log").prepend($("<div>")
            .attr("class", "notification-message encounter none")
            .attr("style", "font-weight: bold;")
            .html("You win!  <br><br><hr>")
        );
        // Distribute experience among dragons.
        explore.distributeXP(explore.currentEncounter["enemies"]);
        // Update area Information
        Game.ExploreData[Game.Explore.currentAreaID]["encounters"][Game.Explore.currentEncounter.encounterID]["encounterFaced"] = true;
        Game.ExploreData[Game.Explore.currentAreaID]["encounters"][Game.Explore.currentEncounter.encounterID]["encounterBeaten"] = true;
        if (Game.ExploreData[Game.Explore.currentAreaID]["area"]["lastEncounter"] == Game.Explore.currentEncounter.encounterID) {
            Game.ExploreData[Game.Explore.currentAreaID]["area"]["isBeaten"] = true;
        }
        // Update creature Information
        $.each(explore.currentEncounter["enemies"], ( _ , enemy) => {
            Game.Enemies[enemy.id].hasDefeated = true;
        })
        // Reset variables
        explore.currentEncounter = undefined;
        explore.encounterStarted = false;
        explore.inEncounter = false;
        // Update left-hand roster
        $.each(Game.Roster.rosterDragons, (i, dragon) => {
            Game.Roster.updateRosterSlot(i, dragon)
        });
        // Show Button to load next encounter in area.
        $("#next-encounter-button").attr("style", "display: block");
    },

    loseEncounter() {    
        $("#encounter-log").prepend($("<div>")
            .attr("class", "notification-message encounter none")
            .attr("style", "font-weight: bold;")
            .html("The encounter proved too difficult for your dragons. <br><br><hr>")
        );
        // Update area information
        explore.currentEncounter["encounterFaced"] = true;
        Game.ExploreData[Game.Explore.currentAreaID]["encounters"][Game.Explore.currentEncounter.encounterID]["encounterFaced"] = true;
        // Reload encounter
        $.each(explore.currentEncounter["enemies"], (i, enemy) => {
            explore.currentEncounter["enemies"][i] = new Enemy(Game.Enemies[enemy.id], enemy.name);
        })
        // Reset variables
        explore.encounterStarted = false;
        explore.inEncounter = false;
        // Update left-hand roster
        $.each(Game.Roster.rosterDragons, (i, dragon) => {
            Game.Roster.updateRosterSlot(i, dragon)
        });
        // Show Reset Button
        $("#leave-encounter-button").attr("style", "display: block");
    },

    loadNextEncounter(areaID) {
        var areaInformation = Game.ExploreData[areaID]["area"]
        // Load Next Encounter in area
        for (let i = 1; i <= areaInformation.lastEncounter; i++) {
            if (!Game.ExploreData[areaID]["encounters"][i]["encounterBeaten"]) {
                explore.inEncounter = true;
                explore.currentAreaID = areaInformation.areaID;
                explore.currentEncounter = Game.ExploreData[areaID]["encounters"][i];
                explore.activate();
                $("#encounter-container").attr("style", "display: block");
                $("#explore-area-select-container").attr("style", "display: none");
                return false;
            }
        }
        // If no valid encounter, return to explore 'Select Area' menu.
        explore.inEncounter = false;
        explore.currentAreaID = undefined;
        explore.currentEncounter = undefined;
        explore.activate();
        $("#encounter-container").attr("style", "display: none");
        $("#explore-area-select-container").attr("style", "display: block");
    },

    updateTeamOverview() {
        var teamSize = Game.Roster.rosterDragons.filter(function(value) { return value !== undefined }).length;
        var totalAttack = 0;
        var averageDefense = 0;
        var averageSpeed = 0;
        if (teamSize > 0) {      
            $.each(Game.Roster.rosterDragons, (index, dragon) => {
                if (dragon) {
                    totalAttack += dragon.attack.value;
                    averageDefense += dragon.defense.value;
                    averageSpeed += dragon.speed.value;
                }
                if (explore.currentStrategy) {
                    totalAttack *= explore.currentStrategy.effect.attack
                    averageDefense *= explore.currentStrategy.effect.defense
                    averageSpeed *= explore.currentStrategy.effect.speed
                }
            });
            totalAttack = Decimal(totalAttack).toSignificantDigits(2)
            averageDefense = Decimal(averageDefense / teamSize).toSignificantDigits(2);
            averageSpeed = Decimal(averageSpeed / teamSize).toSignificantDigits(2);
        };

        $("#encounter-stats-roster").html(
            "Total Attack:  "   + totalAttack + 
            "<br>                                   \
             Avg. Defense:  "   + averageDefense +
            "<br>                                   \
             Avg. Speed:  "     + averageSpeed
        );
    },

    updateTeam() {
        $.each(Game.Roster.rosterDragons, (i, dragon) => {
            if (dragon) {
                $("#encounter-roster-slot-"+i)[0].classList.remove('empty');
                $("#encounter-roster-slot-"+i)[0].classList.add('filled');
                // Update Roster values for current dragon.
                $("#encounter-roster-slot-" + i).attr("style", "color: " + Game.Elements.allElements[dragon.element].color + ";");
                $("#encounter-roster-slot-" + i + "-name").html(dragon.name);
                $("#encounter-roster-slot-" + i + "-level").html("Level: " + dragon.level);
                $("#encounter-roster-slot-" + i + "-hp").html("HP: " + Math.max(0, dragon.hp.value) + " / " + dragon.hp.max);
                $("#encounter-roster-slot-" + i + "-attack").html("Attack: " + dragon.attack.value);
                $("#encounter-roster-slot-" + i + "-defense").html("Defense: " + dragon.defense.value);
                $("#encounter-roster-slot-" + i + "-speed").html("Speed: " + dragon.speed.value);
            } else {
                $("#encounter-roster-slot-"+i)[0].classList.remove('filled');
                $("#encounter-roster-slot-"+i)[0].classList.add('empty');
                // Reset elements if no dragon in slot.
                $("#encounter-roster-slot-"+i).html("")
                $("#encounter-roster-slot-" + i).attr("style", "color: var(--dark);")
                $("#encounter-roster-slot-" + i + "-name").empty()
                $("#encounter-roster-slot-" + i + "-level").empty()
                $("#encounter-roster-slot-" + i + "-hp").empty()
                $("#encounter-roster-slot-" + i + "-attack").empty()
                $("#encounter-roster-slot-" + i + "-defense").empty()
                $("#encounter-roster-slot-" + i + "-speed").empty()
            }      
        });
    },

    distributeXP(enemyTeam) {
        // Find indices of dragons which survived the encounter.
        var healthyDragonsIndices = roster.rosterDragons.map(
            (dragon, i) => 
            (dragon != undefined && dragon.hp.value > 0) ? i : '' )
            .filter(String)
        // Find indices of dragons which are on the team, but have no health.
        var woundedDragonsIndices = roster.rosterDragons.map(
            (dragon, i) => 
            (dragon != undefined && dragon.hp.value <= 0) ? i : '' )
            .filter(String)
        // Format wounded dragon names based on number.
        var woundedDragonNames = ""
        $.each(woundedDragonsIndices, (i , dragonIndex) => {
            if (woundedDragonsIndices.length > 1) {
                if (i == woundedDragonsIndices.length-1) {
                    woundedDragonNames += "and " + roster.rosterDragons[dragonIndex].name + " were ";
                } else {
                    woundedDragonNames += roster.rosterDragons[dragonIndex].name + ", "
                } 
            } else {
                woundedDragonNames += roster.rosterDragons[dragonIndex].name + " was "
            }
        });
        // Notify player of which dragons didn't gain experience.
        if (woundedDragonNames != "") {
            $("#encounter-log").prepend($("<div>")
                .attr("class", "notification-message encounter none")
                .html(woundedDragonNames + " too hurt to gain experience. <br><br><hr>")
            );
        }     

        // Experience Distribution:
        // Calculate total experience the enemies give.
        var totalXPGained = 0;
        $.each(enemyTeam, ( _ , enemy) => {
            totalXPGained += Game.Enemies[enemy.id].xp;
        });        
        // Distribute XP among healthy dragons, and notify player.
        var perDragonXPGained = Math.floor(totalXPGained / healthyDragonsIndices.length);
        $.each(healthyDragonsIndices, ( _ , dragonIndex) => {
            // Process XP gains
            $("#encounter-log").prepend($("<div>")
                .attr("class", "notification-message encounter none")
                .html(roster.rosterDragons[dragonIndex].name + " gained " + perDragonXPGained + " Experience Points.")
            );
            roster.rosterDragons[dragonIndex].xp += perDragonXPGained;
            // Check for dragon level-ups;
            if (roster.rosterDragons[dragonIndex].checkLevelUp()) {
                roster.rosterDragons[dragonIndex].levelUp();
                $("#encounter-log").prepend($("<div>")
                    .attr("class", "notification-message encounter none")
                    .attr("style", "font-weight: bold;")
                    .html(roster.rosterDragons[dragonIndex].name + " levelled up! They are now Level " + roster.rosterDragons[dragonIndex].level + "!")
                );
                Game.Explore.updateTeam();
            }
        });
        // Line Break
        if (healthyDragonsIndices.length > 0) {
            $("#encounter-log").prepend($("<div>")
                .attr("class", "notification-message encounter none")
                .html("<hr>")
            );
        }
    }
}