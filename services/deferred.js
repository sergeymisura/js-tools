/*  */
(function() {

	var serviceFactory = function($element) {

		return function() {
			var context = $element.get(0).controller || window;

			return app.wrapObject({

				_success: $.noop,
				_error: $.noop,
				_after: $.noop,

				success: function(callback) {
					this._success = callback;
					return this;
				},

				error: function(callback) {
					this._error = callback;
					return this;
				},

				before: function(callback) {
					callback.apply(context);
					return this;
				},

				after: function(callback) {
					this._after = callback;
					return this;
				},

				successCallback: function() {
					var self = this;
					return function() {
						self._after.apply(context, arguments);
						return self._success.apply(context, arguments);
					};
				},

				errorCallback: function() {
					var self = this;
					return function() {
						self._after.apply(context, arguments);
						return self._error.apply(context, arguments);
					};
				},

				triggerSuccess: function() {
					this.successCallback().apply(null, arguments);
				},

				triggerError: function() {
					this.errorCallback().apply(null, arguments);
				}
			});
		};
	};

	if (app.config.legacy) {
		serviceFactory.create = function($element) {
			app.log('The function service.deferred.create() is deprecated. Use service.deferred() instead.')
			return serviceFactory($element);
		};
	}

	app.service('deferred', serviceFactory);

})(jQuery, app);
