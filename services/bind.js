(function() {
	app.service('bind', function($element, services) {
		return function(map) {
			$.each(map, function(selector, value) {
				$.each(value, function(event, method) {
					$element.on(event, selector, function(ev) {
						var $this = $(this);
						var callable = typeof method == 'string' ? $element[0].controller[method] : method;
						return $.proxy(callable, $element[0].controller)($this, services.rendering.container($this).data('data'), ev);
					});
				});
			});
		};
	});
})(jQuery, app);
