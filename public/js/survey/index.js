window.Imprint = {
    backdrop: document.getElementsByClassName("imprint_backdrop")[0],
    survey: document.getElementsByClassName("imprint_popup")[0],
    open: function() {
        var _this = this;
        _this.backdrop.style.display = "block";

        setTimeout(function() {
            _this.backdrop.className = "imprint_backdrop activated";
        }, 100);

        setTimeout(function() {
            _this.survey.className = "imprint_popup activated";
            _this.survey.style.marginTop = (_this.survey.offsetHeight / 2);
        }, 400);
    },
    close: function() {
        var _this = this;
        _this.survey.className = "imprint_popup";
        _this.survey.style.marginTop = "inherit";

        setTimeout(function() {
            _this.backdrop.className = "imprint_backdrop";
        }, 300);

        setTimeout(function() {
            _this.backdrop.style.display = "none";
        }, 400);
    }
}
