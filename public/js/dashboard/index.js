$(function() {
    $(".header .project").click(function() {
        var _this = this;

        if($(_this).hasClass("activated")) {
            $(".projects .slider").animate({
                opacity: 0
            }, 300);

            setTimeout(function() {
                $(_this).removeClass("activated");
                $(".projects").slideUp(300);
            }, 300);
        } else {
            $(_this).addClass("activated");
            $(".projects").slideDown(300);

            setTimeout(function() {
                $(".projects .slider").animate({
                    opacity: 1
                }, 300);
            }, 500);
        }
    });

    $(".header .profile").click(function(e) {
        e.stopPropagation();
        $(this).toggleClass("activated");
    });

    $("body").click(function() {
        $(".header .profile").removeClass("activated");
    });
});
