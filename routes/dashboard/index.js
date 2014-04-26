exports.index = function(req, res, next) {
    res.render("dashboard/index", {
        title: "Dashboard",
        js: req.js.renderTags("core", "dashboard"),
        css: req.css.renderTags("core", "dashboard"),
        current_project: {}
    });
}
