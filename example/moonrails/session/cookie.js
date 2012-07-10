/*
Cookie session handler for moonrails
*/"use strict"

var Class = require('../../classy');
var MoonRails = require('../moonrails');
var Options = MoonRails.Options;

var CookieSessionHandler= new Class({
   Implements:[Options],
   options:{
        timeout:10000
   },
   timestamp: function(){return +new Date();},
   rand: function(min,max){
       return Math.floor((Math.random()*max)+min);
   },
   beforeHead: function(e){
       var head = e.head || [];

       var cookies = (e.cookies||'').split(';')
       for(var i= 0,max=cookies.length;i<max;i++){
           head.push(['Set-Cookie',cookies[i]]);
       }
   },
   initialize: function(options, Event){
        var me = this;
        me.setOptions(options);
        Event.on('beforeHead', this.beforeHead);
        var Application = {};
        this.Application = Application;
        var UID = this.$uid || (this.$uid = 0);

        Event.on('request', function(e){
            var timestamp = me.timestamp();
            var request = e.request, response = e.response;
            var secret, mySID;
            var cookies = (request.headers.cookie || '').split(';');

            for(var i= 0,max=cookies.length;i<max;i++){
                var data = cookies[i].split('=');
                switch(data[0].replace(/\s/g,'')){
                    case 'secret':
                        secret = data[1];
                        break;
                    case 'SID':
                        mySID = data[1];
                    break;
                }
            }

            if(mySID && (!(mySID in Application) || Application[mySID].secret != secret || Application[mySID].timeout < timestamp)){
                mySID = secret = null;
            }

            secret = secret || me.rand(0,timestamp).toString(36);
            mySID = mySID || 'ID' + (me.$uid++).toString(36);
            var currentSession = Application[mySID] || (Application[mySID] = {}) ;

            //refresh timeout && secret
            currentSession.timeout = (+new Date()) + me.options.timeout;
            currentSession.secret = secret;
            currentSession.SID = mySID;

            //send updated cookie
            var cookie = e.cookies || (e.cookies ={});
            cookie.secret = secret;
            cookie.SID = mySID;
            cookie.expires = new Date(currentSession.timeout).toUTCString();
            currentSession.cookie = cookie;
            //to pass around the session-id
            e.SID = mySID;
            me.clean();
        });
   },
   getSession:function(id){
       if(id in this.Application){
           return this.Application[id];
       } else {
           return {};
       }
   },
   clean:function(){
       var now = +new Date();
       var Application = this.Application;
       for(var sessionID in Application){
           if(Application[sessionID] && 'timeout' in Application[sessionID] && now > Application[sessionID].timeout){
                delete Application[sessionID];
               console.log('cleaning',sessionID)

           }
       }
   }
});

module.exports = CookieSessionHandler;