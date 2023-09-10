"use strict"; // execute in strict mode

Game.Advancements = { 

    init() {
        $.each(Game.AdvancementData, (advancementID, advancement) => {
            this.AdvancementsList[advancementID] = {...advancement};
        });
    },

    setup() {

    },

    AdvancementsList: {

    },

    loadDataFromSave(advancementData) {
        $.each(advancementData, (advancementID, advancementData) => {
            for (var key in advancementData) {
                    Game.Advancements.AdvancementsList[advancementID][key] = advancementData[key];
            };
        });
    },
    
    checkAdvancements() {
        $.each(this.AdvancementsList, (advancementID, advancement) => {
            if (!advancement.hasTriggered) {
                if (advancement.shouldTrigger()) {
                    advancement.activate();
                    advancement.hasTriggered = true;
                }
            }
        });
    }









};



