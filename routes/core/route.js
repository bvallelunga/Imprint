module.exports = function(app, routes) {
    app.get('/feedback.js', routes.core.feedback);
}
