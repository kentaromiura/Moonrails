/*
Standard controller for moonrails
*/"use strict"

var Class = require('classy'),
    MoonRails = require('../moonrails'),
    fs = require('fs'),
    SimpleTemplate = require('./simpletemplate');

var Session = global.Session;
var Event = global.Event;

var Controller = MoonRails.Controller;


var kissTPL = new SimpleTemplate();

var ActionController = new Class({
           Extends: Controller,
           options:{
               path:'view',
               name:'ActionController'
           },
           beforeEach: function(e){
               var params = e.params || [];

               var params_list = ['<ul>'];
               _(params).each(function(i,p){params_list.push('<li>#'+i+': '+p+'</li>');});
               params_list.push('</ul>');
               return {parameter_list:params_list.join('')};

           },
           noAction:function(e){
               // ovveride this to handle noAction
           },
           getTemplate:function(template, data, e){

               var sessionData = (typeof(Session) != 'undefined' && Session.getSession(e.SID)) || {};
               data.session = sessionData;

               var expanded = kissTPL.expandTemplate(template, data);
               return expanded;
           },
           initialize:function(options){

               var me = this;
               this.setOptions(options);
               this.parent(this.options);

               var handle = function(e){
                   var params = e.params || [];
                   var action = params[0] || 'index';
                   var path = me.options.path +'/'+ e.name;
                   var name = action + '.tpl';
                   //console.log('file exists', name, path);
                   if(me.fileExists(name,path)){
                       var data = me.beforeEach(e) || {};
                       if(action in me){
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
           fileExists : function(name, dir){
               var found = false;
               var allFiles = fs.readdirSync(dir);

               for(var i= 0,max=allFiles.length;i<max;i++){
                   if(name==allFiles[i]){
                       found = true;
                       break;
                   };
               }
               return found;
           },
           handle:function(e, data){
               var res = e.res;
               var params = e.params || [];
               var action = params[0] || 'index';
               var name = e.name + '/'+ action + '.tpl';

               var me = this;

               var head = [['Content-Type','text/html']];
               e.head = head;
               Event.emit('beforeHead',e);
               res.writeHead(200, head);

               var stream = fs.ReadStream(this.options.path + '/' +name);

               stream.on('data', function(template) {
                   var expanded = me.getTemplate(template, data, e);
                   res.write(expanded);
               });

               stream.on('close', function () {
                   res.end();
               });

           }

});

module.exports = ActionController;