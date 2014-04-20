exports.index = function(req, res, next) {
    res.set('Content-Type', 'application/javascript');
    res.send(200, req.js.piles.track.rawPile);
}

exports.survey = function(req, res, next) {
    req.app.render("surveys/popup", {
        header: "How Can We Help You",
    }, function(error, content) {
        res.success({
            show: (req.param("path") == "/"),
            delay: 0,
            type: "popup",
            content: content,
            assests: {
                css: $.map(req.css.renderTags("survey").split("\n"), function(script) {
                    if(script) {
                        return req.session.server + $(script).attr("href");
                    }
                }),
                js: $.map(req.js.renderTags("survey").split("\n"), function(script) {
                    if(script) {
                        return req.session.server + $(script).attr("src");
                    }
                })
            }
        });
    });
}
