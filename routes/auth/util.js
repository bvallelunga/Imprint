/* Checks */
exports.restrict = function(req, res, next) {
    if(req.session.user) {
        next();
    } else {
        res.error(401);
    }
};

exports.redirect = function(req, res, next) {
    if(req.session.user) {
        res.redirect(req.param("next") || config.general.default);
    } else {
        next();
    }
};

exports.xhr = function(req, res, next) {
    if(req.xhr) {
        next();
    } else {
        res.redirect(config.general.default);
    }
}

exports.restrictReload = function(req, res, next) {
    exports.restrict(req, res, function() {
       exports.reload(req, res, next);
    });
}

exports.restrictXhr = function(req, res, next) {
    exports.xhr(req, res, function() {
        exports.restrict(req, res, next);
    });
}

exports.restrictReloadXhr = function(req, res, next) {
    exports.xhr(req, res, function() {
        exports.restrict(req, res, function() {
           exports.reload(req, res, next);
        });
    });
}

/* Operations */
exports.login = function(req, res, next) {
    req.models.users.one({
        email: $.trim(req.param('email')),
        password: req.models.users.hash($.trim(req.param('password')))
    }, function(error, user) {
        if(!error && user) {
            req.session.user = user;
            req.session.save();

            res.success({
                next: req.param("next") || config.general.default
            });
        } else {
            res.failure({
                message: "Invalid Credentials"
            });
        }
    });
}

exports.logout = function(req, res) {
    delete req.session.user;
    req.session.save();
    res.redirect('/');
};

exports.register = function(req, res, next) {
    req.models.users.exists({
        email: req.param('email')
    }, function(error, exists) {
        if(error || exists) {
            res.json({
                sucess: false,
                error_message: "Email Already Exists"
            });
        } else {
            req.models.users.create({
                name: $.trim(req.param('name')),
                email: $.trim(req.param('email')),
                password: $.trim(req.param('password'))
            }, function(error, user) {
                if(!error) {
                    req.session.user = user;
                    req.session.save();

                    res.success({
                        next: req.param("next") || config.general.default
                    });

                } else {
                    res.failure({
                        message: "Failed to Register"
                    });
                }
            });
        }
    });
};

/* Refresh Session */
exports.reload = function(req, res, next) {
    if(req.session.user) {
        req.models.users.get(req.session.user.id, function(error, user) {
            if(!error && user) {
                res.locals.user = user;
                req.session.user = user;
                req.session.save(next);
            } else {
                next();
            }
        });
    } else {
        next();
    }
}
