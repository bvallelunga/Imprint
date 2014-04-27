var orm = require("orm");
var paging = require("orm-paging");
var random = require("orm-random");
var modts = require('orm-timestamps');
var init = false;

module.exports = orm.express(config.orm, {
    define: function (db, models, callback) {
        /* Settings */
        db.settings.set("properties.primary_key", "id");
        db.settings.set("instance.cache", false);
        db.settings.set("instance.autoSave", false);
        db.settings.set("instance.autoFetch", true);
        db.settings.set("instance.autoFetchLimit", 2);

        /* Use Plugins */
        db.use(random);
        db.use(paging);
        db.use(modts, {
            persist: true,
            createdProperty: 'created',
            modifiedProperty: 'modified',
            dbtype: {
                type: 'date',
                time: true
            },
            now: function() {
                return new Date();
            }
        });

        /* Define Models */
        models.users = require("./users")(db, models);
        models.projects = require("./projects")(db, models);

        /* Associations */
        models.projects.hasOne("owner", models.users, { reverse: "projects" });


        /* Init */
        if(!init) {
            async.series([
                function(next) {
                    if(config.orm.reset) {
                        db.drop(next);
                    } else {
                        next();
                    }
                },
                function(next) {
                    if(config.orm.reset || config.orm.sync) {
                        db.sync(next);
                    } else {
                        next();
                    }
                },
                function(next) {
                    if(config.orm.reset || config.orm.preload) {
                        require("./preload")(models);
                    }

                    next();
                }
            ], function(errors) {
                init = true;
                lib.error.capture(errors);
                if(callback) callback();
            });
        } else if(callback) {
            callback();
        }
    }
});
