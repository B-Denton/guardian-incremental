"use strict"; // execute in strict mode

Game.Log = {
    notificationList: [],  // List of [string: message, string: type]
    totalNotifications: 0,

    init() {
        log.updateLog();
    },

    setup() {  // load values from saved data.
        log.updateLog();
    },

    update() {  // update on game tick.

    },

    addNotification(message, important) {
        log.notificationList.push([message, important]);
        log.updateLog();
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

        $.each(log.notificationList, (i, notification) => {
            $("#notifications-container").prepend($("<div>")
                .attr("class", "notification-message " + notification[1])
                .html(notification[0])
            );
        });
    }







}