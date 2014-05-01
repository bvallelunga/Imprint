$(function() {
    hljs.initHighlightingOnLoad();

    $(".content.popups").on("submit", "form", function(e) {
        e.preventDefault();
        e.stopPropagation();

        var form = $(this);

        $.post($(this).attr("action"), $(this).serialize(), function(response) {
            if(typeof response == "string") {
                $(".content.popups").html(response);
            } else {
                if(form.hasClass("create")) {
                    form.find(".button-create").val("Failed");
                } else if(form.hasClass("update")) {
                    form.find(".button-update").val("Failed");
                } else {
                    form.find(".button-remove").val("Failed");
                }
            }
        });
    });
});
