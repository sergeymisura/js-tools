
var app = {};

(function($) {

	var _controllers = {};
	var _services = {};
	var _transformations = [];

	$.extend(app, {
		controller: function(name, controller) {
			_controllers[name] = controller;
		},

		service: function(name, service) {
			_services[name] = service;
		},

		transformation: function(selector, fn) {
			_transformations.push({
				selector: selector, 
				fn: fn
			});
		},

		get: function(selector) {
			var $el = $('body').find(selector);
			if ($el.length) {
				return $el.get(0).controller;
			}
			return null;
		},

		compile: function($element) {
			if (typeof $controllerElement == 'undefined') {
				$controllerElement = $element.attr('data-controller') ? $element : $element.parents('data-controller');
			}
			var $result = $element;
			$.each(_transformations, function(idx, transform) {
				($element.is(transform.selector) ? $element.find(transform.selector).andSelf() : $element.find(transform.selector)).each(function(idx, el) {
					var $result = transform.fn($(el));
					if ($result !== null) {
						$(el).replaceWith($result);
					}
				});
			});
			return $result;
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
