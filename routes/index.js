/*
    NOTE: This file activates the routes provided by the
    routes module.
*/

module.exports = function(app) {
    /* Gets Routes */
    require("./routes")(function(routes) {
        $.each(routes, function(index, route) {
            if(route.route) {
                /* Activates Routes */
                route.route(app, routes);
            }
        });

        app.all("*", routes.error);
    });
}
