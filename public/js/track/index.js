(function() {
    /* Library */
    this.host = "http://localhost/track/v1/"; //Development
    //this.host = "http://track.imprint.com/v1/"; //Production

    this.script = document.getElementById("imprint-js");
    this.params = [
        "user=" + script.getAttribute("data-key"),
        "host=" + encodeURIComponent(window.location.hostname),
        "path=" + encodeURIComponent(window.location.pathname),
        "port=" + encodeURIComponent(window.location.port)
    ].join("&");

    this.request = function(url, params, callback) {
        var  xhr;

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

        xhr.onreadystatechange = function() {
            if(xhr.readyState < 4 || xhr.status !== 200) {
                return callback(false);
            } else if(xhr.readyState === 4) {
                return callback(xhr.responseText);
            } else {
                return callback(false);
            }
        }

        xhr.open('GET', url + "?" + params, true);
        xhr.send();
    }

    this.url = function(url) {
        if(url) {
            return this.host + url + "/";
        } else {
            return this.host;
        }
    }

    this.createIframe = function(callback) {
        this.iframe = document.createElement("iframe");
        this.iframe.setAttribute("allowtransparency", "true");

        this.iframe.src = this.url();
        this.iframe.frameBorder = "0";
        this.iframe.style.width = "100%";
        this.iframe.style.height = "100%";
        this.iframe.style.display = "none";
        this.iframe.style.position = "fixed";
        this.iframe.style.top = "0";
        this.iframe.style.left = "0";
        this.iframe.style.zIndex = "999999";
        this.iframe.style.backgroundColor = "transparent";
        this.iframe.style.border = "0 none transparent";
        this.iframe.style.overflowX = "hidden";
        this.iframe.style.overflowY = "auto";
        this.iframe.style.visibility = "visible";
        this.iframe.style.margin = "0";
        this.iframe.style.padding = "0";
        this.iframe.style.webkitTapHighlightColor = "transparent";
        this.iframe.onload = callback;

        window.document.body.appendChild(this.iframe);
    }

    this.open = function() {
        this.iframe.style.display = "block";
        this.iframe.contentWindow.postMessage("open", this.url());
    }

    this.close = function() {
        this.iframe.style.display = "none";
    }

    this.handleResponse = function(data) {
        var _this = this;

        if(data != false) {
            data = JSON.parse(data);

            if(data.success && data.show) {
                _this.createIframe(function() {
                    setTimeout(_this.open, data.delay);
                });
            }
        }
    }

    this.message = function(e) {
        this[e.data]();
    }

    /* Initalize */
    this.request(this.url("check"), this.params, this.handleResponse);

    /* Add Event Listeners */
    window.addEventListener('message', this.message, false);
})();
