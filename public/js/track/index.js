(function(window, document) {
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

    this.insertAssests = function(assests) {
        document.head.innerHTML += assests.css;

        assests.js.forEach(function(src) {
          var script = document.createElement('script');
          script.src = src;
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

            if(data.success && data.show) {
                this.insertAssests(data.assests);
                this.insertContent(data.content);

                var interval = setInterval(function() {
                    if(window.Imprint) {
                        clearInterval(interval);
                        setTimeout(function() {
                            window.Imprint.activate(data.type);
                        }, data.delay);
                    }
                }, 10);
            }
        }
    }

    /* Initalize */
    this.request(this.url, this.params, this.handleResponse);
})(window, document);
