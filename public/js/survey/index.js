window.Imprint = {
    backdrop: document.getElementById("imprint_backdrop"),
    survey: document.getElementById("imprint_survey"),
    activate: function(type) {
        if(type in this) {
            this[type].activate(this);
            this[type].open(this);
        }
    },
    popup: {
        activate: function(_this) {
            var header = _this.survey.getElementsByClassName("imprint_close")[0];
            [_this.backdrop, header].forEach(function(element) {
                element.addEventListener('click', function() {
                     _this.popup.close(_this);
                }, false);
            });
        },
        open: function(_this) {
            _this.backdrop.style.display = "block";

            setTimeout(function() {
                _this.backdrop.className = "activated";

                setTimeout(function() {
                    _this.survey.className = "imprint_popup activated";
                    _this.survey.style.marginTop = (_this.survey.offsetHeight / 2);
                }, 300);
            }, 100);
        },
        close: function(_this) {
            _this.survey.className = "imprint_popup";
            _this.survey.style.marginTop = "inherit";

            setTimeout(function() {
                _this.backdrop.className = "";

                setTimeout(function() {
                    _this.backdrop.style.display = "none";
                }, 100);
            }, 300);
        }
    }
}
