/// <reference path="jquery-1.5.1-vsdoc.js" />

(function ($) {


	$.fn.PluingName = function (method) {

		var settings = {
			
		};

		var methods = {
			init: function (options) {

				if (options) {
					$.extend(settings, options);
				}


				return this.each(function () {

					var $this = $(this),
					 data = $this.data('sh.pluginname');

					// If the plugin hasn't been initialized yet
					if (!data) {

						// code 
						// example call
						methods.fnname.call($this); // global fn

						$this.data('sh.pluginame', {
							target: $this,
							settings: settings
						});

					}
				});


			},
			fnname: function (src) {
				// example of function
				var s = this.data('sh.pluginname');
				$.extend(s, { srcElement: src }); // extending src of function
				return this;
			}

		};

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist');
		}



	};


})(jQuery);


// NEW plugin template


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
		//return $(this).data("sh.kangaroo");
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
