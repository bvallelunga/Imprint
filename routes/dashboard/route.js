module.exports = function(app, routes) {
    app.get('/dashboard', routes.auth.util.restrict, routes.auth.util.reload, routes.dashboard.index);
}
