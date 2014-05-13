(function() {

	var create = function() {
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
					return (this._success || $.noop).apply(null, arguments);
				}, this);
			},

			errorCallback: function() {
				return $.proxy(function() {
					(this._after || $.noop).apply(null, arguments);
					return (this._error || $.noop).apply(null, arguments);
				}, this);
			},

			triggerSuccess: function() {
				this.successCallback().apply(null, arguments);
			},

			triggerError: function() {
				this.errorCallback().apply(null, arguments);
			}
		}
	};

	var deferred = function($element) {
		return {
			create: create
		};
	};
	app.service('deferred', deferred);

	// Left for the backward compatibility
	app.service('dereferred', function($element) {
		return {
			create: function() {
				app.log('"dereferred" service is misspelled and deprecated. Use "deferred" service instead.');
				return create();
			}
		};
	});
})(jQuery, app);
