exports.index = function(req, res, next) {
    req.models.users.get(req.session.user.id, function(error, user) {
        if(!error && user) {
            if(!user.projects.empty) {
                if(req.param("project")) {
                    res.render("dashboard/index", {
                        title: "Dashboard",
                        js: req.js.renderTags("core", "dashboard"),
                        css: req.css.renderTags("core", "dashboard"),
                        user: user,
                        current_project: $.map(user.projects, function(project) {
                            if(project.pub_id == req.param("project")) {
                                return project;
                            }
                        })[0]
                    });
                } else {
                    res.redirect("/dashboard/%s/".sprintf(user.projects[0].pub_id));
                }
            } else {
                res.redirect("/dashboard/create/");
            }
        } else {
            res.error(500, null, error);
        }
    });
}

exports.create = function(req, res, next) {
    res.render("dashboard/create", {
        title: "Create Project",
        js: req.js.renderTags("core"),
        css: req.css.renderTags("core"),
        forced: req.session.user.projects.empty
    });
}
