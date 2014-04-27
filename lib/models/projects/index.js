var rand = require("generate-key");
var request = require('request');

module.exports = function (db, models) {
    return db.define("projects", {
        pub_id: String,
        name: String,
        host: String,
        rules: {
            type: "object",
            big: true
        },
        image: {
            type: "text",
            defaultValue: config.company_default
        }
    }, {
        timestamp: true,
        hooks: {
            beforeCreate: function(next) {
                var _this = this;
                this.rules = {};
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
                            _this.image = open_graph || favicon;

                            if(_this.image.indexOf("http://") == -1 && _this.image.indexOf("https://") == -1) {
                                _this.image = "http://" + _this.image;

                            }
                        }
                    }

                    callback();
                });
            },
            rule_id: function() {
                return rand.generateKey(Math.floor(Math.random() * 5) + 15);
            }
        },
        validations: {
            pub_id: db.enforce.unique()
        }
    });
};
