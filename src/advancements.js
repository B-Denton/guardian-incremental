"use strict"; // execute in strict mode

Game.Advancements = { 

    init() {

    },

    setup() {
        $.each(Game.AdvancementData, (advancementID, advancement) => {
            this.advancementsList[advancementID] = advancement;
        });
    },

    advancementsList: {

    },
    
    checkAdvancements() {
        $.each(this.advancementsList, (advancementID, advancement) => {
            if (!advancement.hasTriggered) {
                if (advancement.shouldTrigger()) {
                    advancement.activate();
                    advancement.hasTriggered = true;
                }
            }
        });
    }









};



