exports.report = function(error) {
    try {
        if(typeof error == "object") {
            if((Array.isArray(error) && !error.empty) || !$.isEmptyObject(error)) {
                console.error(error);
            }
        } else if(error) {
            console.error(error.code);

            console.error(error);
        }
    } catch(error) {
        return exports.report(error);
    }
}

exports.capture = function(data, callback) {
    /* True Means It Is On Init */
    if(data == true) {
        /* Return Blank Function */
        return function() {};
    } else {
        /*
            var data is now seen as
            error. Now check if it
            contains an error.
        */
        if(typeof callback == "function") {
            exports.report(data);
            return callback();
        } else {
            return exports.report(data);
        }
    }
}
