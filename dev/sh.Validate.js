/// <reference path="jquery-1.5.1-vsdoc.js" />


(function ($) {
	if (!$.Sh) {
		$.Sh = {};
	};
	if (!$.UiSh) {
		$.UiSh = {};
	};

	$.Sh.FormatRules = {
		//"email": /^\S+@\S+\.\S+$/i,
		"email": /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
		//"url": /^http\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?$/i,
		"url": /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
		"integer": /^[0-9]*$/,
		"number": /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
		"digits": /^-?(?:\d*)?(?:\.\d+)?$/,
		"phone": /^[\d\s]*$/,
		"date": ""
	}



	$.Sh.Validate = function (options) {
		// a bridge, set up options from data-
		var type = "required";
		if (this.attr("data-format")) {
			type = "format";
			
		} else if (this.attr("data-min") || this.attr("data-max")) {
			type = "range";
		} else if (this.attr("data-min-length") || this.attr("data-max-length")) {
			type = "rangelength";
		} else if (this.attr("data-required")) {
			type = "required";
		} else if (this.attr("data-custom")) {
			type = "custom";
		}
		var _options = {
			required: this.data("required"),
			onshow: $.getFunction(this, "onshow"),
			onload: $.getFunction(this, "onload"),
			onhide: $.getFunction(this, "onhide"),
			onvalidate: $.getFunction(this, "onvalidate"),
			inputcss: this.data("inputcss"),
			reqcss: this.data("reqcss"),
			errlabelcss: this.data("errcss"),
			customlabelcss: this.data("customcss"),
			errlocation: this.data("err-location"),
			errmsg: this.data("err-message"),
			reqmsg: this.data("required-message"),
			showonload: this.data("showonload"),
			valid: this.data("valid"),
			type: type,
			format: this.data("format"),
			min: this.data("min"),
			max: this.data("max"),
			minLength: this.data("min-length"),
			maxLength: this.data("max-length"),
			skip: this.data("skip"),
			asyncvalid: this.data("async-valid")
		};
		this.ShValidate($.extend(_options, options));
		return this.data("sh.validate");
	};



	// expose default options
	$.Sh.Validate.defaults = {
		required: false,
		inputcss: "error",
		reqcss: "req",
		reqmsg:$.Res.Required,
		errlabelcss: "errlabel",
		customlabelcss: "cerrlabel",
		errlocation: "afterEnd",
		showonload: false,
		valid: null,
		skip: false,
		asyncvalid: true // by default its true
	};
	// constructor, not exposed
	var Validate = function (el, options) {

		this.options = $.extend({}, $.Sh.Validate.defaults, options);
		this.element = el;
		// which one to call
		this.reqstar = $('<span></span>').addClass(this.options.reqcss);

		this.label = null;
		this.code = null; // save the last code associtated with it

		if (this.options.type == "custom") {
			this.custom();
		}else{
			this.init();
		}
	};

	Validate.prototype = {
		
		init: function () {
			// extend options
			
			var base = this, el = this.element;
			
			if (base.options.required) {
				
				el.wrap(String('<div class="wrapvld {0}"></div>').format(base.options.reqcss)).after(base.reqstar); // this line is causing issues, wrapping uses a clone
			} else {
				el.wrap('<div class="wrapvld"></div>');
			}
			//default label
			base.label = $.Sh.Label.call(el,{
				text: base.options.errmsg,
				sticky: true,
				showCloseBtn: false,
				css: base.options.errlabelcss + (base.options.required ? "" : " unlabel"),
				location: base.options.errlocation,
				showOnLoad: base.options.showonload,
				//valid: base.options.valid,
				onShow: function () {
					el.addClass(base.options.inputcss);
					if (base.options.onshow) base.options.onshow.call(this);
				},
				onLoad:base.options.onload,
				onHide: function () {
					el.removeClass(base.options.inputcss);
					if (base.options.onhide) base.options.onhide.call(this);
				}
			});
			
			
			//el.on("change", function () {
			//	// reset validation, mmm
			//	//base.options.valid = false;
			//});
			// on focus, hide label
			el.on("focus keydown", function () {

				base.label.hide();
				
			});
			// return instance
			return this;
		},
		methods: {
			required: function (val,label, msg) {
				
				if (val === "") {
					label.show({ text: msg});
					this.options.valid = false;
					
				}
				
				return this.options.valid;
			},
			format: function (val,label) {
				
				// override error message with something suitable to format if exists
				var f = this.options.format, msg =  this.options.errmsg || $.Res.Tiny.INVALID_FORMAT;
				

				var re = $.Sh.FormatRules[f] || new RegExp(f, "i");
				if (f in $.Sh.FormatRules) {
					msg = this.options.errmsg || $.Res.Tiny["INVALID_" + f + "_FORMAT"];
				}
				// if date deal differently
				if (f== "date") {
					try {
						$.datepicker.parseDate($.Res.Localization.DateFormat, val);
					} catch (e) {
						
						this.options.valid = false;
						
					}
				} else {
					if (re.test(val) == false) {
						
						this.options.valid = false;
						
					}
				}
				if (!this.options.valid) label.show({ text: msg });
				
				return this.options.valid;
			},
			range: function (val,label) {
				// range is between min and max
				
				
				val = Number(val);
			
				var min = parseInt(this.options.min),
					max = parseInt(this.options.max),
					msg = this.options.errmsg || $.Res.Tiny.INVALID_VALUE;
				
				if (isNaN(val)) {
					this.options.valid = false;
					label.show({ text: msg });
					return false;
				}

				if ((min != null && min > val) || (max != null && max < val)) {
					this.options.valid = false;
					label.show({ text: msg });
					return false;
				}
				
				return true;
			},
			rangelength: function (val, label) {
			
				var min = parseInt(this.options.minLength),
					max = parseInt(this.options.maxLength);
				
				//var min = this.data("min-length") ? parseFloat(this.data("min-length")) : null;
				//var max = this.data("max-length") ? parseFloat(this.data("max-length")) : null;
				

				var _length = val.length;

				if (!isNaN(min) && min > _length) {
					this.options.valid = false;
					label.show({ text: this.options.errmsg || $.Res.Tiny.TOO_SHORT });					
				} else if (!isNaN(max) && max < _length) {
					this.options.valid = false;
					label.show({ text: this.options.errmsg || $.Res.Tiny.TOO_LONG });
				}

				return this.options.valid;
			}
		},
		validate: function () {
			// call onvalidate
			
			var base = this, el = this.element, label = this.label;

			base.options.valid = true;
			base.code = base.options.type;

			if (base.options.type == "custom") {
				if (base.options.onvalidate) return base.options.onvalidate.call(base, label);
				// imagine if u could do this base.element.trigger("validate")
				_debug(el, "custom validation not implemented");
				return false;
			}

			var val = el.ShTrim();

			if (base.options.required) {
				var m = base.options.type == "required" ? base.options.errmsg || base.options.reqmsg : base.options.reqmsg;
				// if false return
				if (!base.methods.required.call(base, val, label, m)) return false;
				
			}
			
			// according to type, call method, if other than required, apply only on non emtpy values
			if (base.options.type != "required" && val !== "" && !base.methods[base.options.type].call(base, val, label)) {
				return false;
			}
			
			// fire external validation
			if (base.options.onvalidate) return base.options.onvalidate.call(base, val, label);
		
			return true;
		},
		custom: function () {
			// setup label, and call inline onvalidate, which is supposed to deal with the label directly
			var base = this;
			
			this.label = $.Sh.Label.call(this.element,{
				text: base.options.errmsg,
				sticky: true,
				showCloseBtn: false,
				css: base.options.customlabelcss,
				location: base.options.errlocation,
				showOnLoad: base.options.showonload,
				//valid: base.options.valid,
				onShow: base.options.onshow,
				onLoad: base.options.onload,
				onHide: base.options.onhide
			});
			
			return this;
		},
		toggleReqstar: function (isrequired) {
			// if required, for now, show reqstar, else hide it. validation should come from custom behavior
			// TODO: maybe i should detect reqstar and add it if not there yet
			isrequired ? this.reqstar.show() : this.reqstar.hide();
			return this;
		},
		option: function (name, value) {
			this.options[name] = value;
			if (name == "required" ) {
				this.toggleReqstar(value);
				this.label.hide();
			}
			return this;
		}
		
	};

	// plugin
	$.fn.ShValidate = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.validate")) {
				$(this).data("sh.validate", new Validate($(this), options));
			}

		});
	};


	/*
	 * ValidateForm behavior:
	 * this behavior is for multiple validation fields to be submited and validated together
	 */

	$.Sh.ValidateForm = function (options) {
		// prepare fields if not already passed
		
	
		var _options = {
			fields: null,
			context: this.data("context"),
			trigger: this.data("trigger") ? this.find(this.data("trigger")) : this,
			offset: this.data("offset"),
			selector: this.data("validate-selector") || this.data("validateselector"),
			bDoValidate: this.data("dovalidate"),
			silent: this.data("silent"),
			onvalidate: $.getFunction(this,"onvalidate")
		};
		
		this.ShValidateForm($.extend(_options, options));
		return this.data("sh.validateform");
	};

	// expose default options
	$.Sh.ValidateForm.defaults = {
		fields: null,
		silent: false,
		trigger: null,
		selector: ".validate",
		offset: 0,
		bDoValidate: true
	};
	// constructor, not exposed
	var ValidateForm = function (el, options) {

		this.element = el;
		this.options = $.extend({}, $.Sh.ValidateForm.defaults, options);

		if (!this.options.fields)
			this.options.fields = $(this.options.selector, this.options.context || $.props.$body); // fixed this.context!

		this.context = this.options.context || window;
	

		this.init(this.options);
	};

	ValidateForm.prototype = {
		init: function(options){
			
			$.extend(this.options, options);
			var base = this;
			// setup validation and onclick events of trigger
			if (!this.options.silent) {
				if (this.options.trigger.is("form")) {
					this.options.trigger.on("submit", function (e) {
						if (!e.isDefaultPrevented() && !base.validate()) return false;
					});
				}else{
					this.options.trigger.on("click",function (e) {
						if (!e.isDefaultPrevented() && !base.validate()) return false;
					});
				}
			}
			
		},
		validate: function () {
			
			var base = this,
				el = this.element,
				isValid = true,
				fTop = 0,
				bTop = false;
			
			// go through fields and validate
			$.each(this.options.fields, function (i, o) {
				
				var $t = $(this),
					//label = $t.data("sh.label"), // label object
					v = $t.data("sh.validate"); // validation object
				

				v.label.hide();

				// taking care of placeholder first, assumung using Placeholder plugin
				if (!jQuery.support.placeholder) {
					if ($t.hasClass('placeholder') && $t.val() == $t.attr('placeholder')) {
						$t.val('');
					}
				}

				if (base.options.bDoValidate) {

					// skip field?
					
					if (!v.options.skip && (!v.options.asyncvalid || !v.validate())) {
						// call onasyncerror again, this happens when user focuses, loses error label, then blurs while the async error is still present)
						if (!v.options.asyncvalid) $t.trigger("shAsync");
						
						isValid = false;

						if (!bTop) {
							
							// scrollup first time only
							var $e = $t.is(":visible") ? $t : $t.parent(); // keep an eye on parent
							if (base.context == window) fTop = $e.offset().top - base.options.offset;
							else if (base.context && base.context.length) fTop = $e.ShPosition(base.context).top - base.options.offset;
							
							bTop = true;
						}

					}
				}


			});

			if (!isValid) {
				
				// scroll to top of page, // only if ftop is not within view
				if (base.context == window) {
					if ($.props.$window.scrollTop() > fTop) $('html, body').animate({ scrollTop: fTop }, 'fast', 'swing');
				} else if (base.context && base.context.length) {
					// try scrolling context

					if (base.context.scrollTop() > fTop) base.context.animate({ scrollTop: fTop }, 'fast', 'swing');
				}

				// maybe i should fire an event here
				base.options.onvalidate ? base.optionns.onvalidate.call(base, false) : null;

				return false;
			}
			// i should fire an event here
			return base.options.onvalidate ? base.optionns.onvalidate.call(base, true) : true;
		},
		addField: function (field) {
			this.options.fields.add(field);
		}

	};

	// plugin
	$.fn.ShValidateForm = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.validateform")) {
				$(this).data("sh.validateform", new ValidateForm($(this), options));
			}

		});
	};


	$.UiSh.Size = function (val, label) {
		// test if FileReader is supported first
		
		var size = parseInt(this.element.data("size") || 500);
		if (isNaN(size)) size = 500;
		this.code = "size";

		size = size * 1000;

		if (!window.FileReader) return true;

		var _element = this.element.get(0);

		if (_element.files && _element.files[0]) {

			var fsize = parseInt(_element.files[0].size);
			_debug(fsize, "file size");
			if (fsize <= size) {
				return true;
			}
			label.show({ text: $.Res.Tiny.FILE_LARGE});
			return false;
		}
		return true;


	}

	// this sounds like a site behavior not a framework
	$.UiSh.Options = function (val, label) {
		// if one option is selected at least

		var options = this.element.find(":selected");
		var min = this.element.data("options-min");
		var max = this.element.data("options-max");

		this.code = "options";
		_debug({ min: min, max: max, options: options });

		if ((min != null && min > options.length) || (max != null && max < options.length)) {

			label.show({text: this.options.errmsg ||  $.Res.Tiny.INVALID_OPTIONS});
			return false;
		}

		return true;


	}

	

})(jQuery);