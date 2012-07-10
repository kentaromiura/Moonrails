/*
 Favicon controller for moonrails
 */
"use strict"

var Class = require('../../classy'),
    Ask = require('../utils/ask'),
    MoonRails = require('../moonrails');

var Controller = MoonRails.Controller;

var FaviconController = new Class({
    Extends: Controller,
    options: {
        path: '/',
        name: 'favicon'
    },
    initialize: function(options){
        this.setOptions(options);
        this.parent(this.options);
    },
    run: function(e){
        e.handled = true;
        var res = e.res;
        res.writeHead(200, {'Content-Type': 'image/vnd.microsoft.icon'})

        if (Ask.fileExists('favicon.ico', this.options.path)){
            var filename = this.options.path + '/' + 'favicon.ico';
            Ask.binaryFile(filename, function(data){
                res.write(data);
                res.end();
            });
        } else {
            res.end();
        }

    }
});

module.exports = FaviconController;