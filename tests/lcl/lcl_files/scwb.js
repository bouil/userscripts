// some useful functions for strings
String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, '') }
String.prototype.reverse = function() { return this.split('').reverse().join('') }
String.prototype.escapeHtml = function() { this.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/&/g,"&amp;") }

Date.prototype.setToMidnight = function() { this.setHours(0); this.setMinutes(0); this.setSeconds(0); this.setMilliseconds(0); return this; };

// map for IE
if(!Array.prototype.map) Array.prototype.map = function(func) {
	return $.map(this, func);
};

var SCWB = {
	debug: false,
	integrationtests: false,
	utils: {
		/**
		*	Stricter parseInt function. (Base 10).
		*	@param str The string to parse, that should contain only digits.
		*/
		parseInt: function(str) {
			var trimed = str ? str.toString().trim() : '';
			return trimed && /^-?\d+$/.test(trimed) ? parseInt(trimed.replace(/^0+/, '') || 0) : NaN;
		},
		/**
		*	Stricter parseFloat function. (Base 10).
		*	@param The string to parse, that should contain only digits and at most one '.' or ',' character.
		*/
		parseFloat: function(str) {
			var trimed = str ? str.toString().trim() : '';
			return trimed && /^-?[\d]+([.,][\d]+)?$/.test(trimed) ? parseFloat(trimed.replace(/^0+/,'').replace(',', '.') || 0) : NaN;
		}
	},
	
	/**
	 * Impression.
	 * @param url URL de la ressource à imprimer (en GET). Si vide, page courante.
	 */
	print: function(url, callback) {
		if(!url && !SCWB.integrationtests) {
			window.print();
		} else {
			var $iframe = $('#__SCWB_printFrame');
			if(!$iframe[0]) {
				$('body').append('<iframe id="__SCWB_printFrame" style="position: absolute; left: -3000px; top: -3000px"></iframe>');
				$iframe = $('#__SCWB_printFrame');
			}
			$iframe.attr('src', url);
			try {
				$iframe.unbind('load');
				$iframe.load(function() {
					if(!SCWB.integrationtests)
						$iframe[0].contentWindow.print();
					if(typeof callback === 'function') {
						setTimeout(function(){
							callback.call($iframe[0]);
						}, 100);
					}
				});
			} catch (e) {
				SCWB.log('Error while requesting printing, the url "' + url + '" may not be on the same server. Exception : ', e);
			}
		}
	},
	
	validation: {
		forms: [],
		
		/**
		*	A Rule.
		*	@param field Parent field object (the field containing this rule).
		*	@param func This rule's function.
		*	@param args Arguments for this rule's function.
		*	@param message Message to display on error.
		*/
		Rule: function(field, func, args, message) {
			this.functions = [];
			
			if(!field || typeof field !== 'object')
				throw {
					name: "RuleException",
					message: "Invalid field.",
					field: field
				};
			if(typeof func === 'function')
				this.functions.push({
					func: func,
					message: function() { return message || '' }
				});
			else if(typeof func === 'string') {
				var defRuleNames = func.split(/[^\w$\d]+/);
				for(var i = 0; i < defRuleNames.length; i++) {
					var defFunc = SCWB.validation.defaultRules[defRuleNames[i]];
					SCWB.log('add rule ', defRuleNames[i], ' : ', defFunc);
					if(defFunc)
						this.functions.push({
							func: defFunc.func,
							message: (message ? function() { return message || ''} : defFunc.defaultMessage)
						});
				}
			}
			
			if(!this.functions) throw {
				name: "RuleException",
				message: "Invalid function.",
				func: func
			};
			
			this.args = args || {};
			this.field = field;
			
			/**
			*	The error message as of the last call, if any.
			*/
			this.message = '';
			
			this.apply = function() {
				if(this.args.validateIfHidden || this.field.$().is(':visible') && !this.field.$().is('[disabled]') && !this.field.$().is('[readonly]')) {
					this.message = ''; // reset message.
					for(var i = 0; i < this.functions.length; i++) {
						if(!this.functions[i].func(this.field, this.args)) {
							this.message = this.functions[i].message(this.field, this.args);
							return false;
						}
					}
				}
				return true; // all the rules at this step are valid
			};
		},
		
		/**
		*	A field.
		*	@param validator Parent validator object (the form containing this field).
		*	@param name This field's name.
		*	@param errorHandler A function receiving an error object when an error is found, or a HTML element id to display an error message.
		*	@param successHandler A function called when this field is successfully validated. Default is an empty function.
		*/
		Field: function(validator, name, errorHandler, successHandler) {
			this.validator = validator;
			this.name = name;
			this.rules = [];
			
			if(errorHandler && typeof errorHandler === 'function') {
				this.errorHandler = errorHandler;
			}
			else {
				this.errorContainer = errorHandler;
				
				this.errorHandler = function(error) { // if no onError, default onError...
					if(this.errorContainer) {
						var message = error.failedRule.message;
						var $errorContainer = $('#' + this.errorContainer);
						this.updateErrorContainer(error.failedRule);
						error.displayed = true;
					}
				};
			}
			
			/**
			 * Manage errors associated to the same container as the current error
			 */
			this.updateErrorContainer = function(failed){
				//Store failed rules
				if(!this.errorContainer)
					return;
				
				var $errorContainer = $('#' + this.errorContainer);
				var rules = $errorContainer.data('rules');
				if($.isArray(rules)){
					var failedRules = $.map(rules, function(r, i){
						if(failed == r) return null;
						return (r.apply() ? null : r);
					});
					if(failed != null) failedRules.push(failed);
				}
				else
					failedRules = (failed == null ? [] : [failed]);
				
				$errorContainer.data('rules', failedRules);
				
				//show error or hide errorcontainer
				if(failedRules == null || failedRules.length < 1){
					if($errorContainer.hasClass('__auto'))
						$errorContainer.removeClass('__auto').text('').hide();
					return;
				}
				
				var message = "";
				$(failedRules).each(function(){
					message += (this.message + " ");
				});
				message = $.trim(message);
				if(this.validator && this.validator.options.printHtmlMessage){
					$errorContainer.addClass('__auto').html(message).show();
				}
				else {
					$errorContainer.addClass('__auto').text(message).show();
				}
			};
			
			this.successHandler = successHandler && typeof successHandler === 'function' ? successHandler : function() {
				this.updateErrorContainer();
			};
			
			this.getJQueryField = this.$ = function() {
				return $('#' + this.validator.id + ' [name="' + this.name + '"]');
			};
			
			if(this.validator.options.live){
				var me = this;
				var handler = function(){
					var validationResult = me.validate();
					if(!validationResult.isValid){
						me.errorHandler(validationResult);
					}
					else {
						me.successHandler();
					}
				};
				if(me.$().is(':input[type=text], :input[type=password], textarea'))
					me.$().blur(handler);
				else{
					if(me.$().is('select'))
						me.$().change(handler);
					else
						me.$().click(handler); //change does not work on radio and checkbox in IE6
				}
			}
			
			/**
			 * @param func validation function to add (a function or a default rule function's name).
			 * @param description rule description (displayed on error).
			 * @param args... arguments for the validation function.
			 */
			this.addRule = function (func, args, description) {
				try {
					var rule = new SCWB.validation.Rule(this, func, args, description);
					SCWB.log("SCWB.validation.Field.addRule: success for field " + this.name, rule);
					this.rules.push(rule);
					return rule;
				} catch (e) {
					SCWB.log("SCWB.validation.Field.addRule: exception: ", e);
				}
			};
			
			this.execRule = function (func, args, description) {
				var rule = new SCWB.validation.Rule(this, func, args, description);
				SCWB.log("SCWB.validation.Field.execRule: success for field " + this.name, rule);
				return rule.apply() ? {isValid: true, rule: rule} : {isValid: false, rule: rule};
			};
			
			/**
			* Returns the value of the field.
			* If the field is a checkbox or a radio button, then returns its value or true if checked, false otherwise.
			*/
			this.getValue = function() {
				var $field = this.getJQueryField();
				if($field.is('select')) {
					SCWB.log('TODO Field.getValue() SELECT');
					if($field.attr("multiple")) {
						SCWB.log('TODO Field.getValue() SELECT MULTIPLE');
					} else {
						return $field.val();
					}
				} else if($field.is('[type=radio]') || $field.is('[type=checkbox]')) {
					var res =  $('#' + this.validator.id + ' [name=' + this.name + ']:checked');
					if(res[0]) {
						return res.val() ? res.val() : true;
					}
				} else {
					return $field.val();
				}
				return false;  // no value or not checked
			};
			
			this.getValues = function(all) {
				var field = this.getJQueryField();
				var result = [];
				field.each(function() {
					_this = $(this);
					if(_this.val() && (!_this.is('[type=radio]') && !_this.is('[type=checkbox]') || _this.is(':checked')) ) {
						result.push(_this.val());
					}
				});
				return result;
			};
			
			this.getSibling = function(name) {
				return this.validator.getField(name);
			};
			
			this.validate = function() {
				for(var i = 0; i < this.rules.length; i++) {
					var rule = this.rules[i];
					if(!rule.apply()) {
						var error = {
							isValid: false,
							failedRule: rule
						}
						this.errorHandler(error);
						return error;
					}
				}
				this.successHandler();
				return {
					isValid: true,
					succeededRule: rule
				};
			};
		},
		
		Validator: function(formId, displayId, intro, disableFocusOnError) {
			this.id = formId;
			this.intro = intro || '';
			this.displayId = displayId;
			this.fields = [];
			this.options = {};
			this.disableFocusOnError = disableFocusOnError;
			
			this.errorHandler = function(errors) {
				var display = this.displayId ? $('#'+this.displayId) : null;
				SCWB.log('errorHandler: ', this.displayId, '->', display, ':', this.id);
				
				if(display && display[0]) {
					var insert = '';
					for(var i = 0; i < errors.length; i++)
						if(!errors[i].displayed)
							insert += '<li>' + (errors[i].failedRule.message ? errors[i].failedRule.message : '') + '</li>';
					if(insert)
						display.html( (this.intro ? this.intro + '<br />' : '') +'<ul class="validation-errors">' + insert + '</ul>').slideDown();
				} else {
					var insert = '';
					for(var i = 0; i < errors.length; i++)
						if(!errors[i].displayed)
							insert += "\n" + (errors[i].failedRule.message ? errors[i].failedRule.message : '');
					if(insert)
						alert(this.intro + insert);
				}
				SCWB.log('make the first field to focus (error)');
				if(errors[0].failedRule.field.errorContainer) {
					SCWB.log('href to #', errors[0].failedRule.field.errorContainer)
					window.location.href = '#' + errors[0].failedRule.field.errorContainer
				}
				if(this.disableFocusOnError == null || !this.disableFocusOnError || this.disableFocusOnError == ""){
					errors[0].failedRule.field.$().focus();
				}
			};
			
			this.successHandler = function() {
				return true;
			};
			
			this.addField = function (name, errorHandler, successHandler) {
				var field = this.getField(name);
				if(!field) {
					field = new SCWB.validation.Field(this, name, errorHandler, successHandler);
					this.fields.push(field);
				}
				return field;
			};
			
			this.getField = function(name) {
				for(var i = 0; i < this.fields.length; i++) {
					var field = this.fields[i];
					if(field.name === name)
						return field;
				}
			};
			
			this.validate = function() {
				SCWB.log("validation call");
				var errors = [];
				for(var i = 0; i < this.fields.length; i++) {
					var field = this.fields[i];
					var validationResult = field.validate();
					if(!validationResult.isValid) {
						errors.push({
							field: field,
							failedRule: validationResult.failedRule,
							displayed: validationResult.displayed
						});
					}
				}
				if(errors.length) {
					SCWB.log(errors);
					this.errorHandler(errors);
					return false;
				} else {
					return this.successHandler();
				}
			}
			
			/**
			* Get jquery form element.
			*/
			this.getJQueryForm = this.$ = function() {
				return $('#' + this.id);
			};
			
			// hide error messages on field change
			/* var validator = this;
			$(function() {
				for(var i = 0; i < validator.fields.length; i++) {
					validator.fields[i].$().change(function() {
						if($(this).hasClass('__auto'))
							$(this).removeClass('__auto').hide();
					});
				}
			}); */
		},
				
		addFormValidator: function(formId, options) {
			var validator = new SCWB.validation.Validator(formId, options.displayId, options.intro, options.disableFocusOnError);
			$.extend(validator.options, options);
			SCWB.validation.forms.push(validator);
			return validator;
		},
		
		getFormValidator: function(formId) {
			var forms = SCWB.validation.forms;
			for(var i = 0; i < forms.length; i++) {
				if(forms[i].id === formId)
					return forms[i];
			}
		},
		
		/**
		* Collection of default rules.
		* Each default rule contains two functions accepting two arguments : the field object and an object containing all the params for this rule.
		*/
		defaultRules: {
			required: {
				defaultMessage: function(field, args) {
					return 'Ce champ est requis.';
				},
				/**
				*	Checks if this field has a value.
				*	args:	none.
				*/
				func: function(field, args) {
					SCWB.log("SCWB.validation.defaultRules.required ", field);
					var values = field.getValues();
					SCWB.log(values);
					return values.length > 0;
				}
			},
			not: {
				defaultMessage: function(field, args) {
					return 'Cette valeur est interdite'
				},
				/**
				*	Checks if this field's value has a correct length.
				*	args:	- values: forbidden values (strings) comma-separated
				*			- fieldValues: list of fields which value should not equal this one. comma-separated
				*/
				func: function(field, args) {
					var val = field.getValue().trim();
					if(!val)
						return true;
					
					var list = function(str) {
						return !str ? [] : str.reverse().split(/,(?!\\)/).map(function(word) {
							return word.reverse().replace('\\,', ',').trim();
						})
					}
					
					var forbiddenValues = list(args.values).concat(list(args.fieldValues).map(function(word) {
						return field.getSibling(word).getValue();
					}));
					
					SCWB.log(forbiddenValues)
					
					return $.inArray(val, forbiddenValues) < 0;
				}
			},
			same: {
				defaultMessage: function(field, args) {
					return 'Ce champ doit avoir la même valeur que ' + args.target;
				},
				/**
				*	Checks if this field has the same value as the target's one.
				*	args:	- target: the other field's name that this field must equal.
				*/
				func: function(field, args) {
					SCWB.log("SCWB.validation.defaultRules.same ", field, args.target);
					var val1 = field.getJQueryField().val();
					
					if(val1.length === 0)
						return true; // assume it is not required
					
					var val2 = $('#' + field.validator.id + ' [name=' + args.target + ']').val();
					SCWB.log("SCWB.validation.defaultRules.same ", val1, " === ", val2);
					return val1 === val2;
				}
			},
			email: {
				defaultMessage: function(field, args) {
					return 'Ce champ doit indiquer une adresse mail valide.';
				},
				/**
				*	Checks if this field is a correct email.
				*	args:	none.
				*/
				func: function(field, args) {
					if(field.getValue().length === 0)
						return true;
					return SCWB.validation.defaultRules.email._regexp.test(field.getValue());
				},
				/*
				 * La regexp de validation d'un email est basée sur la RFC3696. 
				 * Par rapport à la RFC, les seuls emails qui ne passent pas sont les email  
				 * avec des caractère spéciaux du type : \ " é
				 * 
				 */
				_regexp: new XRegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
			},
			date: {
				defaultMessage: function(field, args) {
					return 'Ce champ doit indiquer une date valide.';
				},
				/**
				*	Checks if this field denotes a date, matching a pattern, and if its value is before or after another date, or if its value is
				*	the past or in the future.
				*	args:	- pattern: a pattern for the date. Special characters : d for day, m for month, y for year. Default : 'dd/mm/yyyy'
				*			- after: string denoting a date, must match the pattern or equal 'today'. The date being checked should be after that date.
				*			- before: string denoting a date, must match the pattern or equal 'today'. The date being checked should be before that date. 
				*/
				func: function(field, args) {
					var val = field.getJQueryField().val();
					if(val.length === 0)
						return true; // if no value, then true unless it is required
					
					var pattern = args.pattern || 'dd/mm/yyyy';
					pattern.trim();
					val.trim();
					
					/** returns a Date if matching the pattern, or false.
					*/
					var parse = function (pattern, str) {
						if(str && typeof str === 'string' && pattern && typeof pattern === 'string' && str.length === pattern.length) {
							
							var date = new (function() {
								var now = new Date();
								this.year = now.getYear();
								this.month = now.getMonth() + 1;
								this.day = now.getDate();
								
								this.getFullYear = function() {
									if(this.year < 100 && this.year >= 0) return 2000 + this.year;
									return this.year;
								};
								
								this.check = function() { // very basic for now
									var isLeapYear = this.year % 4 === 0 && this.year % 100 !== 0 || this.year % 400 === 0;
									var daysInMonth = [0 /*padding*/, 31, isLeapYear ? 29 : 28, 31, 30, 31,	30,	31, 31,	30,	31,	30,	31];
									return this.getFullYear() > 0 && this.month > 0 && this.month <= 12 && this.day > 0 && this.day <= daysInMonth[this.month];
								};
								
								this.getDate = function() {
									return new Date(this.getFullYear(), (this.month - 1), this.day);
								};
							})();
							
							var patternRegexp = /m{1,2}|d{1,2}|y{1,4}/g;
							var chunkType;
							var lastIndex = 0;
							while((chunkType = patternRegexp.exec(pattern)) != null) {
								var realGap = str.substring(lastIndex, chunkType.index)
								var awaitedGap = pattern.substring(lastIndex, chunkType.index)
								var chunk = str.substring(chunkType.index, patternRegexp.lastIndex);
								if(realGap !== awaitedGap) {
									SCWB.log('SCWB.validation.defaultRules.date.func: parse: pattern not matched (awaited: "', awaitedGap, '", real: "', realGap, '")');
									return false;
								}
								var chunkValue = SCWB.utils.parseInt(chunk);
								switch(chunkType[0].charAt(0)) {
									case 'd':
										date.day = chunkValue;
										break;
									case 'm':
										date.month = chunkValue;
										break;
									case 'y':
										date.year = chunkValue;
										break;
								}
								lastIndex = patternRegexp.lastIndex
							}
							return date.check() ? date.getDate() : false;
						}
					};
					
					var valDate = parse(pattern, val);
					var before;
					var after;
					
					if(args.before && typeof args.before === 'string')
						before = args.before.trim() === 'today' ? new Date().setToMidnight() : parse(pattern, args.before.trim());
					if(args.after && typeof args.after === 'string')
						after = args.after.trim() === 'today' ? new Date().setToMidnight() : parse(pattern, args.after.trim());
					
					var strict = args.strict === 'true';
					
					if(valDate) {
						var result = true;
						if(before) result = strict ? valDate.getTime() < before.getTime() : valDate.getTime() <= before.getTime();
						if(result && after) result = result && (strict ? valDate.getTime() > after.getTime() : valDate.getTime() >= after.getTime());
						return result;
					}
					
					return false;
				}
			},
			length: {
				defaultMessage: function(field, args) {
					var multivalued = field.getValues().length > 0;
					if(args.equals)
						return 'Ce champ doit comporter exactement ' + args.equals + (multivalued ? 'choix' : ' caractères');
					if(args.min && args.max) {
						return 'Ce champ doit comporter entre ' + args.min + ' et ' + args.max + ' ' + (multivalued ? 'choix' : ' caract�res');
					}
					if(args.min)
						return 'Ce champ doit comporter au moins ' + args.min + ' ' + (multivalued ? 'choix' : ' caractères');
					if(args.max)
						return 'Ce champ doit comporter au plus ' + args.max + ' ' + (multivalued ? 'choix' : ' caractères');
				},
				/**
				*	Checks if this field's value has a correct length.
				*	args:	- min: string denoting the minimal length of the field's value(s) (inclusive)
				*			- max: string denoting the maximal length of the field's value(s) (inclusive)
				*			- equals: string denoting the exact length of the field's value(s). Overrides min and max.
				*			- strict: non-inclusive range, 'true' or 'false'
				*/
				func: function(field, args) {
					/*SCWB.log("SCWB.validation.defaultRules.length")
					if(args.equals)
						SCWB.log(field.name, "'size should be included in: ", (args.strict ? "]" : "["), args.min, ", ", args.max, (args.strict ? "[" : "]"));
					else SCWB.log(field.name, "'size should equal ", args.equals); */
					
					var values = field.getValues();
					var length = 0;
					if(values.length > 1) // champ multiple (radio, checkboxes, ...)
						length = values.length;
					else {
						var val = field.getValue();
						
						if(val.length === 0)
							return true; // assume it is not required
						
						if(val) length = val.length;
					}
					
					var equals = SCWB.utils.parseInt(args.equals);
					
					if(!isNaN(equals))
						return length == equals;
					
					var min = SCWB.utils.parseInt(args.min);
					var max = SCWB.utils.parseInt(args.max);
					
					if(args.strict === 'true')
						return (!isNaN(min) ? length > min : true) && (!isNaN(max) ? length < max : true);
					
					return (!isNaN(min) ? length >= min : true) && (!isNaN(max) ? length <= max : true);
				}
			},
			/**
			 * @deprecated, @see range
			 */
			min: {
				defaultMessage: function(field, args) {
					return 'Ce champ doit valoir au moins ' + args.min;
				},
				/**
				*	Checks if this field's value parsed into a number is greater than a given value.
				*	args:	- min: the minimal field's value. (float)
				*			- strict: 'true' if non inclusive.
				*/
				/**
				 * @deprecated @see range
				 */
				func: function(field, args) {
					SCWB.log("SCWB.validation.defaultRules.min", field, args.min);
					var min = SCWB.utils.parseFloat(args.min);
					if(min !== NaN) {
						var val = field.getJQueryField().val();
						
						if(val.length === 0)
								return true; // assume it is not required
						
						val = SCWB.utils.parseFloat(val);
						if(val !== NaN) {
							SCWB.log("SCWB.validation.defaultRules.min: " + val + ">=" + min);
							if(args.strict === "true")
								return val > min;
							return val >= min;
						} else {
							SCWB.log("SCWB.validation.defaultRules.min: val is not a number : ", args.min);
						}
					} else {
						SCWB.log("SCWB.validation.defaultRules.min: val is not a number : ", args.min);
					}
					return false;
				}
			},
			/**
			 * @deprecated, @see range
			 */
			max: {
				defaultMessage: function(field, args) {
					return 'Ce champ doit valoir au plus ' + args.max;
				},
				/**
				*	Checks if this field's value parsed into a number is smaller than a given value.
				*	args:	- max: the maximal field's value. (float)
				*			- strict: 'true' if non inclusive.
				*/
				/**
				 * @deprecated, @see range
				 */
				func: function(field, args) {
					var max = SCWB.utils.parseFloat(args.max);
					if(max !== NaN) {
						var val = field.getJQueryField().val();
						
						if(val.length === 0)
							return true; // assume it is not required
						
						val = SCWB.utils.parseFloat(val);
						if(val !== NaN) {
							if(args.strict === 'true')
								return max > val;
							return max >= val;
						} else {
							SCWB.log("SCWB.validation.defaultRules.max: val is not a number : ", args.max);
						}
					} else {
						SCWB.log("SCWB.validation.defaultRules.max: val is not a number : ", args.max);
					}
					return false;
				}
			},
			range: {
				defaultMessage: function(field, args) {
					var min = SCWB.utils.parseFloat(args.min)
					var max = SCWB.utils.parseFloat(args.max)
					var strictExpr = args.strict === 'true' ? 'non-inclus' : 'inclus'
					if(min && max)
						return 'Ce champ doit être compris entre ' + args.min + ' (' + strictExpr + ') et ' + args.max + ' (' + strictExpr + ')';
					if(min)
						return 'Ce champ doit être supérieur à ' + args.min + ' (' + strictExpr + ')'
					if(max)
						return 'Ce champ doit être inférieur à ' + args.max + ' (' + strictExpr + ')'
				},
				/**
				*	Checks if this field's value parsed into a number is between a given min and max.
				*	args:	- min: the minimal field's value.
				*			- max: the maximal field's value.
				*			- strict : non-inclusive range ?
				*/
				func: function(field, args) {
					var val = field.getValue();
					if(!val)
						return true; // not required
					val = SCWB.utils.parseFloat(val);
					if(isNaN(val))
						return false;
					var max = SCWB.utils.parseFloat(args.max);
					var min = SCWB.utils.parseFloat(args.min);
					var strict = args.strict === 'true';
					return (!args.max || (strict ? val < max : val <= max)) && (!args.min || (strict ? val > min : val >= min));
				}
			},
			number: {
				defaultMessage: function(field, args) {
					return 'Ce champ doit contenir un nombre.';
				},
				/**
				*	Checks if this field's value string contains a valid number (= float).
				*	args:	none.
				*/
				func: function(field, args) {
					var value = field.getJQueryField().val();
					if(value.length === 0)
						return true; // assume it is not required
					return !isNaN(SCWB.utils.parseFloat(value));
				}
			},
			integer: {
				defaultMessage: function(field, args) { return 'Ce champ doit contenir un entier.'; },
				/**
				*	Checks if this field's value string contains a valid integer.
				*	args:	none.
				*/
				func: function(field, args) {
					var value = field.getJQueryField().val();
					if(value.length === 0)
						return true; // assume it is not required
					return !isNaN(SCWB.utils.parseInt(value));
				}
			},
			word: {
				defaultMessage: function(field, args) {
					return 'Ce champ ne peut contenir que des lettres.';
				},
				/**
				*	Checks if this field's value string contains only letters and '_' or '-'.
				*	args:	none.
				*/
				func: function(field, args) {
					var thisRule = SCWB.validation.defaultRules.word;
					var value = field.getJQueryField().val();
					if(value.length === 0)
						return true; // assume it is not required
					return (args.spaces === 'true' ? thisRule._regexp_spaces : thisRule._regexp_nospaces).test(value.trim());
				},
				_regexp_nospaces: (window.XRegExp ? new XRegExp('^(?:\\p{L}|[_-])+$') : /^[\w-]+$/),
				_regexp_spaces: (window.XRegExp ? new XRegExp('^\\s*((?:\\p{L}|[_-])\\s*)+$') : /^\s*([\w-]\s*)+$/)
			},
			match: {
				defaultMessage: function(field, args) {
					return '';
				},
				/**
				*	Checks if this field's value matches a given pattern. Supports unicode character classes.
				*	args:	- pattern: a regexp or a string denoting a regexp.
				*/
				func: function(field, args) {
					SCWB.log("SCWB.validation.defaultRules.match", field, args.pattern);
					
					if(args.pattern) {
						try {
							var value = field.getJQueryField().val();
							
							if(value.length === 0)
								return true; // assume it is not required
							
							if(typeof args.pattern === "string") {
								var regexp = new XRegExp(args.pattern, args.flags);
								return regexp ? regexp.test(value) : false;
							}
							
							if(typeof args.pattern === "object") {
								return args.pattern.test(value);
							}
						} catch(e) {
							SCWB.log("SCWB.validation.defaultRules.match: exception: ", e, " with ", args, ' [flags: ' + args.flags + ']');
						}  
					}
					return false;
				}
			}
		}
	}
};

/**
 * log -- only works on FF for now.
 */
SCWB.log = function() {
	if(SCWB.debug) {
		if(typeof window.console === "object" && typeof window.console.log === "function")
			window.console.log.apply(console, arguments)
	}
}