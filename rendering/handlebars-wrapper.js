/* Wrapper for Mustache engine. */
(function($, app) {

	/* Handlebars-specific helpers */
	var _additionalHelpers = {
		inc: function(value) {
			return value + 1;
		},
		equals: function(a, b, options) {
			return a == b ? options.fn(this) : options.inverse(this);
		}
	};

	app.templateWrapper(
		'Handlebars',
		function(templateHtml)
		{
			/* Compiling template */
			var environment = Handlebars.create();
			var template = environment.compile(templateHtml);
			var registerHelper = $.proxy(environment.registerHelper, environment);

			$.each(_additionalHelpers, registerHelper);

			return function(data, filters) {
				$.each(filters, registerHelper);

				/* Rendering template */
				var $result = $(template(data));

				$.each(filters, function(key) {
					environment.unregisterHelper(key);
				});

				return $result;
			}
		}
	);

})(jQuery, app);
