$(function() {
    $(".popup").hAlign().vAlign().show();

    $(".popup form").submit(function(e) {
        e.preventDefault();
        e.stopPropagation();

        var form = $(this);

        $.post($(this).attr("action"), $(this).serialize(), function(response) {
            if(response.success) {
                window.location.href = response.next;
            } else {
                form.find(".button").eq(0).addClass("error").val(response.message);
            }
        });
    });

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
