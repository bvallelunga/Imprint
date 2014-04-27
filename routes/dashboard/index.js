exports.index = function(req, res, next) {
    var projects = req.session.user.projects;

    if(projects.empty) {
        res.redirect("/dashboard/create/");
    } else {
        var current_project = $.map(projects, function(project) {
            if(project.pub_id == req.param("project")) {
                return project;
            }
        });

        if(req.param("project") && !current_project.empty) {
            current_project = current_project[0];

            if(req.param("page")) {
                res.render("dashboard/index", {
                    title: "Dashboard",
                    js: req.js.renderTags("core", "dashboard"),
                    css: req.css.renderTags("core", "dashboard"),
                    current_project: current_project,
                    page: req.param("page")
                });
            } else {
                res.redirect("/dashboard/%s/popups/".sprintf(current_project.pub_id));
            }
        } else {
            res.redirect("/dashboard/%s/popups/".sprintf(projects[0].pub_id));
        }
    }
}

exports.create = function(req, res, next) {
    res.render("dashboard/create", {
        title: "Create Project",
        js: req.js.renderTags("core"),
        css: req.css.renderTags("core"),
        forced: req.session.user.projects.empty
    });
}
