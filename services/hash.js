(function($, app) {
	/* Service that simplifies work with 'hash' portions of urls */
	app.service('hash', function($element, services) {

		/* Sets the functions to handle changes in the hash portions of the URL.
		 * The first part of the hash will be used to determine the handler and the rest will be passed to the handler
		 * as arguments. */
		var service = function(map) {
			var hashChangeHandler = function() {

				var hash = document.location.hash;
				if (hash.indexOf('#') == 0) {
					hash = hash.substr(1);
				}

				var queryString = '';
				if (hash.indexOf('?') != -1) {
					queryString = hash.substr(hash.indexOf('?') + 1);
					hash = hash.substr(0, hash.indexOf('?'));
				}

				var parts = queryString.split('&');
				var query = {};
				for (var i = 0; i < parts.length; i++) {
					var pair = parts[i].split('=');
					query[decodeURIComponent(pair[0])] = decodeURIComponent(pair.length > 1 ? pair[1] : '');
				}

				parts = hash.split('/');
				var handler = null;
				if (typeof map[parts[0]] !== 'undefined') {
					handler = map[parts[0]];
				}
				else if (typeof map[''] !== 'undefined') {
					handler = map[''];
				}
				if (handler != null) {
					var callable;
					if (typeof handler == 'string') {
						callable = $element[0].controller[handler];
					}
					else {
						callable = handler;
					}
					parts.splice(0, 0, { hash: hash, queryString: queryString, query: query });
					callable.apply($element[0].controller, parts);
				}
			};

			$(window).on('hashchange', hashChangeHandler);

			if (document.location.hash != '') {
				hashChangeHandler();
			}
		};

		$.extend(service, {
			/* Just an alias for the binding function */
			bind: service,

			/* Sets the hash portion of the URL by combining the arguments.
			 * services.hash.go(['user', 2]) will set the URL to #users/2 */
			go: function() {
				document.location = '#' + $.makeArray(arguments).join('/');
			}
		});

		return service;
	});
})(jQuery, app);
