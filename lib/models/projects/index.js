var rand = require("generate-key");
var request = require('request');

module.exports = function (db, models) {
    return db.define("projects", {
        pub_id: String,
        name: String,
        host: String,
        rules: Object
    }, {
        timestamp: true,
        hooks: {
            beforeCreate: function() {
                this.pub_id = rand.generateKey(Math.floor(Math.random() * 15) + 15);
            },
            afterLoad: function(next) {
                var _this = this;

                _this.get_image(function(image) {
                    _this.image = image;
                    next();
                });
            }
        },
        methods: {
            get_image: function(callback) {
                request("http://" + this.host, function(error, response, body) {
                    if(!error && response.statusCode == 200) {
                        var document = $(body);
                        var favicon = document.find('link[rel="shortcut icon"]').attr('href');
                        var open_graph = document.find('meta[property="og:image"]').attr('content');

                        callback(open_graph || favicon);
                    } else {
                        callback("");
                    }
                });
            }
        },
        validations: {
            pub_id: db.enforce.unique()
        }
    });
};
