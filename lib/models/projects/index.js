var rand = require("generate-key");

module.exports = function (db, models) {
    return db.define("projects", {
        pub_id: String,
        name: String,
        rules: Object
    }, {
        timestamp: true,
        hooks: {
            beforeCreate: function() {
                this.pub_id = rand.generateKey(Math.floor(Math.random() * 15) + 15);
            }
        },
        validations: {
            pub_id: db.enforce.unique()
        }
    });
};
