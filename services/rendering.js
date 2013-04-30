(function() {
	app.service('rendering', function($element) {
		var _renderOne = function(template, data, filters) {
			var $new = template.template.tmpl($.extend(data, filters)).addClass('rendered');
			$new.data('data', data);
			$new.data('template', template);
			$new.data('filters', filters);
			app.bindControllers($new);
			app.bindTemplates($new, $element);
			return $new;
		};

		var self = function(name, data, filters) {
			self.render(name, data, filters);
		};

		self.render = function(name, data, filters) {
			filters = filters || {};
			var template = $element[0].templates[name];
			var $placeholder = $element.find('.' + name + '-placeholder');
			if (template) {
				$placeholder.html("");
				if (data.constructor === Array) {
					$.each(data, function(idx, item) {
						$placeholder.append(_renderOne(template, item, filters));
					});
				}
				else {
					$placeholder.append(_renderOne(template, data, filters));
				}
				return $placeholder.children();
			}
		};;

		self.refresh = function($part, data) {
			$part = this.container($part);
			if (typeof data == 'undefined') {
				data = $part.data('data');
			}
			var template = $part.data('template');
			var filters = $part.data('filters');
			var $new = _renderOne(template, data, filters);
			$part.replaceWith($new);
			return $new;
		};

		self.container = function($el) {
			return $el.hasClass('rendered') ? $el : $el.parents('.rendered');
		};

		return self;
	});
})(jQuery, app);
