module.exports = function(req, res, next) {
    //Set Server Root For Non Express Calls
    req.session.server = req.protocol + "://" + req.host;
    req.verified = (req.host.split(".").slice(-2).join(".") == config.general.security);

    if(!config.general.production || !config.random) {
        config.random = Math.floor((Math.random()*1000000)+1);
    }

    //Header Config
    res.header("Server", config.general.company);
    res.header('Access-Control-Allow-Credentials', false);
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    //Device Info
    var device = req.device.type.toLowerCase();
    req.mobile = ["phone", "tablet"].indexOf(device) != -1;
    req.robot = (device == "bot");
    req.tv = (device == "tv");
    req.location = lib.geoip(req.ip) || {
        city: null,
        region: null,
        country: null,
        ll: [null, null]
    };

    //Success JSON Response
    res.success = function(data) {
        if(Array.isArray(data)) {
            data = {
                success: true,
                content: data
            }
        } else {
            data.success = true;
        }

        res.json(data);
    }

    //Failure JSON Response
    res.failure = function(data) {
        if(Array.isArray(data)) {
            data = {
                success: false,
                content: data
            }
        } else {
            data.success = false;
        }

        res.json(data);
    }

    //Locals
    res.locals.csrf = req.csrfToken() || "";
    res.locals.production = config.general.production;
    res.locals.host = req.session.server;
    res.locals.hostname = req.host;
    res.locals.title = "";
    res.locals.site_title = config.general.company;
    res.locals.site_delimeter = config.general.delimeter.web;
    res.locals.description = config.general.description.join("");
    res.locals.company = config.general.company;
    res.locals.config = {};
    res.locals.icons = config.icons;
    res.locals.user = req.session.user;
    res.locals.title_first = true;
    res.locals.location = req.location;
    res.locals.random = "?rand=" + config.random;
    res.locals.logos = {
        "logo":  res.locals.host + "/img/logo.png",
        "graph": res.locals.host + "/favicon/196.png",
        "1000":  res.locals.host + "/favicon/1000.png",
        "500":   res.locals.host + "/favicon/500.png",
        "196":   res.locals.host + "/favicon/196.png",
        "160":   res.locals.host + "/favicon/160.png",
        "114":   res.locals.host + "/favicon/114.png",
        "72":    res.locals.host + "/favicon/72.png",
        "57":    res.locals.host + "/favicon/57.png",
        "32":    res.locals.host + "/favicon/32.png"
    };

    //Redirect
    if(req.subdomains.indexOf('www') === -1) {
        next();
    } else {
        res.redirect(req.protocol + "://" + req.host.split(".").slice(1).join(".") + req.path);
    }

    //Session Save
    req.session.save();
}
