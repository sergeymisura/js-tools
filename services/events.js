(function() {
	app.service('events', function($element, services) {
		return function(target, map) {
			var $target;
			if (typeof map == 'undefined') {
				map = target;
				$target = $element;
			}
			else {
				$target = $(target);
				map[''] = {};
				$.each(map, function(selector, value) {
					if (typeof value == 'function') {
						map[''][selector] = value;
						delete map[selector];
					}
				});
			}
			$.each(map, function(selector, value) {
				if (typeof value == 'string' || typeof value == 'function') {
					value = {
						click: value
					};
				}
				$.each(value, function(event, method) {

					var handler = function(ev) {

						var $this = $(this);
						var callable;

						if (typeof method == 'string') {
							callable = $element[0].controller[method];
						}
						else {
							callable = method;
						}

						var args = [].slice.call(arguments);
						var $this = $(this);
						args.unshift($this);
						ev.data = services.rendering.container($this).data('data');

						return callable.apply($element[0].controller, args);
					};

					$target.on(event, selector, handler);
				});
			});
		};
	});
})(jQuery, app);
