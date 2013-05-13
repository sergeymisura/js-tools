(function($, app) {

	app.transformation('select[data-selected]', function($element) {
		$element.val($element.data('selected'));
	});

	app.transformation('input[type="checkbox"][data-checked]', function($element) {
		var value = $element.data('checked');
		$element.prop('checked', value == '1' || value == 'true' || value == 'checked');
	});

})(jQuery, app);
