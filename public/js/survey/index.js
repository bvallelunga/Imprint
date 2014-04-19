$(function() {
    $(".survey").hAlign();
});

window.survey = function() {
    $("body").addClass("activated");

    setTimeout(function() {
        $(".survey")
            .vAlign()
            .addClass("activated");
    }, 500);
}
