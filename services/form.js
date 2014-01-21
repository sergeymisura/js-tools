(function() {
	app.service('form', function($element, services) {

		var _validationFunctions = {
			value: {
				test: function($source) {
					return $.trim($source.val()) != '';
				},
				message: 'This field cannot be empty.'
			},

			email: {
				test: function($source) {
					return /^[\+0-9a-zA-Z\-\.\_]+@([0-9a-zA-Z\-]+\.)+[0-9a-zA-Z]+$/.test($source.val());
				},
				message: 'Please enter a valid email address'
			},

			integer: {
				test: function($source) {
					return /^[0-9]+$/.test($source.val());
				},
				message: 'Please enter an integer value'
			},

			decimal:{
				test: function($source) {
					return /^[0-9]*(\.)?[0-9]+$/.test($source.val());
				},
				message: 'Please enter a numeric value'
			}
		};

		var _test = function($source) {
			var type = $source.data('required');
			return true;
		};

		var _displayError = function($source, showMessage, messageText) {
			var $parent = $source.parents('.control-group, .validation-group');
			$source.addClass('invalid');
			if (showMessage) {
				$parent.find('.errors').html('').append(
					$('<label/>').html($source.data('error-message') || messageText).addClass('label').addClass('label-important')
				).show();
			}
		};

		var _validate = function($source, showMessage) {
			var $parent = $source.parents('.control-group, .validation-group');

			if ($source.is(':visible') && !$source.prop('disabled')) {
				var required = $source.data('required').split('|');
				var type = required[0];
				var options = required.slice(1);
				var rule = _validationFunctions[type];

				var optionsObj = {};
				options = $.each(options, function(idx, option) {
					if (option.indexOf(':') == -1) {
						optionsObj[option] = true;
					}
					else {
						var pair = option.split(':');
						optionsObj[pair[0]] = pair[1];
					}
				})

				if (rule) {
					var val = $source.val();
					if (typeof optionsObj['empty'] == 'undefined' || val != '') {
						if (typeof optionsObj['min'] !== 'undefined') {
							if (val.length < parseInt(optionsObj['min'])) {
								_displayError($source, showMessage, 'This field should have at least ' + optionsObj['min'] + ' symbols.');
								return false;
							}
						}
						if (typeof optionsObj['max'] !== 'undefined') {
							if (val.length > parseInt(optionsObj['max'])) {
								_displayError($source, showMessage, 'This field should have maximum ' + optionsObj['max'] + ' symbols.');
								return false;
							}
						}
						if (!rule.test($source, optionsObj)) {
							_displayError($source, showMessage, rule.message);
							return false;
						}
					}
				}
			}
			$source.removeClass('invalid');
			$parent.find('.errors').html('');
			return true;
		}

		services.bind({
			'input[data-required], textarea[data-required]': {
				focus: function($source) {
					_validate($source, false);
				},
				keyup: function($source) {
					_validate($source, false);
				},
				blur: function($source) {
					_validate($source, true);
				}
			},
			'select[data-required]': {
				change: function($source) {
					_validate($source, true);
				},
				focus: function($source) {
					_validate($source, false);
				}
			}
		});

		var form = function(form) {
			var $form = typeof form == "string"
							? $(form)
							: (form || $element);
			return {
				validate: function() {
					var result = true;
					$form.find('[data-required]').each(function(idx, element){
						result = _validate($(element), true) && result;
					});
					return result;
				},

				displayError: function($source, messageText) {
					_displayError($source, true, messageText);
				},

				collect: function(list) {
					var data = {};
					$form.find('input[type="text"], input[type="password"], select, textarea, input[type="hidden"]').each(function(idx, el) {
						var $el = $(el);
						if (($el.is(':visible') && !$el.prop('disabled')) || $el.attr('type') == 'hidden') {
							data[$el.attr('name')] = el.value;
						}
					});
					$form.find('input[type="checkbox"],input[type="radio"]').each(function(idx, el) {
						var $el = $(el);
						if ($el.is(':visible') && $el.prop('checked') && !$el.prop('disabled')) {
							data[$el.attr('name')] = el.value;
						}
					});
					if (typeof list != 'undefined') {
						var filtered = {};
						$.each(list, function(idx, key) {
							filtered[key] = data[key] || '';
						});
						return filtered;
					}
					return data;
				}
			};
		};

		form.addRules = function (rules) {
			$.extend(_validationFunctions, rules);
		};

		return form;
	});
})(jQuery, app);
