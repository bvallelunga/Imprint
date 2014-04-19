module.exports = function(app, routes) {
    app.get('/feedback.js', routes.api.feedback);

    //app.get('/api/v1', routes.api.index);
    app.get('/api/v1/check', routes.api.check);
}
