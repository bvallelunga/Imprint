var rand = require("generate-key");
var request = require('request');
var pattern = require('route-pattern');

module.exports = function (db, models) {
    return db.define("projects", {
        pub_id: String,
        name: String,
        host: String,
        image: {
            type: "text",
            defaultValue: config.company_default
        }
    }, {
        timestamp: true,
        hooks: {
            beforeCreate: function(next) {
                var _this = this;
                this.pub_id = rand.generateKey(Math.floor(Math.random() * 15) + 15);
                this.set_image(next);
            }
        },
        methods: {
            set_image: function(callback) {
                var _this = this;
                request("http://" + this.host, function(error, response, body) {
                    if(!error && response.statusCode == 200) {
                        var document = $(body);
                        var favicon = document.find('link[rel="shortcut icon"]').attr('href');
                        var open_graph = document.find('meta[property="og:image"]').attr('content');

                        if(open_graph || favicon) {
                            _this.image = $.trim(open_graph || favicon);

                            if(_this.image.slice(0, 1) == "/" && _this.image.slice(0, 2) != "//") {
                                _this.image = _this.host + _this.image;
                            }

                            if(_this.image.indexOf("http://") == -1 && _this.image.indexOf("https://") == -1) {
                                _this.image = "http://" + _this.image;

                            }
                        }
                    }

                    callback();
                });
            },
            rule_engine: function(req, callback) {
                var path = req.param("path");

                async.filter(this.rules, function(rule, next) {
                    next(pattern.fromString(rule.path).matches(path));
                }, function(rules) {
                    if(!rules.empty) {
                        rules[0].delay = parseFloat(rules[0].delay) * 1000;
                        rules[0].valuable = parseInt(rules[0].valuable);

                        callback(true, rules[0]);
                    } else {
                        callback(false);
                    }
                });
            }
        },
        validations: {
            pub_id: db.enforce.unique()
        }
    });
};
