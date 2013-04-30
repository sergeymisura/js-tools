(function() {
	app.service('validation', function($element, services) {

		var _validationFunctions = {
			value: {
				test: function($source) {
					return $source.val() != '';
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
					$('<label/>').html(messageText).addClass('label').addClass('label-important')
				).show();
			}
		};

		var _validate = function($source, message) {
			var $parent = $source.parents('.control-group, .validation-group');

			if ($source.is(':visible') && !$source.prop('disabled')) {
				var type = $source.data('required');
				var rule = _validationFunctions[type];
	
				if (rule) {
					if (!rule.test($source)) {
						_displayError($source, message, rule.message);
						return false;
					}
				}
			}
			$source.removeClass('invalid');
			$parent.find('.errors').html('').hide();
			return true;
		}

		services.bind({
			'input[data-required]': {
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

		var validation = function($form) {
			var result = true;
			$form.find('[data-required]').each(function(idx, element){
				result = _validate($(element), true) && result;
			});
			return result;
		};

		validation.displayError = function($source, messageText) {
			_displayError($source, true, messageText);
		};

		return validation;
	});
})(jQuery, app);
