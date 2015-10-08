
(function ($) {
	if (!$.Sh) {
		$.Sh = {};
	};

	$.Sh.AjaxTip = function (options) {
		// a bridge, set up options from data-

		var _options = {
			css: this.data("css")
		};


		this.ShAjaxTip($.extend(_options, options));
	};

	// expose default options
	$.Sh.AjaxTip.defaults = {
		termcss: "tipterm",
		pop: undefined
	};
	// constructor, not exposed
	var AjaxTip = function (el, options) {
		// extend options
		this.options = $.extend({}, $.Sh.AjaxTip.defaults, options);

		this.element = el;

	
		this.element.addClass(this.options.termcss);

		

		var iIndex = "ipop" + AjaxTip.Counter++;

		this.element.data("associate", iIndex);

		// create new div for every tip to allow for caching
		// or cache objects and rebuild?

		if (!this.options.pop) {
			this.options.pop = $("<div />").appendTo($.props.$body); 
		}

		this.options.pop.data("associate", iIndex).addClass("tipcard ipop " + (this.options.css || ""));

		var base = this;

		this.element.data("ondocumentclick", function (e) {
			// if self, ignore, else hide
			
		
			if (this.get(0) != e.target &&  !jQuery.contains(base.element.get(0), e.target) &&  !jQuery.contains(base.options.pop.get(0), e.target)) {// or this is within a data associate!!!!
				base.options.pop.hide();
			}

		});

		$.popbasket.push(this.element);

		// initialize
		this.init(options);
	};

	AjaxTip.prototype = {
		init: function (options) {
			var base = this;
			this.pop = this.options.pop;
				
		
			// ajax
			$.Sh.Ajax.call(base.element, {
				method: "GET",
				onloading: function (bloading) {
					if (bloading) {
						// popup and position
						base.pop.show();
						base.pop.position({
							of: base.element,
							my: "right top",
							at: "right bottom"
						});

						// show loading
						base.pop.addClass("loading");
					} else {
						// remove loading
						base.pop.removeClass("loading");
					}
				},
				onprepost: function () {
					if (base.element.data("latched")) {
						$.props.$body.trigger("click");

						base.pop.show();
						// jqueryui position
						base.pop.position({
							of: base.element,
							my: "right top",
							at: "right bottom"
						});

						return false;
					} else {
						return true;
					}
				},
				onfinish: function (data) {
					if (data.result) {
						// display as is (keep an eye, we might want to move to tempaltes)
						base.pop.html(data.d);
						base.element.data("latched", true);
						// latch so that u dont click again

						// shrewire
						$.ShRewire(base.pop);
					} else {
						base.pop.html("oh oh!");//TODO:
					}
				}
			})

			// return instance
			return this;
		}
	
	};
	AjaxTip.Counter = 0;
	// plugin
	$.fn.ShAjaxTip = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.ajaxtip")) {
				$(this).data("sh.ajaxtip", new AjaxTip($(this), options));
			}

		});
	};


})(jQuery);

