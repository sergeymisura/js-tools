(function($, app) {

	var templateTransformation = function($element) {
		// We don't need to process it if it is detached from the body.
		if ($element.parents('body').length == 0) {
			return;
		}
		$element.find('[data-template]').each(function(idx, el) {
			templateTransformation($(el));
		});
		var $placeholder = $("<div />").addClass($element.attr('data-template') + '-placeholder');
		var controllerElement = $element.closest('[data-controller]').get(0);
		if (controllerElement)
		{
			if (typeof controllerElement.templates == 'undefined') {
				controllerElement.templates = [];
			}
			$element.replaceWith($placeholder);
			controllerElement.templates[$element.attr('data-template')] = { 
				template: $("<div />").append($element),
				placeholder: $placeholder
			}
		}
	};

	app.transformation('[data-template]', templateTransformation);

})(jQuery, app);
