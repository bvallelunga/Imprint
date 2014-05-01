exports.survey = function(req, res, next) {
    async.waterfall([
        function(callback) {
            if(req.param("project")) {
                req.models.projects.one({
                    pub_id: req.param("project")
                }, callback);
            } else {
                callback("Invalid project code");
            }
        },
        function(project, callback) {
            var cookie = project.get_cookie(req);
            cookie[req.param("closed") ? "closed" : "feedback"] = req.param("closed") || req.param("rule");
            project.set_cookie(res, cookie);


            if(req.param("closed")) {
                callback();
            } else {
                req.models.projects.rules.one({
                    pub_id: req.param("rule")
                }, function(error, rule) {
                    if(!error && rule) {
                        req.models.projects.feedback.create({
                            rating: req.param("rating"),
                            feedback: [
                                req.param("response")
                            ],
                            rule_id: rule.id
                        }, callback);
                    } else {
                        callback(error);
                    }
                });
            }
        }
    ], function(errors) {
        if(!errors) {
            res.success({
                message: "Submitted feedback"
            });
        } else {
            res.error(200, errors, errors);
        }
    });
}
