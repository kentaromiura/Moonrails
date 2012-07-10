/*
Assets controller for moonrails
*/"use strict"

var Class = require('../../classy'),
    Ask = require('../utils/ask'),
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
       e.handled = true;
       var res = e.res;
       res.writeHead(200, {'Content-Type':'binary/octet-stream'});
       var params = e.params || ['not_exists'];
       if(Ask.fileExists(params[0], this.options.path)){

          var filename = this.options.path + '/' + params[0];
          Ask.binaryFile(filename, function(data){
              console.log(filename,'...', data);
            res.write(data);
            res.end();
          });
       }else{
           res.end();
       }

   }
});

module.exports = AssetsController;