/*
less controller for moonrails
*/"use strict"

var Class = require('classy'),
    less = require("less"),
    fs = require('fs'),
    MoonRails = require('../moonrails');

var Controller = MoonRails.Controller;


var LessController = new Class({
    Extends:Controller,
    options:{
        name:'LessController',
        path:'less'
    },
    initialize: function(options){
        this.setOptions(options);
        this.parent(this.options);
    },
    run: function(e){
        e.handled = true;
        var res = e.res;
        res.writeHead(200, {'Content-Type':'text/css'});
        var allLess = fs.readdirSync(this.options.path);
          //
        var found = false;
        var name = e.params[0];

        for(var i= 0,max=allLess.length;i<max;i++){
          if(name==allLess[i]){
              found = true;
              break;
          };
        }

        if(found){
          var stream = fs.ReadStream(this.options.path + '/' + name);

          stream.on('data', function(data) {
          //    console.log('data', ''+data);
              less.render(''+data, function (e, css) {
                  res.write(css);
              });
          });
          stream.on('close', function () {
             res.end();
          });
        }else{
          res.end();
        }
    }
});

module.exports = LessController;