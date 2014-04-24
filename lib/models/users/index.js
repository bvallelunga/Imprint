var crypto = require('crypto');
var rand = require("generate-key");
var uuid = require('node-uuid');

module.exports = function (db, models) {
    var users = db.define("users", {
        pub_id: {
            type: "text"
        },
        name: {
            type: "text",
            required: true
        },
        email: {
            type: "text",
            required: true
        },
        password: {
            type: "text",
            required: true
        },
        card: Object,
        stripe: String
    }, {
        timestamp: true,
        hooks: {
            beforeCreate: function() {
                this.pub_id = rand.generateKey(Math.floor(Math.random() * 15) + 15);
                this.password = this.hash(this.password);
            },
            afterCreate: function(success) {
                if(success) {
                    this.add_stripe();
                }
            },
            beforeSave: function() {
                this.name = this.name.capitalize;
            }
        },
        methods: {
            hash: function(data) {
                return crypto.createHash('md5').update(data).digest("hex");
            },
            add_stripe: function() {
                var _this = this;

                lib.stripe.customers.create({
                    email: _this.email,
                }, function(error, customer) {
                    if(!error && customer) {
                        _this.stripe = customer.id;
                        _this.save();
                    }
                });
            }
        },
        validations: {
            pub_id: db.enforce.unique(),
            email: [
                db.enforce.patterns.email(),
                db.enforce.unique()
            ]
        }
    });

    users.hash = function(data) {
        return crypto.createHash('md5').update(data).digest("hex");
    }

    return users;
};
