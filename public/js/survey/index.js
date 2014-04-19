window.survey = function() {
    $("body").addClass("activated");

    setTimeout(function() {
        $(".survey")
            .hAlign()
            .vAlign()
            .addClass("activated");
    }, 500);
}
