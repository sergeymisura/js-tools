/* Application's initialization code  */
(function($, app) {

	/* Wrapping application's functions, so they will already be called within the context of 'app' object */
	app.wrapObject(app);

	/* Everything is loaded, it's time to start! */
	$(document).ready(function() {

		var $body = $('body');

		/* Instantiating global services */
		app.services = app.createServices($body);

		/* Adding the transformation that creates controllers.
		 * The reason it is not in the /transformations folder is that it should be called AFTER all other
		 * transformations. */
		app.transformation("[data-controller]", function($element) {
			app.createController($element.get(0));
		});

		/* First round of transformations */
		app.compile($body);

		/* Old-style 'ready' event */
		if (app.config.legacy) {
			$.each(_readyEvents, function(idx, callback) {
				callback();
			});
		}

		/* New 'ready' event */
		$(app).triggerHandler('ready');
	});

	/* Shouldn't be there. Deprecated. */
	if (app.config.legacy) {
		$(document).on('mouseup.auto-close', function(e) {
			$('[data-close="auto"]:visible').each(function(idx, el) {
				var $el = $(el);
				if ($el.has(e.target).length === 0 && !$el.is(e.target)) {
					$el.hide();
				}
			});
		});
	}

	/* Adding Object.keys support for older browsers. */
	if (!Object.keys) {
		Object.keys = function(obj) {
			var keys = [];

			for (var i in obj) {
				if (obj.hasOwnProperty(i)) {
					keys.push(i);
				}
			}

			return keys;
		};
	}

})(jQuery, app);
