$(function() {
    $(".popup").hAlign().vAlign();

    $("form").submit(function(e) {
        e.preventDefault();
        e.stopPropagation();

        var form = $(this);

        $.post($(this).attr("action"), $(this).serialize(), function(response) {
            if(response.success) {
                window.location.href = response.next;
            } else {
                form.find(".button").eq(0).addClass("error").val(response.error_message);
            }
        });
    });
});
