exports.login = function(req, res, next) {
    res.render("auth/login", {
        title: "Login",
        js: req.js.renderTags("core"),
        css: req.css.renderTags("core"),
        next: req.param("next") || ""
    });
}

exports.register = function(req, res, next) {
    res.render("auth/register", {
        title: "Register",
        js: req.js.renderTags("core"),
        css: req.css.renderTags("core")
    });
}
