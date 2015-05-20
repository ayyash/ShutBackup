/// <reference path="jquery-1.5.1-vsdoc.js" />



(function ($) {
	if (!$.Sh) {
		$.Sh = {};
	};

	$.Sh.Autocomplete = function (options) {
		// a bridge, set up options from data-
		var _options = {
			source: this.data("source"),
			target: this.data("target"),
			context: this.data("context"),
			isInline: this.data("inline"),
			minLength: this.data("min-chars"),
			noCache: this.data("nocache"),
			onload: $.getEvent(this,"onload"),
			onchange: $.getEvent(this, "onchange"),
			onresponse: $.getEvent(this, "onresponse"),
			onselect: $.getEvent(this, "onselect"),
			onblur: $.getEvent(this,"onblur")
		};

		this.ShAutocomplete($.extend(_options, options));
		return $(this).data("sh.autocomplete");
	};

	// expose default options
	$.Sh.Autocomplete.defaults = {
		minLength: 0,
		context: $.props.$body
	};
	// constructor, not exposed
	var Autocomplete = function (el, options) {

		// extend options
		this.options = $.extend({}, $.Sh.Autocomplete.defaults, options);

		this.element = el;

		this.target = $(this.options.target, this.options.context); // there must be one unique

		this.cache = {};
		// initialize
		this.init(options);
	};
	
	Autocomplete.prototype = {

		init: function (options) {
			
			var base = this,
				source;

			// ajax if not inline
			if (base.options.isInline) {
				source = this.options.source;
			} else {
				var ajax = $.Sh.Ajax.call(base.element, {
					method: "GET",
					silent: true,
					url: base.options.source

				});
				source = function (request, response) {
					// call ajax after adding param
					if (!base.options.noCache && request.term in base.cache) {
						response(base.cache[request.term]);
						return;
						
					}
					ajax.addparams({ kw: request.term });
					ajax.options.onfinish = function (data) {
						base.cache[request.term] = data.d;
						response(data.d);
					};
					ajax.ajax();
					
				};
			}

			this.element.autocomplete({
				source: source,
				minLength: base.options.minLength,
				select: function (event, ui) {
					// add value to hidden field
					_debug(ui.item, "item");

					if (ui.item) {
						base.element.val(ui.item.value);
						base.target.ShVal(ui.item.dbid);
						if(base.options.onselect) base.options.onselect.call(base.element, ui.item);
						return false;
					}

				},
				change: function (event, ui) {
					// if none selected, reset to none
					// changed

					if (ui.item == null) {
						ui.item = { currentValue: base.element.val() };
						base.element.val('');
						base.target.ShVal(null);
					}
					if (base.options.onchange) base.options.onchange.call(base.element, ui.item);
				},
				response: function (event, ui) {
					if (base.options.onresponse) base.options.onresponse.call(base.element, ui.content);
				}
			})
			.blur(function () {
				// on blur but no change and empty field, empty field
				if (base.element.ShTrim() == "") {
					base.target.ShVal(null);
				}
				if (base.options.onblur) base.options.onblur.call(base.element);

			});

			// fix ie bug
			this.element.one("input", function (e) {

				var $that = $(this);
				var val = $that.val();
				$that.val("");
				setTimeout(function () {
					$that.val(val);
				}, 500);


			});

			this.element.trigger("input");


			// return instance
			return this;
		},
		changeTarget: function (target) {
			this.options.target = target;
			this.target = $(target);
		}

	};

	// plugin
	$.fn.ShAutocomplete = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.autocomplete")) {
				$(this).data("sh.autocomplete", new Autocomplete($(this), options));
			}

		});
	};


})(jQuery);

