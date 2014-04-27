var url = require('fast-url-parser');

exports.create = function(req, res, next) {
    var host = req.param("host").toLowerCase();

    if(host.indexOf("http://") == -1 || host.indexOf("https://") == -1) {
        host = "http://" + host;
    }

    req.models.projects.create({
        name: req.param("name"),
        host: url.parse(host).hostname,
        owner_id: req.session.user.id
    }, function(error, project) {
        if(!error && project) {
            res.success({
                next: "/dashboard/%s/".sprintf(project.pub_id)
            });
        } else {
            res.error(200, "Failed to Create Project", error);
        }
    });
}
