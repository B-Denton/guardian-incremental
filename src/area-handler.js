"use strict"; // execute in strict mode

Game.AreaHandler = {

    currentArea: "field" ,  // Area that player is currently viewing.
    areas: {},  // Holds information on all game areas. key: areaID, value: dict.

    init() {
        this.currentArea = "field" 
    },

    addArea(area) {
        this.areas[area.id] = area;
    },

    isAreaUnlocked(areaID) {
        return this.areas[areaID].isUnlocked;
    },

    loadDataFromSave(areaID, areaInformation) {
        for (var key in areaInformation) {
            if (!(["reserveDragons", "hatcheryEggs", "hatcherySlots"].includes(key))) {
                Game.AreaHandler.areas[areaID][key] = areaInformation[key];
            }  
        };
    },

    loadCurrentArea() {
        // Reset area.
        $("#area-content").empty();  
        $("#area-navigation").empty();  

        // Set-up navigation bar
        $("#area-navigation").append('<ul id="areaList"></ul>')
        this.setupAreaNavigationBar();

        // Load area content
        this.areas[this.currentArea].activate();
    },

    setupAreaNavigationBar () {
        // Reset list of navigatable areas.
        $("#areaList").empty();
        // Add unlocked areas to list in desired order.
        const orderedAreas = ['field', 'hatchery', 'reserve', 'explore']
        $.each(orderedAreas, ( _ , areaID) => {
            var area = this.areas[areaID]
            if (area.isUnlocked) {
                var areaListItem = $("<li>");
                areaListItem.append(
                    $("<a>")
                    .attr("id", "area-" + areaID)  
                    .html(area.name) 
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
        this.areas[areaID].isUnlocked = true;
        this.setupAreaNavigationBar();  // ensure unlocked area is viewable on navigation bar.
    }

}