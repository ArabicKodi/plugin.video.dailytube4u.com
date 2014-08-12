var Q = require("q"),
    fs = require("q-io/fs"),
    parseString = require('xml2js').parseString,
    shell = require('shelljs'),
    pluginConfigFile = 'addon.xml';

var gitUrl = 'https://github.com/ArabicXBMC/plugin.video.dailytube4u.com.git',
    tagMessage = 'This is a tag message';

Q()
    .then(setRemoteUrl)
    .then(fetchTags)
    //.then(readPluginConfig)
    //.then(xmlToJson)
    //.then(readPluginVersion)
    .then(tag)
    .then(pushTags)
    .catch(function(msg){
        console.log(msg || 'release failed')
//        grunt.fail.warn(msg || 'release failed')
    })
    .done(function(){
        console.log('done', arguments);
    });

function setRemoteUrl() {
    return run('git remote set-url origin ' + gitUrl);
}

function fetchTags() {
    return run('git fetch --tags');
}

function readPluginConfig() {
    return Q.fcall(function () {
        return fs.read(pluginConfigFile)
    });
}

function xmlToJson(xml) {
    var deferred = Q.defer();

    parseString(xml, function (error, result) {
        if (error) {
            deferred.reject(new Error(error));
        }
        else {
            deferred.resolve(result);
        }
    });

    return deferred.promise;
}

function readPluginVersion(xmlDoc) {
    return Q.fcall(function () {
        return xmlDoc.addon.$.version;
    });
}

function run(cmd){
    var deferred = Q.defer();
    //grunt.verbose.writeln('Running: ' + cmd);

    shell.exec(cmd, { silent:true }, function(code, output){
        if (code === 0) {
            console.log('log: ', cmd);
            deferred.resolve();
        }
        else {
            // fail and stop execution of further tasks
            deferred.reject('Error: Failed when executing: `' + cmd + '`. Error: ' + output);
        }
    });

    return deferred.promise;
}

function tag(versionNumber){
    versionNumber = '2.3.2';
    return run('git tag ' + versionNumber + ' -m "'+ tagMessage +'"');
}

function pushTags(){
    return run('git push --tags');
}
