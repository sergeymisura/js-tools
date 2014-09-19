(function() {
	var _options = {
	};

	var _errorCallback = function(result) {
		var callback = result.errorCallback();
		return function(xhr, textStatus, errorThrown) {
			var data = null;
			if (xhr.getResponseHeader('Content-Type') == 'application/json') {
				try {
					data = $.parseJSON(xhr.responseText);
				}
				catch(ex) {
					data = null;
				}
			}
			if (callback(xhr.status, data, xhr)) {
				return;
			}
			if (_options.onError) {
				if (_options.onError(xhr.status, data, xhr) == false) {
					return;
				}
			}
		}
	}

	var serviceFactory = function($element, services) {
		return {
			get: function(uri, data) {
				if (typeof data == 'undefined') {
					data = {}
				}
				var result = services.deferred.create();
				$.ajax(
					app.config.baseUrl + '/api/' + uri,
					{
						data: data,
						success: result.successCallback(),
						error: _errorCallback(result)
					}
				);
				return result;
			},

			post: function(uri, data) {
				if (typeof data == 'undefined') {
					data = {}
				}
				var result = services.deferred.create();
				$.ajax(
					app.config.baseUrl + '/api/' + uri,
					{
						type: 'post',
						contentType: 'application/json',
						dataType: 'json',
						data: JSON.stringify(data),
						success: result.successCallback(),
						error: _errorCallback(result)
					}
				);
				return result;
			},

			widget: function($container, uri) {
				var result = services.deferred.create();
				$container.load(app.config.baseUrl + uri, result.successCallback());
				return result;
			}
		};
	};

	serviceFactory.options = function(options) {
		_options = $.extend(_options, options);
	};

	app.service('api', serviceFactory);
})(jQuery, app);
