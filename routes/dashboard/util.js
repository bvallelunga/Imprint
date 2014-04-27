var url = require('fast-url-parser');

exports.create_project = function(req, res, next) {
    var host = req.param("host").toLowerCase();

    if(host.indexOf("http://") == -1 && host.indexOf("https://") == -1) {
        host = "http://" + host;
    }

    req.models.projects.create({
        name: req.param("name"),
        host: url.parse(host).hostname,
        owner_id: req.session.user.id
    }, function(error, project) {
        if(!error && project) {
            res.success({
                next: "/dashboard/%s/popups/".sprintf(project.pub_id)
            });
        } else {
            res.error(200, "Failed to Create Project", error);
        }
    });
}

exports.create_rule = function(req, res, next) {
    async.waterfall([
        function(callback) {
            req.models.projects.one({
                pub_id: req.param("project")
            }, callback);
        },
        function(project, callback) {
            req.models.projects.rules.create({
                name: req.param("name"),
                path: req.param("path"),
                delay: req.param("delay"),
                valuable: req.param("valuable"),
                type: req.param("page"),
                project_id: project.id
            }, callback);
        },
        function(rule, callback) {
            req.models.projects.one({
                pub_id: req.param("project")
            }, callback);
        },
        function(project, callback) {
            res.render("dashboard/" + req.param("page"), {
                current_project: project
            });

            callback(null);
        }
    ], function(error) {
        if(error) {
            res.error(200, null, error);
        }
    });
}

exports.update_rule = function(req, res, next) {
    async.waterfall([
        function(callback) {
            req.models.projects.rules.one({
                pub_id: req.param("rule")
            }, callback);
        },
        function(rule, callback) {
            rule.save({
                name: req.param("name"),
                path: req.param("path"),
                delay: req.param("delay"),
                valuable: req.param("valuable"),
                type: req.param("page")
            }, callback);
        },
        function(rule, callback) {
            req.models.projects.one({
                pub_id: req.param("project")
            }, callback);
        },
        function(project, callback) {
            res.render("dashboard/" + req.param("page"), {
                current_project: project
            });

            callback(null);
        }
    ], function(error) {
        if(error) {
            res.error(200, null, error);
        }
    });
}

exports.remove_rule = function(req, res, next) {
    async.waterfall([
        function(callback) {
            req.models.projects.rules.one({
                pub_id: req.param("rule")
            }, callback);
        },
        function(rule, callback) {
            rule.remove(callback);
        },
        function(rule, callback) {
            req.models.projects.one({
                pub_id: req.param("project")
            }, callback);
        },
        function(project, callback) {
            res.render("dashboard/" + req.param("page"), {
                current_project: project
            });

            callback(null);
        }
    ], function(error) {
        if(error) {
            res.error(200, null, error);
        }
    });
}
