module.exports = function(app, routes) {
    app.get('/dashboard', routes.auth.util.restrictReload, routes.dashboard.index);
    app.get('/dashboard/create', routes.auth.util.restrictReload, routes.dashboard.create);
    app.get('/dashboard/:project', routes.auth.util.restrictReload, routes.dashboard.index);
    app.get('/dashboard/:project/:page', routes.auth.util.restrictReload, routes.dashboard.index);

    app.post('/dashboard/create', routes.auth.util.restrictXhr, routes.dashboard.util.create);
}
