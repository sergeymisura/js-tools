/* This service provides functions for working with forms. Two main pieces are form validation and data collection.
*
*  To access service functions, first create a form object:
*
*  var form = services.form() to access all form elements within the controller or var form = services.form(selector)
*  to restrict selection.
*
*  Method form.validate() allows you to validate data entered by the user, either using data-required attributes
*  or 'validation.test' event handlers.
*
*  <input type="text" data-required="value" />
*
*  or
*
*  services.events({ 'input.first-name': { 'validation.test': this.validateName }});
*
*  Method form.collect() allows to collect the data from the form elements.
*/
(function($, app) {

	/* Built-in validators */
	var _validationFunctions = {

		/* The element is not empty */
		value: function($source) {
			if ($.trim($source.val()) == '') {
				return 'This field cannot be empty.';
			}
		},

		/* The element (checkbox) is checked */
		checked: function($source) {
			if (!$source.prop('checked')) {
				return 'This should be checked';
			}
		},

		/* The element contains a valid email */
		email: function($source) {
			if (!/^[\+0-9a-zA-Z\-\.\_]+@([0-9a-zA-Z\-]+\.)+[0-9a-zA-Z]+$/.test($source.val())) {
				return 'Please enter a valid email address';
			}
		},

		/* The element contains integer value */
		integer: function($source) {
			if (!/^[0-9]+$/.test($source.val())) {
				return 'Please enter an integer value';
			}
		},

		/* The element contains decimal value */
		decimal: function($source) {
			if (!/^[0-9]*(\.)?[0-9]+$/.test($source.val())) {
				return 'Please enter a numeric value';
			}
		}
	};

	app.service('form', function($element, services) {

		var _displayError = function($input, messageText, showMessage) {
			var $parent = $input.parents('.control-group, .validation-group, .form-group');
			$input.addClass('invalid');
			if (showMessage) {
				$parent.addClass('invalid');
				$parent.find('.errors').html('').append(
					$('<label/>')
						.html(messageText)
						.addClass('label')
						.addClass('label-important label-danger')
				).show();
			}
		};

		var _clearError = function($input) {
			var $parent = $input.parents('.control-group, .validation-group, .form-group');
			$input.removeClass('invalid');
			$parent.removeClass('invalid');
			$parent.find('.errors').html('');
		};

		var _triggerEventsChain = function($input, type, args, defaultCallback) {
			if ($input.triggerHandler(type, args) !== true) {
				args.splice(0, 0, $input);
				if ($(app).triggerHandler(type, args) !== true) {
					defaultCallback.apply(null, args);
				}
			}
		};

		var _validateInput = function($input, showMessage) {
			if ($input.is(':visible') && !$input.prop('disabled')) {

				var testEvent = $.Event('validation.test', {
					setError: function (message) {
						this.stopImmediatePropagation();
						this.error = message;
					},

					error: null
				});

				$input.trigger(testEvent);

				if (testEvent.error) {
					_triggerEventsChain(
						$input,
						'validation.invalid',
						[testEvent.error, showMessage],
						_displayError
					);
					return false;
				}
				else {
					_triggerEventsChain(
						$input,
						'validation.clear',
						[],
						_clearError
					);
					return true;
				}
			}
			return true;
		};

		$(app).on('ready', function() {
			$('body').on('validation.test', '[data-required]', function(event) {
				var $source = $(event.target);
				var required = $source.data('required').split('|');
				var type = required[0];
				var options = required.slice(1);
				var test = _validationFunctions[type];

				var optionsMap = {};
				$.each(options, function(idx, option) {
					if (option.indexOf(':') == -1) {
						optionsMap[option] = true;
					}
					else {
						var pair = option.split(':');
						optionsMap[pair[0]] = pair[1];
					}
				});

				if (test) {
					var val = $source.val();
					if (typeof optionsMap['empty'] == 'undefined' || val != '') {
						if (typeof optionsMap['min'] !== 'undefined') {
							if (val.length < parseInt(optionsObj['min'])) {
								event.setError('This field should have at least ' + optionsObj['min'] + ' symbols.');
								return;
							}
						}
						if (typeof optionsMap['max'] !== 'undefined') {
							if (val.length > parseInt(optionsObj['max'])) {
								event.setError('This field should have maximum ' + optionsObj['max'] + ' symbols.');
								return;
							}
						}
						var result = test($source, optionsMap);
						if (result) {
							var message = $source.data('message');
							event.setError(message || result);
							return;
						}
					}
				}
			});
		});

		services.events({
			'input, textarea': {
				focus: function($source) {
					_validateInput($source, false);
				},
				keyup: function($source) {
					_validateInput($source, false);
				},
				blur: function($source) {
					_validateInput($source, true);
				}
			},
			'select': {
				change: function($source) {
					_validateInput($source, true);
				},
				focus: function($source) {
					_validateInput($source, false);
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
					$form.find('input, textarea, select').each(function(idx, element){
						result = _validateInput($(element), true) && result;
					});
					return result;
				},

				collect: function(list) {
					var data = {};
					$form.find('input[type="text"], input[type="email"], input[type="password"], select, textarea, input[type="hidden"]').each(
						function(idx, el) {
							var $el = $(el);
							if (($el.is(':visible') && !$el.prop('disabled')) || $el.attr('type') == 'hidden') {
								data[$el.attr('name')] = el.value;
							}
						}
					);
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
