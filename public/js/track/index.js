(function() {
    /* Library */
    this.url = "http://localhost/track/v1/";
    this.script = document.getElementById("imprint-js");
    this.params = [
        "user=" + script.getAttribute("data-key"),
        "show=" + script.getAttribute("data-show"),
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

    this.handleResponse = function(data) {
        var _this = this;

        if(data != false) {
            data = JSON.parse(data);

            if(data.success && data.show) {
                console.log(data);
            }
        }
    }

    /* Initalize */
    this.request(this.url, this.params, this.handleResponse);
})();
