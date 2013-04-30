(function() {
	app.service('dereferred', function($element) {
		return {
			create: function() {
				return {
					success: function(callback, context) {
						this._success = $.proxy(callback, context);
						return this;
					},

					error: function(callback, context) {
						this._error = $.proxy(callback, context);
						return this;
					},

					before: function(callback, context) {
						$.proxy(callback, context)();
						return this;
					},

					after: function(callback, context) {
						this._after = $.proxy(callback, context);
						return this;
					},

					successCallback: function() {
						return $.proxy(function() {
							(this._after || $.noop).apply(null, arguments);
							(this._success || $.noop).apply(null, arguments);
						}, this);
					},

					errorCallback: function() {
						return $.proxy(function() {
							(this._after || $.noop).apply(null, arguments);
							(this._error || $.noop).apply(null, arguments);
						}, this);
					}
				}
			}
		}
	});
})(jQuery, app);
