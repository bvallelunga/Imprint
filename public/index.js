/*
    NOTE: this file bring all the assests into group.
    Managed by the node module piler
*/

/* Import NPM Module */
var piler = require("piler");
var fs = require("fs");

/* Initialize Piler */
var js = piler.createJSManager({ urlRoot: "/js/" });
var css = piler.createCSSManager({ urlRoot: "/css/" });

exports.init = function(app, srv) {
    //Bind to App
    js.bind(app, srv);
    css.bind(app, srv);

    //Auto Discover JS
    $.each(fs.readdirSync(__dirname + "/js/"), function(index, directory) {
        var path = __dirname + "/js/" + directory;

        if(fs.statSync(path).isDirectory()) {
            $.each(fs.readdirSync(path), function(index, file) {
                if(file != ".DS_Store") {
                    if(directory === "core") {
                        if(file === "external.txt") {
                            var links = fs.readFileSync(path + "/" + file, "utf-8").split("\n");

                            $.each(links, function(index, link) {
                                js.addUrl(link);
                            });
                        } else {
                            js.addFile(path + "/" + file);
                        }
                    } else {
                        if(file === "external.txt") {
                            var links = fs.readFileSync(path + "/" + file, "utf-8").split("\n");

                            $.each(links, function(index, link) {
                                js.addUrl(directory, link);
                            });
                        } else {
                            js.addFile(directory, path + "/" + file);
                        }
                    }
                }
            });
        }
    });

    //Auto Discover CSS
    $.each(fs.readdirSync(__dirname + "/less/"), function(index, directory) {
        var path = __dirname + "/less/" + directory;

        if(fs.statSync(path).isDirectory() && directory !== "compless") {
            $.each(fs.readdirSync(path), function(index, file) {
                if(file != ".DS_Store") {
                    if(directory === "core") {
                        css.addFile(path + "/" + file);
                    } else {
                        css.addFile(directory, path + "/" + file);
                    }
                }
            });
        }
    });
}

exports.express = function(req, res, next) {
    req.js = js;
    req.css = css;
    next();
}
