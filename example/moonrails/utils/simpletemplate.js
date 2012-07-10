/*
Simple template engine
really, is simple and is a template engine.
*/"use strict"

var Class = require('../../classy');

var SimpleTemplate = new Class({
 compile: function(template){
   var me = this;

   return function(data){
       return me.render(template, data);
   }
 },
 render: function(template, data){
        return (''+template).replace(/\{(.*?)\}/g, function(match, capture){
            var current = data, error = false;

                var tree = capture.split('.');
                for(var i=0,max=tree.length;i<max;i++){
                    if(current[tree[i]]){
                        current = current[tree[i]];
                    }else{
                        error = true;
                        break;
                    }
                }
                if(error){
                    return match;
                }else{
                    return ''+current;
                }
        });
    }
});
module.exports = SimpleTemplate;