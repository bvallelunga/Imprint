exports.index = function(req, res, next) {
    res.render("account/index", {
        title: "Account",
        js: req.js.renderTags("core"),
        css: req.css.renderTags("core"),
        page: req.param("page") || "account"
    });
}
