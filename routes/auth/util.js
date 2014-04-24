/* Checks */
exports.restrict = function(req, res, next) {
    if(req.session.user) {
        next();
    } else {
        res.redirect("/login/?next=" + req.url);
    }
};

exports.xhr = function(req, res, next) {
    if(req.xhr) {
        next();
    } else {
        res.redirect(config.general.default);
    }
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

            res.json({
                success: true,
                next: req.param("next") || config.general.default
            });
        } else {
            res.json({
                success: false,
                error_message: "Invalid Credentials"
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

                    res.json({
                        success: true,
                        next: req.param("next") || config.general.default
                    });

                } else {
                    res.json({
                        success: false,
                        error_message: "Failed to Register"
                    });
                }
            });
        }
    });
};
