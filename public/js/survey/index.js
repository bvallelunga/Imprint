$(function() {
    $(".survey").hAlign();
});

window.survey = {
    url: "",
    open: function() {
        $("body").addClass("activated");

        setTimeout(function() {
            $(".survey")
                .vAlign()
                .addClass("activated");
        }, 500);
    },
    close: function(e) {
        var _this = window.survey;

        $(".survey")
            .css("top", "")
            .removeClass("activated");

        setTimeout(function() {
            $("body").removeClass("activated");

            setTimeout(function() {
                window.parent.postMessage("close", _this.url);
            }, 500);
        }, 500);
    },
    message: function(e) {
        window.survey[e.data]();
    }
}

/* Add Event Listeners */
window.addEventListener('message', window.survey.message, false);
