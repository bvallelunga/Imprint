/* Import NPM Modules */
var fs         = require("fs");
var express    = require("express");
var device     = require("express-device");
var slashes    = require("connect-slashes");
var subdomains = require('express-subdomains');
var app        = express();
var ejs        = require("ejs");
var RedisStore = require("connect-redis")(express);

/* IMPORTANT - Global Variables */
GLOBAL.$       = require("jquery");
GLOBAL.async   = require("async");
GLOBAL.config  = require("./config");
GLOBAL.lib     = require("./lib");

/* Create Server */
if(config.general.ssl) {
    var srv = require('https').createServer({
        key: fs.readFileSync('./credentials/imprint.key'),
        cert: fs.readFileSync('./credentials/imprint.crt'),
        ca: fs.readFileSync('./credentials/gandi.pem')
    }, app);
} else {
    var srv = require('http').createServer(app);
}

/* Initialize Lib */
lib.init(ejs);

/* Install Crontab */
require("./cron")(__dirname);

/* Express: Configuration */
app.configure(function() {
    //HTML Engine
    app.engine("html", ejs.renderFile);

    //Global Config
    app.set("views", __dirname + "/views");
    app.set("view engine", "html");
    app.set("view options", { layout: true });
    app.set("view cache", true);
    app.set("x-powered-by", false);

    //Piler Assests
    require("./public").init(app, srv);
    app.use(require("./public").express);

    //Direct Assests
    app.use("/favicon", express.static(__dirname + "/public/favicons"));
    app.use("/fonts", express.static(__dirname + "/public/fonts"));
    app.use("/img", express.static(__dirname + "/public/images"));

    //External Addons
    app.use(slashes(true));
    app.use(device.capture());

    //Logger & Cookie
    app.use(express.logger("dev"));
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser(config.cookies.session.secret));
    app.use(express.session({
        key: config.cookies.session.key,
        secret: config.cookies.session.secret,
        store: new RedisStore({
            client: lib.redis
        })
    }));
    app.use(express.csrf());

    //Initialize Models
    app.use(lib.models);

    //Setup Subdomains
    async.each(config.general.subdomains, function(subdomain, next) {
        if(subdomain != "") {
            subdomains.use(subdomain);
        }

        next();
    }, function() {
        app.use(subdomains.middleware);
    });

    //Setup Express Error Handling
    app.use(require("./routes/error").express);

    //Setup Globals
    app.use(require("./routes/globals"));
});

/* Development Only */
app.configure('development', function() {
    //Debug Toolbar
    require('express-debug')(app, {
        theme: __dirname + config.development.debugger.theme,
        panels: config.development.debugger.panels
    });
});

/* Production Only */
app.configure('production', function() {
    //Last Resort Error Handling
    process.on('uncaughtException', function(exception) {
        lib.error.capture(exception);
        return false;
    });
});

/* Activate Routes */
require("./routes")(app);

/* Start Router */
app.use(app.router);

//Setup Global Error Handling
app.use(require("./routes/error").global);

/* Lister To Server */
if(config.general.ssl) {
    srv.listen(config.general.ports.https);

    /* HTTP -> HTTPS Redirect */
    express().use(function(req, res) {
        res.redirect("https://" + req.host + req.url);
    }).listen(config.general.ports.http);
} else {
    srv.listen(config.general.ports.http);
}
