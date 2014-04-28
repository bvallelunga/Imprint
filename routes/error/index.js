var error_handler = function(status, message, req, res) {
    var error_message;
    var error_html;
    var redirect_url;

    switch(status) {
        case 401:
            error_message = "Login Required";
            redirect_url = "/login/?next=" + req.url;
            break;
        case 403:
            error_message = "Access Forbidden";
            error_html = 'Access Forbidden';
            delete req.session._csrf;
            req.session.save();
            break;
        case 500:
            error_message = "Internal Server Error";
            error_html = 'Sorry we are having<br>technical difficulties';
            break;
        default:
            error_message = (message) ? message : "404";
            error_html = (message) ? message : '404!<br>Looking for something?';
            break;
    }

    if(error_html) {
        if(error_html.split(". ").length > 1) {
            error_html = (error_html.slice(-1) == ".") ? error_html : error_html + ".";
        } else {
            error_html = (error_html.slice(-1) == ".") ? error_html.slice(0, -1) : error_html;
        }
    }

    if(req.xhr) {
        res.failure({
            message: error_message
        });
    } else {
        res.status(status);
        res.format({
            'text/plain': function() {
                res.send(error_message + "\n");
            },
            'text/html': function() {
                if(redirect_url) {
                    res.redirect(redirect_url);
                } else {
                    res.render('error/index', {
                        host: req.host,
                        title: error_message,
                        mode: error_message,
                        js: req.js.renderTags("core", "error"),
                        css: req.css.renderTags("core", "error"),
                        error: error_html
                    });
                }
            },
            'application/json': function() {
                res.failure({
                    message: error_message
                });
            }
        });
    }
}

exports.global = function(error, req, res, next) {
    if(error) {
        if(config.general.production) {
            error_handler(500, null, req, res);
        } else {
            error_handler(500, error.message, req, res);
        }

        lib.error.capture(error);
    } else {
        next();
    }
};

exports.express = function(req, res, next) {
    res.error = function(status, message, error) {
        error_handler(status, message, req, res);
        lib.error.capture(error);
    }
    next();
};

exports.notfound = function(req, res, next) {
    error_handler(404, null, req, res);
}
