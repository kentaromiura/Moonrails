/*
server.js
*/"use strict"


/* Not required for this example, its here for testing purpose */
var prime = require("prime")
var type = require("prime/util/type")
var emitter = require("prime/util/emitter")

var map = require("prime/collection/map")
var list = require("prime/collection/list")
var hash = require("prime/collection/hash")

var string = require("prime/types/string")
var number = require("prime/types/number")

var ghost = require("prime/util/ghost")

var fs = require('fs');


prime.type = type

prime.map = map
prime.list = list
prime.hash = hash

prime.string = string
prime.number = number

global._ = ghost
global.prime = prime

global.emitter = emitter

/* - not required - */

var Class = require('classy');
var MoonRails = require('moonrails/moonrails');
var SessionHandler = require('moonrails/session/cookie');

/* Application code */


var Event = MoonRails.Event;
global.Event = Event;

var Options = MoonRails.Options;
var Controller = MoonRails.Controller;


/* Session handler is optional */
var Session = new SessionHandler({}, Event);
global.Session = Session;

/* custom controller section*/

var StandardController = require('moonrails/controllers/standard');
var LessController = require('moonrails/controllers/less');
var FaviconController = require('moonrails/controllers/favicon');
var AssetsController = require('moonrails/controllers/assets');
var ActionController = require('moonrails/controllers/action');

/* end controllers */

/* -main- */

var test = new StandardController({name:'test'});
var index_controller = new StandardController({name:'index'});
var no_controller = new StandardController({name:'404'});

/* example assets controller */
var assets = new AssetsController({name:'assets'});

/*
this is an example of how simple is to integrate node.js code. require less, to install it just type:
 install with:
  npm install less
*/
var less_controller = new LessController({name:'less'});

var favicon = new FaviconController();

/* Latest addition, ActionController */
var about_controller = new ActionController({name:'about'});

(new MoonRails.Router({port:80})).run();
