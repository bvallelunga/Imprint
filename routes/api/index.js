exports.index = function(req, res, next) {

}

exports.check = function(req, res, next) {
    res.success({
        show: true,
        delay: 5000
    });
}

exports.feedback = function(req, res, next) {
    res.set('Content-Type', 'application/javascript');
    res.send(200, req.js.piles.feedback.rawPile);
}
