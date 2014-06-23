(function($, app) {

	app.transformation('a[href="#"]', function($element) {
		$element.attr('href', 'javascript:void(0);');
	});

	app.transformation('[data-toggle="tooltip"]', function($element) {
		$element.tooltip();
	});

	var _spinning = '<i class="icon-refresh icon-spin icon-large icon-white"></i> ';
	app.transformation('.btn-loading', function($element) {
		$element.button();
		if ($element.get(0).tagName == 'INPUT')
		{
			$element.data('loading-text', _spinning + $element.val());
		}
		else
		{
			$element.data('loading-text', _spinning + $element.html());
		}
	});

	var _spinning3 = '<i class="fa fa-spinner fa-spin"></i> ';
	app.transformation('.btn-loading-fa', function($element) {
		$element.button();
		if ($element.get(0).tagName == 'INPUT')
		{
			$element.data('loading-text', _spinning3 + $element.val());
		}
		else
		{
			$element.data('loading-text', _spinning3 + $element.html());
		}
	});

})(jQuery, app);
