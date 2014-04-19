module.exports = function(req, res, next) {
    res.render("404", {
        title: "404",
        js: req.js.renderTags(),
        css: req.css.renderTags()
    });
}
