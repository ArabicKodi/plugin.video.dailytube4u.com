var Q = require("q"),
    fs = require("q-io/fs"),
    parseString = require('xml2js').parseString,
    shell = require('shelljs'),
    pluginConfigFile = 'addon.xml';

var gitUrl = 'https://github.com/ArabicXBMC/plugin.video.dailytube4u.com.git',
    tagMessage = 'This is a tag message',
    envName = 'GIT_NAME',
    envEmail = 'GIT_EMAIL',
    envToken = 'GH_TOKEN';

Q()

    //.then(readPluginConfig)
    //.then(xmlToJson)
    //.then(readPluginVersion)

    .then(setUserInfo)
    .then(writeGitCredentials)
    .then(setRemoteUrl)
    .then(fetchTags)
    .then(tag)
    .then(pushTags)
    .catch(function(msg){
        console.log(msg || 'release failed')
//        grunt.fail.warn(msg || 'release failed')
    })
    .done(function(){
        console.log('done', arguments);
    });



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

    shell.exec(cmd, { silent: true}, function(code, output){
        if (code === 0) {
            console.log('->', cmd);
            console.log('#', output);
            deferred.resolve();
        }
        else {
            deferred.reject('Error: cmd: `' + cmd + '`\n       stderr: ' + output);
        }
    });

    return deferred.promise;
}

function setUserInfo() {
    var name = shell.env[envName] || 'Hady',
        email = shell.env[envEmail] || 'hadyos@gmail.com';

    return Q.all([
        run('git config --global user.name "' + name  + '"'),
        run('git config --global user.email "' + email  + '"')
    ]);
}

function writeGitCredentials() {
    var token = shell.env[envToken];
    return Q()
        .then(function(){
            return run('git config credential.helper "store --file=.git/credentials"');
        })
        .then(function(){
            return run('echo "https://' + token + ':@github.com" > .git/credentials');
        });
}

function setRemoteUrl() {
    return run('git remote set-url origin ' + gitUrl);
}

function fetchTags() {
    return run('git fetch --tags');
}

function tag(versionNumber){
    versionNumber = '2.3.3';
    return run('git tag ' + versionNumber + ' -m "'+ tagMessage +'"');
}

function pushTags(){
    return run('git push --tags');
}
