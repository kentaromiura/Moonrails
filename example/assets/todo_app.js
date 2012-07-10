/*
---

name: Router

license: MIT-style license.

authors: [Radovan Lozej, DimitarChristoff]

requires:
 - Core/DOMEvent
 - Core/Class

provides: Router

inspiration: http://documentcloud.github.com/backbone/#Router

...
*/
;(function() {

    var hc = 'hashchange',
        hcSupported = !!(('on' + hc) in window),
        eventHosts = [window, document],
        getQueryString = function(queryString) {
            var result = {},
                re = /([^&=]+)=([^&]*)/g,
                m;

            while (m = re.exec(queryString)) {
                result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            }

            return result;
        };

    Element.Events.hashchange = {
        // Cross browser support for onHashChange event - http://github.com/greggoryhz/MooTools-onHashChange-Event/
        onAdd: function () {
            var hash = location.hash,
                check = function () {
                    if (hash == location.hash)
                        return;

                    hash = location.hash;
                    eventHosts.invoke('fireEvent', hc, hash.indexOf('#') == 0 ? hash.substr(1) : hash);
                };

            (hcSupported && (window.onhashchange = check)) || check.periodical(100);
        }
    };


    // Router
    this.Router = new Class({

        Implements: [Options, Events],

        options: {
            triggerOnLoad : true // check route on load
        },

        routes: {
            // '#!path/:query/:id?': 'eventname',
        },

        initialize: function(options) {
            var self = this;

            this.setOptions(options);
            this.options.routes && (this.routes = this.options.routes);

            window.addEvent(hc, function(e) {
                var hash = location.hash,
                    path = hash.split('?')[0],
                    query = hash.split('?')[1] || '',
                    notfound = true,
                    route;

                for(route in self.routes) {
                    var keys = [],
                        regex = self.normalize(route, keys, true, false),
                        found = regex.exec(path),
                        routeEvent = false;

                    if (found) {
                        notfound = false;
                        self.req = found[0];

                        var args = found.slice(1),
                            param = {};

                        Array.each(args, function(a, i) {
                            typeof keys[i] !== 'undefined' && (param[keys[i].name] = a);
                        });

                        self.route = route;
                        self.param = param || {};
                        self.query = query && getQueryString(query);

                        // find referenced events
                        routeEvent = self.routes[route];

                        // generic before route, pass route id, if avail
                        self.fireEvent('before', routeEvent);

                        // if there is an identifier and an event added
                        if (routeEvent && self.$events[routeEvent]) {
                            // route event was defined, fire specific before pseudo
                            self.fireEvent(routeEvent + ':before');
                            // call the route event handler itself, pass params as arguments
                            self.fireEvent(routeEvent, Object.values(self.param));
                        }
                        else {
                            // requested route was expected but not found or event is missing
                            self.fireEvent('error', ['Route', routeEvent, 'is undefined'].join(' '));
                        }

                        // fire a generic after event
                        self.fireEvent('after', routeEvent);

                        // if route is defined, also fire a specific after pseudo
                        routeEvent && self.fireEvent(routeEvent + ':after');
                        break;
                    }
                }

                notfound && self.fireEvent('undefined');

            });

            this.fireEvent('ready');
            this.options.triggerOnLoad && window.fireEvent(hc);
        },

        navigate: function(route, trigger) {
            if (location.hash == route && trigger) {
                window.fireEvent(hc);
            }
            else {
                location.hash = route;
            }
        },

        normalize: function(path, keys, sensitive, strict) {
            // normalize by https://github.com/visionmedia/express
            if (path instanceof RegExp) return path;

            path = path.concat(strict ? '' : '/?').replace(/\/\(/g, '(?:/').replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional) {

                keys.push({
                    name: key,
                    optional: !! optional
                });

                slash = slash || '';

                return [
                    (optional ? '' : slash),
                    '(?:',
                    (optional ? slash : ''),
                    (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')',
                    (optional || '')
                ].join('');
            }).replace(/([\/.])/g, '\\$1').replace(/\*/g, '(.*)');

            return new RegExp('^' + path + '$', sensitive ? '' : 'i');
        }

    });

}());



window.addEvent('domready', function(){

    var App = new Router({
        // routes definition
        routes: {
            '': 'index',
            '#/toggle/:id':'toggle',
            '#/clear':'clear-completed',
            '#/active': 'filter-active',
            '#': 'filter-all',
            '#/completed': 'filter-completed',
            '#/add/:todo' : 'add',
            '#/edit/:id': 'todo-edit'
        }

    });

    var filters = ['a[href=#/active]','a[href=#/completed]','a[href=#/]'].map(function(selector){
        return $$(selector)[0];
    });

    var filterhandler = function(i){
        return function(e){
                Array.each(filters, function(filter){
                    filter.removeClass('selected');
                });
                filters[i].addClass('selected');
        }
    };

    App.addEvent('filter-active', filterhandler(0));
    App.addEvent('filter-active', function(){alert('')
        $$('#todo-list li').removeClass('hidden');
        $$('#todo-list li.completed').addClass('hidden');
    })

    App.addEvent('filter-completed', filterhandler(1));
    App.addEvent('filter-completed', function(){
        $$('#todo-list li').addClass('hidden');
        $$('#todo-list li.completed').removeClass('hidden');
    });

    App.addEvent('filter-all', filterhandler(2));
    App.addEvent('filter-all', function(){
        $$('#todo-list li').removeClass('hidden');
    })


    App.addEvent('add', function(){
        var value = $('new-todo').get('value');
        alert('todo-add:' + value);
    });

    App.addEvent('todo-edit', function(id){
        alert('todo-add:' + todo);
    });

    App.addEvent('clear', function(which){
        if(which){
            alert('clear :'+which);
        }
    })

    App.addEvent('toggle', function(id){
        //alert('toggle: '+id);
        var activeFilter = $$('#filters a.selected')[0];
        alert(activeFilter.get('href'));
    })


    $$('form').each(function(form){
        //alert(form.outerHTML);

        form.addEvent('submit', function(e){
            e.stop();
            var action = form.get('action');
            var params = action.split('/');

            if(params.length == 1){
                App.fireEvent(form.get('action'));
            }else{
                App.fireEvent(params[0], params[1]);
            }
        })
    })



});