module.exports = function(app, routes) {
    app.get('/dashboard', routes.auth.util.restrictReload, routes.dashboard.index);
    app.get('/dashboard/create', routes.auth.util.restrictReload, routes.dashboard.create);
    app.get('/dashboard/:project', routes.auth.util.restrictReload, routes.dashboard.index);
    app.get('/dashboard/:project/:page', routes.auth.util.restrictReload, routes.dashboard.index);
    app.get('/dashboard/:project/:page/:rule', routes.auth.util.restrictReload, routes.dashboard.feedback);

    app.post('/dashboard/create', routes.auth.util.restrictXhr, routes.dashboard.util.create_project);
    app.post('/dashboard/:project/:page/', routes.auth.util.restrictReload, routes.dashboard.util.create_rule);
    app.post('/dashboard/:project/:page/:rule/update', routes.auth.util.restrictReload, routes.dashboard.util.update_rule);
    app.post('/dashboard/:project/:page/:rule/remove', routes.auth.util.restrictReload, routes.dashboard.util.remove_rule);
}
