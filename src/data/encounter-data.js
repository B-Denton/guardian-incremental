"use strict"; // execute in strict mode

class Enemy {
    constructor(enemy, name) {
        this.id = enemy.id;
        this.name = name;
        this.type = "enemy";
        this.color = enemy.color
        this.generateAttributes(enemy);
    }

    generateAttributes(enemy) {
        this.hp = {"id": "hp", "name": "Health", "max": enemy.hp, "value": enemy.hp};
        this.attack = {"id": "attack", "name": "Attack", "max": enemy.attack, "value": enemy.attack};
        this.defense = {"id": "defense", "name": "Defense", "max": enemy.defense, "value": enemy.defense};
        this.speed = {"id": "speed", "name": "Speed", "max": enemy.speed, "value": enemy.speed};
    }

}

Game.EnemyData = {
   
    "bear": {
        "id": "bear",
        "name": "Bear",
        "color": "black",
        "hp": 30,
        "attack": 5,
        "defense": 3,
        "speed": 1,
        "xp": 100,
    },

    "fallenTree": {
        "id": "fallenTree",
        "name": "Fallen Tree",
        "color": "black",
        "hp": 100,
        "attack": 0,
        "defense": 2,
        "speed": 0,
        "xp": 150,
    },

    "wolf": {
        "id": "wolf",
        "name": "Wolf",
        "color": "black",
        "hp": 20,
        "attack": 3,
        "defense": 2,
        "speed": 2,
        "xp": 50,
    }

},

Game.Strategies = {
    "ambush": {
        "id": "ambush",
        "name": "Ambush",
        "description": "Rush in to get the first hit!",
        "effectDescription": "<hr> ↑↑ &nbsp;&nbsp; Speed <hr> ↓↓ &nbsp;&nbsp; Defense <hr>",
        "effect": {
            "attack": 0.9,
            "defense": 1,
            "speed": 1.1,
            "other": undefined
        },
        isAvailable: (roster) => {
            return true
        }
    },

    "brawl": {
        "id": "brawl",
        "name": "Brawl",
        "description": "An all out attack that throws caution to the wind!",
        "effectDescription": "<hr> ↑↑ &nbsp;&nbsp; Attack <hr> ↓↓ &nbsp;&nbsp; Defense <hr>",
        "effect": {
            "attack": 1.1,
            "defense": 0.9,
            "speed": 1,
            "other": undefined
        },
        isAvailable: (roster) => {
            return true
        }
    },

    "guarded": {
        "id": "guarded",
        "name": "Guarded",
        "description": "A careful approach that shows no weakness.",
        "effectDescription": "<hr> ↑↑ &nbsp;&nbsp; Defense <hr>  ↓↓ &nbsp;&nbsp; Speed <hr>",
        "effect": {
            "attack": 1,
            "defense": 1.1,
            "speed": 0.9,
            "other": undefined
        },
        isAvailable: (roster) => {
            return true
        }
    },

    "tempest": {
        "id": "tempest",
        "name": "Tempest",
        "description": "Summon a storm to whisk us into battle.",
        "effectDescription": "<hr> ↑ &nbsp;&nbsp; Attack <hr> ↑ &nbsp;&nbsp; Speed <hr> ↓↓ &nbsp;&nbsp; Defense <hr>",
        "effect": {
            "attack": 1.05,
            "defense": 0.9,
            "speed": 1.05,
            "other": undefined
        },
        isAvailable: (roster) => {
                function isCloud(dragon) { return dragon != undefined && dragon.element == "cloud"}
                return ( roster.some(isCloud) )
        }
    }

}

Game.ExploreData = {

    "forest": {
        "area": {
            "areaID": "forest",
            "areaName": "Forest",
            "areaDescription": "A once-beautiful forest that has been twisted by the recent upheaval.",
            "isVisible": true,
            "isBeaten": false,
            "lastEncounter": 3
        },
        "encounters": {
            1: {
                "encounterID": 1,
                "encounterName": "Wolves",
                "encounterDescription": "A group of maddened wolves block your path. \
                                         A few dragons and a good strategy should be able to take them out! <br><br> \
                                         All encounters need to be won within a certain number of rounds, else your dragons will become too exhausted to continue. <br>",
                "encounterFaced": false,
                "encounterBeaten": false,
                "enemies": [
                    new Enemy(Game.EnemyData["wolf"], "Manic Wolf"),
                    new Enemy(Game.EnemyData["wolf"], "Rabid Wolf"),
                    new Enemy(Game.EnemyData["wolf"], "Frantic Wolf")
                ],
                "standardStrategyAvailable": true,
                "additionalStrategyOptions": undefined,
                startOfRound: (roster, enemies) => {
                    return;
                }
            },

            2: {
                "encounterID": 2,
                "encounterName": "Fallen Tree",
                "encounterDescription": "A large tree blocks your path. Going around it would take too long.",
                "encounterFaced": false,
                "encounterBeaten": false,
                "enemies": [
                    new Enemy(Game.EnemyData["fallenTree"], "Fallen Tree")
                ],
                "standardStrategyAvailable": true,
                "additionalStrategyOptions": undefined,
                startOfRound: (roster, enemies) => {
                    return;
                }
            },

            3: {
                "encounterID": 3,
                "encounterName": "Wolves and Bears",
                "encounterDescription": "A second group of wolves block your path, but this time they brought company.",
                "encounterFaced": false,
                "encounterBeaten": false,
                "enemies": [
                    new Enemy(Game.EnemyData["wolf"], "Rabid Wolf"),
                    new Enemy(Game.EnemyData["wolf"], "Frantic Wolf"),
                    new Enemy(Game.EnemyData["wolf"], "Berserk Wolf"),
                    new Enemy(Game.EnemyData["wolf"], "Erratic Wolf"),
                    new Enemy(Game.EnemyData["bear"], "Bear")
                ],
                "standardStrategyAvailable": true,
                "additionalStrategyOptions": undefined,
                startOfRound: (roster, enemies) => {
                    return;
                }
            }
        }    
    }   

}


