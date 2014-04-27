var rand = require("generate-key");

module.exports = function (db, models) {
    return db.define("projects_rules", {
        pub_id: String,
        name: String,
        path: String,
        delay: String,
        valuable: String,
        type: String
    }, {
        timestamp: true,
        hooks: {
            beforeCreate: function() {
                var _this = this;
                this.pub_id = rand.generateKey(Math.floor(Math.random() * 15) + 15);
            }
        },
        validations: {
            pub_id: db.enforce.unique()
        }
    });
};
