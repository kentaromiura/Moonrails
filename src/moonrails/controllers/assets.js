/*
Assets controller for moonrails
*/"use strict"

var Class = require('classy'),
    fs = require('fs'),
    MoonRails = require('../moonrails');

var Controller = MoonRails.Controller;

var AssetsController = new Class({
   Extends: Controller,
   options:{
       path:'assets',
       name:'AssetsController'
   },
   initialize: function(options){
       this.setOptions(options);
       this.parent(this.options);
   },
   run:function(e){
       //console.log('running ' +this.options.name);
       e.handled = true;
       var res = e.res;
       res.writeHead(200, {'Content-Type':'binary/octet-stream'});

       var allAssets = fs.readdirSync(this.options.path);
       //
       var found = false;
       for(var i= 0,max=allAssets.length;i<max;i++){
           if(e.params[0]==allAssets[i]){
               found = true;
               break;
           };
       }

       if(found){
           var stream = fs.ReadStream(this.options.path + '/' + e.params[0]);

           stream.on('data', function(data) {
               res.write(data);
           });
           stream.on('close', function () {
               res.end();
           });
       }else{
           res.end();
       }

   }
});

module.exports = AssetsController;