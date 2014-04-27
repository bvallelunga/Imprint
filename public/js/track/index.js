(function(window, document) {
    /* Defaults */
    this.csrf = "";
    this.url = "//track.getimprint.io/v1/";
    this.script = document.getElementById("imprint-js");
    this.params = {
        project: script.getAttribute("data-key"),
        show: (script.getAttribute("data-show") === "true"),
        host: window.location.hostname,
        path: window.location.pathname,
        port: window.location.port
    };

    /* Library */
    this.request = function(params, action, callback) {
        var xhr,
            full_url = this.url,
            full_params = "";

        for (var key in params) {
            if(full_params != "") {
                full_params += "&";
            }

            full_params += key + "=" + params[key];
        }

        if(action == "GET") {
            full_url += "?" + full_params;
        } else if(action == "POST") {
            params.csrf = this.csrf;
            params.user = this.params.user;
            params.host = this.params.host;
            params.path = this.params.path;
            params.port = this.params.port;
        }

        params = encodeURI(params);

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
                    return callback(xhr.responseText);
                } else {
                    return callback(false);
                }
            }
        }

        xhr.open(action, full_url, true);
        xhr.send(full_params);
    }

    this.insertAssests = function(assests) {
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

    this.insertContent = function(content) {
        document.body.innerHTML += content;
    }

    this.handleResponse = function(data) {
        var _this = this;

        if(data != false) {
            data = JSON.parse(data);
            _this.csrf = data.csrf;

            if(data.success && (this.show || data.show)) {
                this.insertAssests(data.assests);
                this.insertContent(data.content);

                var interval = setInterval(function() {
                    if(window.Imprint) {
                        clearInterval(interval);
                        setTimeout(function() {
                            window.Imprint.activate(_this, data);
                        }, data.delay);
                    }
                }, 10);
            }
        }
    }

    /* Initalize */
    this.request(this.params, "GET", this.handleResponse);
})(window, document);
