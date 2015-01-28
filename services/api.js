/* This module provide some wrapping around JSON-based AJAX calls */
(function() {

	/* A factory for the internal error handler */
	var _errorCallbackFactory = function(result) {
		return function(xhr, textStatus, errorThrown) {
			var data = xhr.responseJSON;

			$(app).trigger('api.error', [xhr.status, data, xhr]);

			if (result.triggerError(xhr.status, data, xhr)) {
				return;
			}

			/* If the error wasn't processed by the .error() callback, we trigger a global status */
			$(app).trigger('api.error.unhandled', [xhr.status, data, xhr]);
		}
	};

	var serviceFactory = function($element, services) {
		return {

			/* A wrapper for HTTP GET call */
			get: function(uri, data) {
				if (typeof data == 'undefined') {
					data = {}
				}
				var result = services.deferred();
				$.ajax(
					app.config.baseUrl + app.config.apiUrl + '/' + uri,
					{
						data: data,
						success: result.successCallback(),
						error: _errorCallbackFactory(result)
					}
				);
				return result;
			},

			/* A wrapper for HTTP POST call */
			post: function(uri, data) {
				if (typeof data == 'undefined') {
					data = {}
				}
				var result = services.deferred();
				$.ajax(
					app.config.baseUrl + app.config.apiUrl + '/' + uri,
					{
						type: 'post',
						contentType: 'application/json',
						dataType: 'json',
						data: JSON.stringify(data),
						success: result.successCallback(),
						error: _errorCallbackFactory(result)
					}
				);
				return result;
			}
		};
	};

	app.service('api', serviceFactory);
})(jQuery, app);
