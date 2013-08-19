(function() {
	app.service('hash', function($element, services) {

		var service = function(map) {
			$(window).on('hashchange', function() {

				var hash = document.location.hash;
				if (hash.indexOf('#') == 0) {
					hash = hash.substr(1);
				}

				var parts = hash.split('/');
				var handler = null;
				var args;
				if (typeof map[parts[0]] !== 'undefined') {
					handler = map[parts[0]];
					args = parts.slice(1);
				}
				else if (typeof map[''] !== 'undefined') {
					handler = map[''];
					args = parts;
				}
				if (handler != null) {
					var callable;
					if (typeof handler == 'string') {
						callable = $element[0].controller[handler];
					}
					else {
						callable = handler;
					}
					callable.apply($element[0].controller, args);
				}
			});
		};

		$.extend(service, {
			bind: service,

			go: function() {
				document.location = '#' + $.makeArray(arguments).join('/');
			}
		});

		return service;
	});
})(jQuery, app);
