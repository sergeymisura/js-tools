
var app = {};

(function($) {
	

	var _controllers = {};
	var _services = {};

	var _servicesFactory = function($element) {
		var services = {};
		$.each(_services, function(name, factory) {
			services[name] = factory($element, services);
		});
		return services;
	};

	$.extend(app, {
		controller: function(name, controller) {
			_controllers[name] = controller;
		},

		get: function(selector) {
			var $el = $('body').find(selector);
			if ($el.length) {
				return $el.get(0).controller;
			}
			return null;
		},

		service: function(name, service) {
			_services[name] = service;
		},

		bindControllers: function($scope) {
			$scope.find("[data-controller]").each(function(idx, element) {
				var $element = $(element);
				var controller = (_controllers[$element.attr('data-controller')] || $.noop);

				element.templates = {};

				app.bindTemplates($element, $element);

				element.controller = controller($element, _servicesFactory($element));
				if (typeof element.controller.init !== 'undefined') {
					element.controller.init();
				}
			});
		},

		bindTemplates: function($scope, $controllerElement) {
			if (typeof $controllerElement == 'undefined') {
				$controllerElement = $scope.attr('data-controller') ? $scope : $scope.parents('data-controller');
			}
			$scope.find("[data-template]").each(function(idx, template) {
				var $placeholder = $("<div />").addClass($(template).attr('data-template') + '-placeholder'); 
				$(template).replaceWith($placeholder)
				$controllerElement.get(0).templates[$(template).attr('data-template')] = { 
					template: $("<div />").append($(template)),
					placeholder: $placeholder
				}
			});
		}
	});

	$(document).ready(function() {
		$("[data-toggle='tooltip']").tooltip();

		app.bindControllers($('body'));
		$('a[href="#"]').attr('href', 'javascript:void(0);');
	});
})(jQuery);
