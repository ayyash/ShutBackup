/// <reference path="jquery-1.5.1-vsdoc.js" />


(function ($) {
	if (!$.Sh) {
		$.Sh = {};
	};

	$.Sh.Kangaroo = function (options) {
		// a bridge, set up options from data-
		var _options = {
			key: this.data("name")
		};
		

		this.ShKangaroo($.extend(_options, options));
		return $(this).data("sh.kangaroo");
	};

	// expose default options
	$.Sh.Kangaroo.defaults = {
		key: "lulu"
	};
	// constructor, not exposed
	var Kangaroo = function (el, options) {
				
		this.element = el;
		// Sample Function, keep this to minimum
		this.functionName = function (paramaters) {
			_debug("can i not do this?");
		};

		// initialize
		this.init(options);
	};

	Kangaroo.prototype = {

		init: function (options) {
			// extend options
			this.options = $.extend({}, $.Sh.Kangaroo.defaults, options);
			// ... 

			// return instance
			return this;
		},
		ayyash: function () {
			_debug(this.options.key, "default value");
		}

	};

	// plugin
	$.fn.ShKangaroo = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.kangaroo")) {
				$(this).data("sh.kangaroo", new Kangaroo($(this), options));
			} 

		});
	};


})(jQuery);


// multiple ways to call it
// <div data-behavior="Kangaroo" data-options...>
// $("elem").ShKangaroo(options)
// $.Sh.Kangaroo.call(this,options);
// to call a method
// this.data("sh.kangaroo").functionname();
// optiosn exposed
// this.data("sh.kangaroo").options
