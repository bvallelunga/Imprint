exports.index = function(req, res, next) {
    res.set('Content-Type', 'application/javascript');
    res.send(200, req.js.piles.track.rawPile);
}

exports.survey = function(req, res, next) {
    if(req.param("project")) {
        req.models.projects.one({
            pub_id: req.param("project")
        }, function(error, project) {
            if(!error && project) {
                if(project.host == req.param("host")) {
                    project.rule_engine(req.param("path"), function(show, rule) {
                        if(show && rule) {
                            req.app.render("surveys/" + rule.type , {
                                header: "How's your experience been?",
                                placeholder: "your response...",
                                button: "Send Feedback"
                            }, function(error, content) {
                                res.success({
                                    csrf: req.csrfToken() || "",
                                    show: true,
                                    rule: rule.pub_id,
                                    delay: rule.delay,
                                    type: rule.type,
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
                                    },
                                    questions: {
                                        "1": "What do you hate about the site?",
                                        "2": "What could we improve on?",
                                        "3": "Do you feel any features are missing?",
                                        "4": "Have any suggestions on the site?",
                                        "5": false
                                    }
                                });
                            });
                        } else {
                            res.success({
                                show: false
                            });
                        }
                   });
               } else {
                   res.error(200, "Project host differs from source", error);
               }
           } else {
               res.error(200, "Invalid project code", error);
           }
        });
    } else {
        res.error(200, "Invalid project code");
    }
}
