/* Wrapper for Mustache engine. */
(function($, app) {

	app.templateWrapper(
		'Handlebars',
		function(templateHtml)
		{
			/* Compiling template */
			var environment = Handlebars.create();
			var template = environment.compile(templateHtml);

			return function(data, filters) {
				$.each(filters, function(key, fn) {
					environment.registerHelper(key, fn);
				});

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
