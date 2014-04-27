(function(window, document) {
    /* Defaults */
    this.csrf = "";
    this.url = "//track.getimprint.io/v1/";
    this.script = document.getElementById("imprint-js");

    /* Library */
    this.request = function(params, action, callback) {
        var xhr,
            full_url = this.url,
            full_params = "";

        params.csrf = this.csrf;
        params.project = this.script.getAttribute("data-key");
        params.show = (script.getAttribute("data-show") === "true");
        params.host = window.location.hostname;
        params.path = window.location.pathname;
        params.port = window.location.port;

        for (var key in params) {
            if(full_params != "") {
                full_params += "&";
            }

            full_params += key + "=" + params[key];
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
                    return callback(xhr.responseText);
                } else {
                    return callback(false);
                }
            }
        }

        xhr.open(action, full_url, true);

        if(action != "GET") {
            full_params = encodeURI(full_params);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        }

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
    this.request({}, "GET", this.handleResponse);
})(window, document);
