window.Imprint = {
    $$: document.querySelectorAll.bind(document),
    forEach: Array.prototype.forEach,
    finished: false,
    activate: function(parent, type) {
        var _this = this;
        this.backdrop = this.$$("#imprint_backdrop")[0];
        this.survey = this.$$("#imprint_survey")[0];
        this.close = this.$$("#imprint_survey .imprint_close")[0];
        this.type = type;
        this.parent = parent;

        if(type in this) {
            this[type].activate(this);
            this[type].open(this);
        }

        this.forEach.call([this.backdrop, this.close], function(element) {
            element.onclick = function() {
                 _this.popup.close(_this);
            };
        });
    },
    popup: {
        activate: function(_this) {
            _this.forEach.call(_this.$$(".imprint_stars span"), function(element, index) {
                element.onclick = function() {
                     _this.stars.choose(_this, element, (5 - index));
                };

                element.onmouseover = function() {
                    _this.stars.mouseover(_this, (5 - index));
                };
            });

            _this.$$(".imprint_stars")[0].onmouseout = function() {
                _this.stars.mouseout(_this);
            };
        },
        open: function(_this) {
            _this.backdrop.style.display = "block";

            setTimeout(function() {
                _this.backdrop.className = "activated";

                setTimeout(function() {
                    _this.survey.className = "imprint_popup activated";
                    _this.survey.style.marginTop = (-1 * _this.survey.offsetHeight / 2) + "px";
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
    },
    stars: {
        rating: null,
        descriptions: [
            "Hating it",
            "Disliking it",
            "It's been okay",
            "Liking it",
            "Loving it"
        ],
        mouseover: function(_this, index) {
            if(!_this.finished) {
                _this.$$(".imprint_description")[0].innerText = _this.stars.descriptions[index - 1];
            }
        },
        mouseout: function(_this, index) {
            if(!_this.finished) {
                if(_this.stars.rating) {
                    _this.$$(".imprint_description")[0].innerText = _this.stars.descriptions[_this.stars.rating - 1];
                } else {
                    _this.$$(".imprint_description")[0].innerText = "....";
                }
            }
        },
        choose: function(_this, star, index) {
            _this.stars.rating = index;
            _this.forEach.call(_this.$$(".imprint_stars span"), function(element) {
                element.className = "";
            });

            star.className = "chosen";

            if(index == 5) {
                _this.finished = true;
                _this.$$(".imprint_description")[0].innerText = "Thank You!";
                _this.parent.request({
                    rating: index
                }, "POST");

                setTimeout(function() {
                    _this[_this.type].close(_this);
                }, 3000);
            }
        }
    }
}
