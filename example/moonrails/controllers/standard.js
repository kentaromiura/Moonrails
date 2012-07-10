/*
 Standard controller for moonrails
 */
"use strict"

var Class = require('../../classy'),
    MoonRails = require('../moonrails'),
    Ask = require('../utils/ask'),
    SimpleTemplate = require('./../utils/simpletemplate');

var Session = global.Session;
var Event = global.Event;

var Controller = MoonRails.Controller;

var StandardController = new Class({
    Extends: Controller,
    options: {
        path: 'view',
        name: 'StandardController'
    },
    use: function(templateEngine){
        this.options.template = templateEngine;
    },
    initialize: function(options){

        var me = this;
        this.setOptions(options);
        this.parent(this.options);
        if (!('template' in this.options)){
            this.options.template = new SimpleTemplate();
        }

        var handle = function(e){
            var name = e.name + '.tpl';
            var path = me.options.path;

            if (Ask.fileExists(name, path)){
                //    console.log(name, path);
                me.handle(e);
            } else {
                e.handled = false;
            }
        };

        //console.log(this);
        this.events.on('run', handle);
    },
    handle: function(e){
        var res = e.res;
        var name = e.name + '.tpl';
        var params = e.params || [];
        var me = this;
        var params_list = ['<ul>'];
        _(params).each(function(i, p){
            params_list.push('<li>#' + i + ': ' + p + '</li>');
        });
        params_list.push('</ul>');

        var head = [
            ['Content-Type', 'text/html']
        ];
        e.head = head;
        Event.emit('beforeHead', e);
        res.writeHead(200, e.head);

        var filename = this.options.path + '/' + name;
        Ask.file(filename, function(data){
            var sessionData = (typeof(Session) != 'undefined' && Session.getSession(e.SID)) || {};
            var engine = me.options.template, expanded = '';
            var json = {session: sessionData, parameter_list: params_list.join('')};
            if ('compile' in engine){
                expanded = engine.compile('' + data)(json);
                //TODO: possible event before passing data
            } else {
                if ('render' in engine){
                    expanded = engine.render('' + data, json);
                }
            }

            res.write(expanded);
            res.end();
        });

    }

});

module.exports = StandardController;