(function() {
	app.service('api', function($element, services) {
		return {
			get: function(uri, data) {
				if (typeof data == 'undefined') {
					data = {}
				}
				var result = services.dereferred.create();
				$.ajax(
					app.config.baseUrl + '/api/' + uri,
					{
						data: data,
						success: result.successCallback(),
						error: result.errorCallback()
					}
				);
				return result;
			},

			post: function(uri, data) {
				if (typeof data == 'undefined') {
					data = {}
				}
				var result = services.dereferred.create();
				$.ajax(
					app.config.baseUrl + '/api/' + uri,
					{
						type: 'post',
						contentType: 'application/json',
						dataType: 'json',
						data: JSON.stringify(data),
						success: result.successCallback(),
						error: result.errorCallback()
					}
				);
				return result;
			},

			widget: function($container, uri) {
				var result = services.dereferred.create();
				$container.load(app.config.baseUrl + uri, result.successCallback());
				return result;
			}
		};
	});
})(jQuery, app);
