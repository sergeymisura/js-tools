
var app = {};

(function($) {

	var _controllers = {};
	var _services = {};
	var _transformations = [];
	var _readyEvents = [];

	$.extend(app, {
		lastException: null,

		wrap: function(fn, context) {
			var wrappedFunction = function(){
				try {
					return fn.apply(context, arguments);
				}
				catch(e) {
					if (typeof e._stored == 'undefined') {
						e._stored = true;
						app.lastException = e;
					}
					throw e;
				}
			};
			wrappedFunction._wrapped = true;
			return wrappedFunction;
		},

		wrapObject: function(obj) {
			for(key in obj) {
				if (obj.hasOwnProperty(key)
					&& typeof obj[key] == 'function'
					&& typeof obj[key]._wrapped == 'undefined') {

					obj[key] = this.wrap(obj[key], obj);
				}
			}
			return obj;
		},

		controller: function(name, controller) {
			_controllers[name] = controller;
		},

		service: function(name, service) {
			if (typeof service == 'undefined') {
				return _services[name];
			}
			else {
				_services[name] = service;
				return service;
			}
		},

		transformation: function(selector, fn) {
			_transformations.push({
				selector: selector,
				fn: fn
			});
		},

		get: function(element) {
			var $el = $(element);
			if ($el.length) {
				return $el.get(0).controller;
			}
			return null;
		},

		compile: function($element) {
			var $result = $element;
			$.each(_transformations, function(idx, transform) {
				($element.is(transform.selector) ? $element.find(transform.selector).andSelf() : $element.find(transform.selector)).each(function(idx, el) {
					var $result = transform.fn($(el), app.services);
					if (typeof $result != 'undefined' && $result !== null) {
						$(el).replaceWith($result);
					}
				});
			});
			return $result;
		},

		ready: function(callback, context) {
			this.log('app.ready() function is deprecated. Use application\'s "ready" event instead.');
			_readyEvents.push($.proxy(callback, context));
		},

		log: function(message) {
			if (typeof console != 'undefined' && typeof console.log != 'undefined') {
				console.log(message);
			}
		}
	});

	$(document).ready(function() {

		app.services = {};
		var $element = $('body');
		$.each(_services, function(name, factory) {
			app.services[name] = app.wrapObject(factory($element, app.services));
		});

		// Should be the last transformation in the chain
		app.transformation("[data-controller]", function($element) {
			var controller = (_controllers[$element.attr('data-controller')] || $.noop);
			var element = $element.get(0);

			var services = {};

			$.each(_services, function(name, factory) {
				services[name] = app.wrapObject(factory($element, services));
			});

			element.controller = app.wrapObject(controller($element, services));
			if (typeof element.controller.init !== 'undefined') {
				element.controller.init();
			}
		});

		app.compile($('body'));
		$.each(_readyEvents, function(idx, callback) {
			callback();
		});
		$(app).triggerHandler('ready');
	});

	$(document).on('mouseup.auto-close', function(e) {
		$('[data-close="auto"]:visible').each(function(idx, el) {
			var $el = $(el);
			if ($el.has(e.target).length === 0 && !$el.is(e.target)) {
				$el.hide();
			}
		});
	});

	if (!Object.keys) {
		Object.keys = function(obj) {
			var keys = [];

			for (var i in obj) {
				if (obj.hasOwnProperty(i)) {
					keys.push(i);
				}
			}

			return keys;
		};
	}

})(jQuery);
