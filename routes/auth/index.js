exports.login = function(req, res, next) {
    res.render("auth/login", {
        title: "Log In",
        js: req.js.renderTags("auth"),
        css: req.css.renderTags("auth"),
        next: req.param("next") || ""
    });
}

exports.register = function(req, res, next) {
    res.render("auth/register", {
        title: "Register",
        js: req.js.renderTags("auth"),
        css: req.css.renderTags("auth"),
        next: req.param("next") || ""
    });
}
