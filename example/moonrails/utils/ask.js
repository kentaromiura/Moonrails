/*
 Simple template engine
 really, is simple and is a template engine.
 */
"use strict"

var fs = require('fs');
var Class = require('../../classy');

var Ask = new Class({
    file: function(filename, callback){
        var stream = fs.ReadStream(filename);
        var data = [];
        stream.on('data', function(bits){
            data.push(bits);
        });
        //TODO: handle error.
        stream.on('close', function(){
            callback(data.join(''));
        });
    },
    binaryFile: function(filename, callback){
        fs.readFile(filename, function(err, data){
            callback(data);
        });
        /*
        var stream = fs.ReadStream(filename);
        var data = null;

        stream.on('data', function(bits){
            //console.log(filename,'---');
            data = bits;
        });

        stream.on('close', function(){
            callback(data);
        });
        */
    },
    fileExists: function(name, dir){
        var found = false;
        var allFiles = fs.readdirSync(dir);

        for (var i = 0, max = allFiles.length; i < max; i++){
            if (name == allFiles[i]){
                found = true;
                break;
            }
        }
        return found;
    }
});

module.exports = new Ask();