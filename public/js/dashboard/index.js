$(function() {
    $(".header .profile").click(function(e) {
        e.stopPropagation();
        $(this).toggleClass("activated");
    });

    $("body").click(function() {
        $(".header .profile").removeClass("activated");
    });
});
