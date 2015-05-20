/// <reference path="jquery-1.5.1-vsdoc.js" />

// allow submission of content fields, or target fields


(function ($) {
	if (!$.Sh) {
		$.Sh = {};
	};

	$.Sh.Submit = function (options) {
		
		
		var _options = {
			successcode: this.data("success-code")
		};


		this.ShSubmit($.extend(_options, options));
		return this.data("sh.submit");
	};

	// expose default options
	$.Sh.Submit.defaults = {
		successcode: "DONE"
	};
	// constructor, not exposed
	var Submit = function (el, options) {

		this.element = el;
		// initialize
		this.init(options);
	};

	Submit.prototype = {

		init: function (options) {
			// extend options
			this.options = $.extend({}, $.Sh.Submit.defaults, options);
			
			var base = this;

			// call ajax with set properties
			var o = $.Sh.Ajax.call(this.element, {
				onprepost: function () {
					$.BodyLabel("hide")

					var f = this.options.style == "array" ? base.element.formToArray(true) : base.element.formToJson();
					this.addparams(f,this.options.style);

					return true;
				},
				onloading: function (bloading) {
					if (bloading) {
						$.BodyLabel("hide");
						this.addClass("loadings");
					} else {
						this.removeClass("loadings");
					}

				},
				onfinish: function (data) {
					if (data.result) {
						$.BodyLabel(base.options.successcode, { css: "gbodybox" });

					} else {
						$.BodyLabel(data.errorCode, { css: "gerrorbox", sticky: true });
					}
					// onfinally, or onpost.done are good enough to go on
				}
			});

			// return instance
			return this;
		}

	};

	// plugin
	$.fn.ShSubmit = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.submit")) {
				$(this).data("sh.submit", new Submit($(this), options));
			}

		});
	};



	$.Sh.Delete = function (options) {


		var _options = {
			successcode: this.data("success-code"),
			onafterremove: $.getEvent(this, "onafterremove"),
			which: this.data("which")
		};


		this.ShDelete($.extend(_options, options));
		return this.data("sh.delete");
	};

	// expose default options
	$.Sh.Delete.defaults = {
		successcode: "DELETED",
		which: "li"
	};
	// constructor, not exposed
	var Delete = function (el, options) {

		this.element = el;
		// initialize
		this.init(options);
	};

	Delete.prototype = {

		init: function (options) {
			// extend options
			this.options = $.extend({}, $.Sh.Delete.defaults, options);

			var base = this;

			// on click remove context 
			// call ajax with set properties
			var o = $.Sh.Ajax.call(this.element, {
				onloading: function (bloading) {
					if (bloading) {
						$.BodyLabel("hide");
						this.addClass("loadings");
					} else {
						this.removeClass("loadings");
					}
				
				},
				onfinish: function (data) {
					if (data.result) {

						setTimeout(function () {

							base.element.closest(base.options.which).fadeOut(500, function () {

								base.element.remove();
								$.BodyLabel(base.options.successcode, { css: "gbodybox" });

								if (base.options.onafterremove) base.options.onafterremove.call(base,data);
							});
						}, 10);

					} else {
						$.BodyLabel(data.errorCode, { css: "gerrorbox", sticky: true });
					}
					// onfinally, or onpost.done are good enough to go on
				}
			});

			// return instance
			return this;
		}

	};

	// plugin
	$.fn.ShDelete = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.delete")) {
				$(this).data("sh.delete", new Delete($(this), options));
			}

		});
	};
})(jQuery);

