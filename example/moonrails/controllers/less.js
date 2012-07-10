/*
 less controller for moonrails
 */
"use strict"

var Class = require('../../classy'),
    less = require("less"),
    Ask = require('../utils/ask'),
    MoonRails = require('../moonrails');

var Controller = MoonRails.Controller;

var LessController = new Class({
    Extends: Controller,
    options: {
        name: 'LessController',
        path: 'less'
    },
    initialize: function(options){
        this.setOptions(options);
        this.parent(this.options);
    },
    run: function(e){
        e.handled = true;
        var res = e.res;
        res.writeHead(200, {'Content-Type': 'text/css'});

        var name = e.params[0];
        if (Ask.fileExists(name, this.options.path)){
            var filename = this.options.path + '/' + name;
            Ask.file(filename, function(data){
                less.render(data, function(e, css){
                    res.write(css);
                    res.end();
                })
            })
        } else {
            res.end();
        }
    }
});

module.exports = LessController;