module.exports = function(app, routes) {
    app.get('/track.js', routes.track.index);
    app.get('/track/v1', routes.track.survey);
}
