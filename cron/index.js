var crontab = require('crontab');
var path = require('path');
var util = require('util');

module.exports = function(root_dir) {
    crontab.load(function(err, tab) {
        require('npm').load(function (err, npm) {
            //Get Path
            var npmPrefix = npm.config.get('prefix');
            var npmBinRoot = path.join(npmPrefix, 'bin');
            var nodePath = process.execPath.split('/').slice(0, -1).join('/');
            var exportCommand = 'export PATH=' + nodePath + ':$PATH';
            var nodeCommand = exportCommand + " && node --max-old-space-size=1000 ";

            //Start (On Reboot)
            var foreverCommand = path.join(npmBinRoot, 'forever');
            var startLocation = path.join(root_dir, "/start.js");
            var startCommand = util.format('%s && %s start %s', exportCommand, foreverCommand, startLocation);

            tab.remove(tab.findComment("imprint_middleware"));
            tab.create(startCommand, "imprint_middleware").everyReboot();

            //Save Crontab
            tab.save();
        });
    });
}
