"use strict"; // execute in strict mode

var dragonID = 0;

class Dragon {

    constructor(element) {
        this.id = this.generateID();
        this.name = this.generateName();
        this.type = "dragon";
        this.element = element;
        this.extractElementData(this.element)
        this.level = 1;
        this.xp = 0;
        this.generateAttributes();
        this.conditions = [];
    };

    extractElementData() {
        const elementData = Game.Elements.mapElementToDragon(this.element)
        for (var key in elementData) {
            this[key] = elementData[key]
        };
    };

    generateName() {
        var prefix = dragonNamePrefix[(Math.floor(Math.random() * dragonNamePrefix.length))]
        var suffix = dragonNameSuffix[(Math.floor(Math.random() * dragonNameSuffix.length))]
        return prefix + suffix;
    };

    generateID() {
        dragonID++;
        return dragonID;
    };

    generateAttributes() {
        this.hp = {"id": "hp", "name": "Health", "max": this.combat.baseHP, "value": this.combat.baseHP};
        this.attack = {"id": "attack", "name": "Attack", "max": this.combat.baseAttack, "value": this.combat.baseAttack};
        this.defense = {"id": "defense", "name": "Defense", "max": this.combat.baseDefense, "value": this.combat.baseDefense};
        this.speed = {"id": "speed", "name": "Speed", "max": this.combat.baseSpeed, "value": this.combat.baseSpeed};
    };

    experienceNeeded(level) {
        return Math.floor(this.levelUpStats.baseXP * Math.pow(level,this.levelUpStats.exponent));
    };

    checkLevelUp() {
        var xpNeeded = this.experienceNeeded(this.level);
        if (this.xp >= xpNeeded) {
            return true;
        } else {
            return false
        }
    };

    levelUp() {
        this.xp = 0;
        this.level++;
        $.each(['hp', 'attack', 'defense', 'speed'], ( _ , item) => {
            console.log (Math.round(((this[item].max * 1.1) * 100) / 100))
            this[item].max = Math.round(((this[item].max * 1.1) * 100) / 100) ;
            this[item].value = this[item].max;
        })
    };

}

const dragonNamePrefix = [
    "A",
    "Ab",
    "Af",
    "Ap",
    "Abu",
    "Al",
    "Ala",
    "Bar",
    "Bat",
    "Ibn",
    "Da",
    "Das",
    "De",
    "Del",
    "Der",
    "Di",
    "Dos",
    "Du",
    "E",
    "El",
    "Fi",
    "Ka",
    "La",
    "Le",
    "Lu",
    "Mac",
    "Mala",
    "Na",
    "Ni",
    "Nin",
    "Nor",
    "Ny",
    "O",
    "Oz",
    "Sma",
    "Smu",
    "Te",
    "Ter",
    "Van",
    "Von",
    "Zu"

]; 

const dragonNameSuffix = [
    "ac",
    "ais",
    "aj",
    "ange",
    "appa",
    "arz",
    "chian",
    "chek",
    "chyk",
    "ckas",
    "den",
    "don",
    "dze",
    "dzki",
    "eault",
    "ema",
    "enas",
    "enko",
    "enya",
    "eres",
    "eros",
    "evski",
    "felth",
    "gil",
    "icius",
    "yshin",
    "jerin",
    "lein",
    "mohr",
    "mere",
    "nova",
    "nejad",
    "nyi",
    "osz",
    "ous",
    "ovski",
    "putra",
    "putri",
    "skas",
    "sky",
    "stom",
    "vich",
    "ya"
]; 