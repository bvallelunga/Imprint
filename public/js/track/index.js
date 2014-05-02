(function(window, document) {
    /* Defaults */
    var url = "//track.getimprint.io/v1/";
    var script = document.getElementById("imprint-js");

    /* Library */
    var request = function(params, action, callback) {
        var xhr,
            full_url = url,
            full_params = "";

        params.project = script.getAttribute("data-key");
        params.host = window.location.hostname;
        params.path = window.location.pathname;
        params.port = window.location.port;

        for (var key in params) {
            if(full_params != "") {
                full_params += "&";
            }

            if(params[key]) {
                full_params += key + "=" + encodeURIComponent(params[key]);
            }
        }

        if(action == "GET") {
            full_url += "?" + full_params;
        }

        if(typeof XMLHttpRequest !== 'undefined') {
            xhr = new XMLHttpRequest();
        } else {
            var versions = [
                "MSXML2.XmlHttp.5.0",
                "MSXML2.XmlHttp.4.0",
                "MSXML2.XmlHttp.3.0",
                "MSXML2.XmlHttp.2.0",
                "Microsoft.XmlHttp"
            ];

            for(var i = 0, len = versions.length; i < len; i++) {
                try {
                    xhr = new ActiveXObject(versions[i]);
                    break;
                } catch(e) {
                    return callback(false);
                }
            }
        }

        if(typeof callback == "function") {
            xhr.onreadystatechange = function() {
                if(xhr.readyState < 4 || xhr.status !== 200) {
                    return callback(false);
                } else if(xhr.readyState === 4) {
                    return callback(xhr.response);
                } else {
                    return callback(false);
                }
            }
        }

        xhr.withCredentials = true;
        xhr.open(action, full_url, true);
        xhr.responseType = "json";

        if(action != "GET") {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }

        xhr.send(full_params);
    }

    var insertAssests = function(assests) {
        assests.css.forEach(function(href) {
            var link = document.createElement('link');
            link.href = href;
            link.rel = "stylesheet";
            document.head.appendChild(link);
        });

        assests.js.forEach(function(src) {
            var script = document.createElement('script');
            script.src = src;
            script.type = "text/javascript";
            document.head.appendChild(script);
        });
    }

    var insertContent = function(content) {
        document.body.innerHTML += content;
    }

    var handleResponse = function(data) {
        var _this = this;

        if(data != false) {
            if(data.success && data.show) {
                insertAssests(data.assests);
                insertContent(data.content);

                var interval = setInterval(function() {
                    if(window.Imprint) {
                        clearInterval(interval);
                        setTimeout(function() {
                            window.Imprint.activate(request, data);
                        }, data.delay);
                    }
                }, 10);
            }
        }
    }

    /* Initalize */
    request({}, "GET", handleResponse);
})(window, document);
