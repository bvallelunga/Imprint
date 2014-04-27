module.exports = function(app, routes) {
    app.get('/dashboard', routes.auth.util.restrict, routes.dashboard.index);
    app.get('/dashboard/create', routes.auth.util.restrictReload, routes.dashboard.create);
    app.get('/dashboard/:project', routes.auth.util.restrict, routes.dashboard.index);

    app.post('/dashboard/create', routes.auth.util.restrict, routes.dashboard.util.create);
}
