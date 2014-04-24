module.exports = function(app, routes) {
    app.get('/dashboard', routes.dashboard.index);
}
