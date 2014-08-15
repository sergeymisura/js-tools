(function() {
	var _defaultFilters = {
		$gravatar: function(email, size, id) {
			size = size || 80;
			id = id || 'mm';
			return 'https://secure.gravatar.com/avatar/' + md5(email) + '?s=' + size + '&d=' + id;
		},

		$phone: function(phone) {
			if (phone.length != 10) {
				return phone;
			}
			return '(' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) + ' - ' + phone.substring(6);
		},

		$date: function(date) {
			if (typeof date != 'object') {
				if (/^[0-9]{4}-[0-9][0-9]-[0-9][0-9]/.test(date)) {
					var t = date.split(/[- :]/);
					date = new Date(t[0], t[1]-1, t[2]);
				}
				else {
					date = new Date(date);
				}
			}
			return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
		}
	};

	app.service('rendering', function($element) {
		var _renderOne = function(template, data, filters) {
			var $new = template.template.tmpl($.extend($.extend(data, filters), _defaultFilters));
			if ($new.prop('tagName') == 'SCRIPT') {
				$new = $('<div />').html($new.html()).children().attr('data-template', $new.attr('data-template'));
			}
			$new.addClass('rendered');
			$new.data('data', data);
			$new.data('template', template);
			$new.data('filters', filters);
			$new.find('a[href="#"]').attr('href', 'javascript:void(0);');
			$new.addClass($new.attr('data-template') + '-rendered');
			$new.removeAttr('data-template');
			$new.removeAttr('data-template-placeholder');
			return $new;
		};

		var rendering = function(name, data, filters) {
			return rendering.render(name, data,filters);
		};

		$.extend(rendering, {
			render: function(name, data, filters) {
				filters = filters || {};
				var template = $element[0].templates[name];
				var $placeholder = $element.find('.' + name + '-placeholder');
				if (template) {
					$remove = $element.find('.' + name + '-rendered');
					if ($placeholder.length == 0) {
						$placeholder = $element.find('.' + name + '-rendered:first');
					}
					$placeholder.html("");
					if (data.constructor === Array) {
						$.each(data, function(idx, item) {
							$placeholder.append(_renderOne(template, item, filters));
						});
					}
					else {
						$placeholder.append(_renderOne(template, data, filters));
					}
					$new = $placeholder.children();
					if ($new.length == 0) {
						$new = $('<div />').addClass(name + '-placeholder');
					}
					$placeholder.replaceWith($new);
					$remove.remove();
					return app.compile($new);
				}
			},

			refresh: function($part, data) {
				$part = this.container($part);
				if (typeof data == 'undefined') {
					data = $part.data('data');
				}
				var template = $part.data('template');
				var filters = $part.data('filters');
				var $new = _renderOne(template, data, filters);
				$part.replaceWith($new);
				return app.compile($new);
			},

			container: function($el) {
				return $el.hasClass('rendered') ? $el : $el.parents('.rendered');
			}
		});
		return rendering;
	});

	app.transformation('img[data-src],audio[data-src],video[data-src]', function($element) {
		if ($element.parents('.rendered').length > 0) {
			$element.attr('src', $element.data('src'));
		}
	});

})(jQuery, app);
