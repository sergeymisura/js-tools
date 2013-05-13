(function($, app) {

	app.transformation('[data-template]', function($element) {
		var $placeholder = $("<div />").addClass($element.attr('data-template') + '-placeholder');
		var controllerElement = $element.closest('[data-controller]').get(0);
		if (typeof controllerElement.templates == 'undefined') {
			controllerElement.templates = [];
		}
		$element.replaceWith($placeholder);
		controllerElement.templates[$element.attr('data-template')] = { 
			template: $("<div />").append($element),
			placeholder: $placeholder
		}
	});

})(jQuery, app);
