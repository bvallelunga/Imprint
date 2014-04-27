var rand = require("generate-key");

module.exports = function (db, models) {
    return db.define("projects_feedback", {
        pub_id: String,
        rating: Number,
        feedback: {
            type: "object",
            big: true
        }
    }, {
        timestamp: true,
        hooks: {
            beforeCreate: function() {
                var _this = this;
                this.feedback = this.feedback || [];
                this.pub_id = rand.generateKey(Math.floor(Math.random() * 15) + 15);
            }
        },
        validations: {
            pub_id: db.enforce.unique()
        }
    });
};
