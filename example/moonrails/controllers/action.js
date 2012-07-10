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

var ActionController = new Class({
    Extends: Controller,
    options: {
        path: 'view',
        name: 'ActionController'
    },
    use: function(templateEngine){
        this.options.template = templateEngine;
    },
    beforeEach: function(e){
        var params = e.params || [];

        var params_list = ['<ul>'];
        _(params).each(function(i, p){
            params_list.push('<li>#' + i + ': ' + p + '</li>');
        });
        params_list.push('</ul>');
        return {parameter_list: params_list.join('')};

    },
    noAction: function(e){
        // ovveride this to handle noAction
    },
    getTemplate: function(template, data, e){

        // not necessary anymore, moved in handle method.
        //var sessionData = (typeof(Session) != 'undefined' && Session.getSession(e.SID)) || {};
        //data.session = sessionData;

        var engine = this.options.template;
        var expanded = '';

        if('compile' in engine){
            expanded = engine.compile(template)(data);
            //TODO: possible event before passing data
        }else {
            if('render' in engine){
                expanded = engine.render(template, data);
            }
        }
        return expanded;
    },
    initialize: function(options){

        var me = this;
        this.setOptions(options);
        if (! ('template' in this.options)){
            this.options.template = new SimpleTemplate();
        }
        this.parent(this.options);

        var handle = function(e){
            var params = e.params || [];
            var action = params[0] || 'index';
            var path = me.options.path + '/' + e.name;
            var name = action + '.tpl';
            if (Ask.fileExists(name, path)){
                var data = me.beforeEach(e) || {};
                /* while session is already accessible throught e.SID I want a shorcut here */
                var sessionData = (typeof(Session) != 'undefined' && Session.getSession(e.SID)) || {};
                    data.session = sessionData;
                if (action in me && typeof(me[action] == 'function')){
                    data = me[action](e, data);
                } else {
                    // no Action ?
                }
                me.handle(e, data);
            } else {
                e.handled = false;
            }
        };

        this.events.on('run', handle);
    },
    handle: function(e, data){
        var res = e.res;
        var params = e.params || [];
        var action = params[0] || 'index';
        var name = e.name + '/' + action + '.tpl';

        var me = this;

        var head = [
            ['Content-Type', 'text/html']
        ];
        e.head = head;
        Event.emit('beforeHead', e);
        res.writeHead(200, e.head);

        Ask.file(this.options.path + '/' + name, function(template){
           var expanded = me.getTemplate(template, data, e);
           res.write(expanded);
           res.end();
        });
    }

});

module.exports = ActionController;