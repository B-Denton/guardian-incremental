"use strict"; // execute in strict mode

Game.AreaHandler = {

    currentArea: "field" ,  // Area that player is currently viewing.
    allAreas: {},  // Holds information on all game areas. key: areaID, value: dict.

    init() {
        this.currentArea = "field" 
    },

    addArea(area) {
        this.allAreas[area.id] = {
            id: area.id,  // shortened string value
            name: area.name,  // string value
            object: area  // area object
        }
    },

    isAreaUnlocked(areaID) {
        return this.allAreas[areaID].object.isUnlocked;
    },

    updateUnlockedAreas() {
        $.each(this.allAreas, (areaID, areaInformation) => {
            if (areaInformation.object.isUnlocked) {
                return;  // equivalent to 'continue'. 
            }
            
            /*  TO ADD: Code to check if unlock requirements 
                are met for any new areas.
            */

        });
    },

    loadCurrentArea() {
        // Reset area.
        $("#area-content").empty();  
        $("#area-navigation").empty();  

        // Set-up navigation bar
        $("#area-navigation").append('<ul id="areaList"></ul>')
        this.setupAreaNavigationBar();

        // Load area content
        this.allAreas[this.currentArea].object.activate();
    },

    setupAreaNavigationBar () {
        // Reset list of navigatable areas.
        $("#areaList").empty();
        // Add unlocked areas to list in desired order.
        const areas = ['field', 'hatchery', 'reserve', 'explore']
        $.each(areas, ( _ , areaID) => {
            var areaInformation = this.allAreas[areaID]
            if (areaInformation.object.isUnlocked) {
                var areaListItem = $("<li>");
                areaListItem.append(
                    $("<a>")
                    .attr("id", "area-" + areaID)  
                    .attr("href", "javascript:;") 
                    .html(areaInformation.name) 
                    .on("click", function callback() {
                        const area = $(this).attr("id").split("-")[1];  // isolate areaID
                        Game.AreaHandler.changeArea(area);
                    })
                    );
            }
            $("#areaList").append(areaListItem);  
         });
    },

    changeArea(area) {
        this.currentArea = area
        this.loadCurrentArea();
    },

    unlockArea(areaID) {
        this.allAreas[areaID].object.isUnlocked = true;
        this.setupAreaNavigationBar();  // ensure unlocked area is viewable on navigation bar.
    }

}