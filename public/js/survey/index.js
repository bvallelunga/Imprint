window.Imprint = {
    $$: document.querySelectorAll.bind(document),
    forEach: Array.prototype.forEach,
    finished: false,
    activate: function(parent, response) {
        var _this = this;
        this.backdrop = this.$$("#imprint_backdrop")[0];
        this.survey = this.$$("#imprint_survey")[0];
        this.close = this.$$("#imprint_survey .imprint_close")[0];
        this.response = response;
        this.parent = parent;

        if(response.type in this) {
            this[response.type].activate(this);
            this[response.type].open(this);
        }

        this.backdrop.onclick = function() {
            _this.popup.close(_this);
        };

        this.close.onclick = function() {
            _this.popup.close(_this);

            _this.parent.request({
                closed: true
            }, "POST");
        };
    },
    popup: {
        activate: function(_this) {
            _this.stars.mouseout(_this);

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

            _this.$$(".imprint_button")[0].onclick = function() {
                _this.submit(_this);
            };
        },
        open: function(_this) {
            _this.backdrop.style.display = "block";

            setTimeout(function() {
                _this.backdrop.className += " activated";

                setTimeout(function() {
                    _this.survey.className += " activated";
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
                _this.$$(".imprint_description")[0].innerHTML = _this.stars.descriptions[index - 1];
            }
        },
        mouseout: function(_this) {
            if(!_this.finished) {
                if(_this.stars.rating) {
                    _this.$$(".imprint_description")[0].innerHTML = _this.stars.descriptions[_this.stars.rating - 1];
                } else {
                    _this.$$(".imprint_description")[0].innerHTML = "..........";
                }
            }
        },
        choose: function(_this, star, index) {
            _this.stars.rating = index;
            _this.forEach.call(_this.$$(".imprint_stars span"), function(element) {
                element.className = "";
            });

            star.className = "chosen";

            if(_this.response.questions[String(index)]) {
                _this.questionaire.open(_this, index);
            } else {
                _this.questionaire.close(_this, index);
                _this.submit(_this);
            }
        }
    },
    questionaire: {
        open: function(_this, index) {
            index = String(index);

            _this.$$(".imprint_question")[0].innerText = _this.response.questions[index];

            setTimeout(function() {
                _this.$$(".imprint_questionaire")[0].className += " activated";
                _this.$$(".imprint_submit")[0].className += " activated";

                setTimeout(function() {
                    _this.survey.style.marginTop = (-1 * _this.survey.offsetHeight / 2) + "px";
                }, 10);
            }, 10);
        },
        close: function(_this) {
            _this.$$(".imprint_questionaire")[0].className = "imprint_questionaire";
            _this.$$(".imprint_submit")[0].className = "imprint_submit";

            setTimeout(function() {
                _this.survey.style.marginTop = (-1 * _this.survey.offsetHeight / 2) + "px";
            }, 10);
        }
    },
    submit: function(_this) {
        _this.finished = true;
        _this.$$(".imprint_description")[0].innerHTML = "Thank You!";
        _this.$$(".imprint_button")[0].value = "sending...";
        _this.$$(".imprint_button")[0].className += " sending";

        _this.parent.request({
            rating: _this.stars.rating,
            response: _this.$$(".imprint_response")[0].value
        }, "POST", function() {
            setTimeout(function() {
                _this[_this.response.type].close(_this);
            }, 1000);
        });
    }
}
