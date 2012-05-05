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


var StandardController = new Class({
           Extends: Controller,
           options:{
               path:'view',
               name:'StandardController'
           },
           initialize:function(options){

               var me = this;
               this.setOptions(options);
               this.parent(this.options);

               var handle = function(e){
                   var name = e.name + '.tpl';
                   var path = me.options.path;

                   if(me.fileExists(name,path)){
                   //    console.log(name, path);
                       me.handle(e);
                   }else{
                       e.handled = false;
                   }
               };
               //console.log(this);
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
           handle:function(e){
               var res = e.res;
               var name = e.name + '.tpl';
               var params = e.params || [];

               var params_list = ['<ul>'];
               _(params).each(function(i,p){params_list.push('<li>#'+i+': '+p+'</li>');});
               params_list.push('</ul>');

               var kissTPL = new SimpleTemplate();

               var head = [['Content-Type','text/html']];
               e.head = head;
               Event.emit('beforeHead',e);
               res.writeHead(200, head);

               var stream = fs.ReadStream(this.options.path + '/' +name);

               stream.on('data', function(data) {
                   var sessionData = (typeof(Session) != 'undefined' && Session.getSession(e.SID)) || {};
                   var dataExpanded = kissTPL.expandTemplate(data,{session:sessionData, parameter_list:params_list.join('')});
                   res.write(dataExpanded);
               });

               stream.on('close', function () {
                   res.end();
               });

           }

});

module.exports = StandardController;