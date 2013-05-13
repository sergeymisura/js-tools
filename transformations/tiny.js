(function($, app) {

	app.transformation('a[href="#"]', function($element) {
		$element.attr('href', 'javascript:void(0);');
	});

	app.transformation('[data-toggle="tooltip"]', function($element) {
		$element.tooltip();
	});

})(jQuery, app);
