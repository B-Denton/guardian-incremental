"use strict"; // execute in strict mode

Game.Log = {
    notificationList: [],  // List of [string: message, string: type]
    totalNotifications: 0,

    init() {
        this.notificationList = [];
        this.totalNotifications = 0,
        log.updateLog();
    },

    setup() {  // load values from saved data.
        log.updateLog();
    },

    update() {  // update on game tick.

    },

    loadDataFromSave(logData) {
        Game.Log.totalNotifications = logData.totalNotifications;
        $.each(logData.notificationList, ( _ , notification) => {
            this.addNotification(notification[0], notification[1]);
        });
    },

    addNotification(message, important) {
        log.notificationList.push([message, important]);
        log.updateLog();
        log.totalNotifications++;
    },

    updateLog() {
        const logID = $("#game-log")
        logID.empty();
        logID.append($("<div>")
            .attr("id", "game-log-title")
            .html("Notifications")
        );
        logID.append($("<div>")
            .attr("id", "notifications-container")
        );

        $.each(log.notificationList, ( _ , notification) => {
            $("#notifications-container").prepend($("<div>")
                .attr("class", "notification-message " + notification[1])
                .html(notification[0])
            );
        });

        
    }







}