/*
Favicon controller for moonrails
*/"use strict"

var Class = require('classy'),
    fs = require('fs'),
    MoonRails = require('../moonrails');

var Controller = MoonRails.Controller;

var FaviconController = new Class({
    Extends:Controller,
    options:{
        path:'/',
        name:'favicon'
    },
    initialize:function(options){
        this.setOptions(options);
        this.parent(this.options);
    },
    run:function(e){
       e.handled = true;
       var res = e.res;
       res.writeHead(200, {'Content-Type':'image/vnd.microsoft.icon'})

       var allAssets = fs.readdirSync(this.options.path);
       //
       var found = false;
       for(var i= 0,max=allAssets.length;i<max;i++){
           if('favicon.ico'==allAssets[i]){
               found = true;
               break;
           };
       }

       if(found){
           var stream = fs.ReadStream(this.options.path + 'favicon.ico');

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

module.exports = FaviconController;