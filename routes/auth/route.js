module.exports = function(app, routes) {
    app.get('/', routes.auth.util.redirect, routes.auth.login);
    app.get('/login', routes.auth.util.redirect, routes.auth.login);
    app.get('/register', routes.auth.util.redirect, routes.auth.register);
    app.get('/logout', routes.auth.util.logout);

    app.post('/login', routes.auth.util.redirect, routes.auth.util.xhr, routes.auth.util.login);
    app.post('/register', routes.auth.util.redirect, routes.auth.util.xhr, routes.auth.util.register);
}
