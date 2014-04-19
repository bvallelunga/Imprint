exports.index = function(req, res, next) {
    res.set('Content-Type', 'application/javascript');
    res.send(200, req.js.piles.track.rawPile);
}

exports.check = function(req, res, next) {
    res.success({
        show: true,
        delay: 5000
    });
}

exports.survey = function(req, res, next) {
    res.render("survey", {
        js: req.js.renderTags("survey"),
        css: req.css.renderTags("survey")
    });
}
