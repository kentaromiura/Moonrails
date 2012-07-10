/*
MVC Wannabe for prime
*/"use strict"

var Class = require('../classy'),
    emitter = require("prime/util/emitter"),
    http = require('http');


var Event = new emitter();

var Options = new Class({
    setOptions: function(options){
        this.options = this.options || (this.options = {});
        for(var key in options){
            this.options[key] = options[key];
        }
    }
});

var Controller = new Class({
        Implements:[Options],
        options:{
            name: 'Controller'
        },
        registerController: function(){
                //console.log('registerController '+this.options.name);
                var me = this;
                Event.on('Controller:'+this.options.name, function(e){me.run(e)});
        },
        initialize: function(options){
            //console.log(options);
            this.events = new emitter();
            //console.log(this.events);
            this.setOptions(options);
            this.registerController();
        },
        run:function(e){
            //console.log('running ' +this.options.name);
            e.handled = true;

            this.events.emit('run',e);
        }
});

var Router = new Class ({
    Implements:[Options],
    options:{
        port:80
    },
    run:function(){
        console.log('moonrails is listening @localhost:' + this.options.port);
        this.server.listen(this.options.port);
    },
    initialize:function(options, server){
        this.setOptions(options);
        if(server){
            this.server = server;
        } else {
            this.server = http.createServer(function(req, res){

                console.log(req.url);
                var param = {request: req, response: res};
                Event.emit('request', param);
                var cookies = [];
                var sessionID = null;

                if(param.cookies){
                    for(var name in param.cookies){
                        cookies.push(name,'=',param.cookies[name],';');
                    }
                };
                cookies.pop();

                if(param.SID){
                    sessionID = param.SID;
                }

                if(req.url.indexOf('favicon.ico')!=-1){
                    var params = {res:res,handled:false};
                    Event.emit('Controller:favicon', params);
                    if(!params.handled)res.end();

                }else{

                    var route = req.url.split('/');
                    var params = {res:res, name:(route[1]||''), handled:false, cookies: cookies.join(''), SID : sessionID};

                    if(route.length >2){
                        params.params = route.slice(2);
                        //console.log('emit Controller:'+params.name);
                        Event.emit('Controller:' + params.name, params);
                    }else{
                        params.params = [];
                        //console.log('emit Controller:'+params.name);
                        Event.emit('Controller:' + params.name, params);
                    }
                    if(!params.handled){
                        if(req.url == '/'){
                            params.name = 'index'; // needed
                            Event.emit('Controller:index', params);
                        }else{
                            params.name = '404';
                            Event.emit('Controller:404', params);
                            if(!params.handled){
                                // 404 fallback
                                var head = [['Content-Type','text/html']];
                                var e = {head : head};
                                Event.emit('beforeHead',e);

                                res.writeHead(200, head);
                                res.write('404');
                                res.end();
                            }
                        }
                    }

                }
            });
        }
    }
});


var kentaMVC = {
    Event: Event,
    Controller: Controller,
    Options: Options,
    Router: Router
};

module.exports = kentaMVC;
