exports.survey = function(req, res, next) {
    if(req.param("project")) {
        req.models.projects.one({
            pub_id: req.param("project")
        }, function(error, project) {
            if(!error && project) {
                if(project.host == req.param("host")) {
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
                            }, function(error, feedback) {
                                if(!error && feedback) {
                                    res.success({
                                        message: "Submitted feedback"
                                    });
                                } else {
                                    res.error(200, "Failed to submit feedback", error);
                                }
                            });
                        } else {
                            res.error(200, "Failed to submit feedback", error);
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
