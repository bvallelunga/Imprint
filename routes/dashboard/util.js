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
                next: "/dashboard/%s/surveys/".sprintf(project.pub_id)
            });
        } else {
            res.error(200, "Failed to Create Project", error);
        }
    });
}

exports.create_rule = function(req, res, next) {
    req.models.projects.one({
        pub_id: req.param("project")
    }, function(error, project) {
        if(!error && project) {
            project.rules[project.rule_id()] = {
                name: req.param("name"),
                path: req.param("path"),
                delay: req.param("delay"),
                valuable: req.param("valuable"),
                type: req.param("page")
            }

            project.save({
               rules: JSON.cycle(project.rules)
            }, function(error, project) {
                if(!error) {
                    res.render("dashboard/" + req.param("page"), {
                        current_project: project
                    });
                } else {
                    res.error(200, null, error);
                }
            });
        } else {
            res.error(200, null, error);
        }
    });
}

exports.update_rule = function(req, res, next) {
    req.models.projects.one({
        pub_id: req.param("project")
    }, function(error, project) {
        if(!error && project) {
            project.rules[req.param("rule")] = {
                name: req.param("name"),
                path: req.param("path"),
                delay: req.param("delay"),
                valuable: req.param("valuable"),
                type: req.param("page")
            }

            project.save({
               rules: JSON.cycle(project.rules)
            }, function(error, project) {
                if(!error) {
                    res.render("dashboard/" + req.param("page"), {
                        current_project: project
                    });
                } else {
                    res.error(200, null, error);
                }
            });
        } else {
            res.error(200, null, error);
        }
    });
}

exports.remove_rule = function(req, res, next) {
    req.models.projects.one({
        pub_id: req.param("project")
    }, function(error, project) {
        if(!error && project) {
            delete project.rules[req.param("rule")];

            project.save({
               rules: JSON.cycle(project.rules)
            }, function(error, project) {
                if(!error) {
                    res.render("dashboard/" + req.param("page"), {
                        current_project: project
                    });
                } else {
                    res.error(200, null, error);
                }
            });
        } else {
            res.error(200, null, error);
        }
    });
}
