var Q = require("q"),
    fs = require("q-io/fs"),
    parseString = require('xml2js').parseString,
    shell = require('shelljs'),
    pluginConfigFile = 'addon.xml';

var gitUrl = 'https://github.com/ArabicXBMC/plugin.video.dailytube4u.com.git',
    tagMessage = 'This is a tag message',
    name= 'Hady Osman',
    email='hadyos@gmail.com';

Q()
    .then(test)
    .then(setUser)
    //.then(readPluginConfig)
    //.then(xmlToJson)
    //.then(readPluginVersion)
    //.then(setRemoteUrl)
    //.then(fetchTags)
    //.then(tag)
    //.then(pushTags)
    .catch(function(msg){
        console.log(msg || 'release failed')
//        grunt.fail.warn(msg || 'release failed')
    })
    .done(function(){
        console.log('done', arguments);
    });

function test() {
    return Q.fcall(function () {
        console.log('shell.env', shell.env);
        run('echo $GIT_NAME');
        run('echo $GH_TOKEN', true);
    });
}

function setUser() {
    return run('git config --global user.name "' + name  + '"', true);
    return run('git config --global user.email "' + email  + '"', true);
}

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

function run(cmd, silent){
    var silent = typeof silent !== 'undefined' ? silent : false,
        deferred = Q.defer();

    //grunt.verbose.writeln('Running: ' + cmd);

    shell.exec(cmd, { silent: silent}, function(code, output){
        console.log('->', cmd);

        if (code === 0) {
            deferred.resolve();
        }
        else {
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
