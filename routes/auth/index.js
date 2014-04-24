exports.login = function(req, res, next) {
    res.render("auth/login", {
        title: "Login",
        js: req.js.renderTags("core", "auth"),
        css: req.css.renderTags("core", "auth"),
        next: req.param("next") || ""
    });
}

exports.register = function(req, res, next) {
    res.render("auth/register", {
        title: "Register",
        js: req.js.renderTags("core", "auth"),
        css: req.css.renderTags("core", "auth")
    });
}
