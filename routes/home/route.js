module.exports = function(app, routes) {
    app.get('/', routes.auth.util.restrict, routes.home.index);
}
