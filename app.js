
var app = {};

(function($) {

	var _controllers = {};
	var _services = {};
	var _transformations = [];
	var _readyEvents = [];

	$.extend(app, {
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
					var $result = transform.fn($(el));
					if (typeof $result != 'undefined' && $result !== null) {
						$(el).replaceWith($result);
					}
				});
			});
			return $result;
		},

		ready: function(callback, context) {
			_readyEvents.push($.proxy(callback, context));
		}
	});

	$(document).ready(function() {

		// Should be the last transformation in the chain
		app.transformation("[data-controller]", function($element) {
			var controller = (_controllers[$element.attr('data-controller')] || $.noop);
			var element = $element.get(0);

			var services = {};

			$.each(_services, function(name, factory) {
				services[name] = factory($element, services);
			});

			element.controller = controller($element, services);
			if (typeof element.controller.init !== 'undefined') {
				element.controller.init();
			}
		});

		app.compile($('body'));
		$.each(_readyEvents, function(idx, callback) {
			callback();
		});
	});

	$(document).on('mouseup.auto-close', function(e) {
		$('[data-close="auto"]:visible').each(function(idx, el) {
			var $el = $(el);
			if ($el.has(e.target).length === 0 && !$el.is(e.target)) {
				$el.hide();
			}
		});
	});

})(jQuery);
