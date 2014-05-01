module.exports = function(app, routes) {
    app.get('/account', routes.account.index);
    app.get('/account/:page', routes.account.index);
}
