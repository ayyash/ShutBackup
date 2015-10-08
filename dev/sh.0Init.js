
Array.prototype.remove = function (from, to) {
	this.splice(from, !to || 1 + to - from + (!(to < 0 ^ from >= 0) && (to < 0 || -1) * this.length));
	return this.length;
};
String.prototype.toSentenceCase = function () {
	return this.substring(0, 1).toUpperCase() + this.substring(1);
};

String.prototype.format = function () {

	if (arguments.length == 0)
		return this;
	var params, str = this;

	if (arguments.length > 1) {
		params = $.makeArray(arguments);
	} else {
		params = arguments;
	}
	$.each(params, function (i, n) {
		str = str.replace(new RegExp("\\{" + i + "\\}", "g"), n);
	});

	return str;
};
String.prototype.isNullOrEmpty = function () {
	if (this == null || this == "undefined" || $.trim(this).length == 0) return true;
	return false;
};
String.prototype.toBoolean = function () {

	if (this.toString() === "true" || this.toString() === "True") return true;
	return false;
};
// CHANGED to string instead of Number, beacuase it is rare that I use Number
String.prototype.toPrettyPrice = function () {
	var ret = Number(this.replace(/,/gi, ""));	
	if (isNaN(ret)) return this;
	// read number, tofixed of 2 digits, insert "," in every three digits, if its already fixed, unfix first

	ret = ret.toFixed(2),
		x = ret.toString().split('.'),
		x1 = x[0],
		x2 = x.length > 1 ? '.' + x[1] : '',
		rgx = /(\d+)(\d{3})/;

	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
};

String.prototype.toNormalNumber = function () {
	// read string with "," unace
	return this.replace(/,/gi, "");

};
// CHANGED to string instead of Number
String.prototype.toPrettyNumber = function () {
	// read number, insert "," in every three digits
	var ret = Number(this.toString().replace(/,/gi, ""));
	if (isNaN(ret)) return this;

	var x = ret.toString().split('.'),
		x1 = x[0],
		x2 = x.length > 1 ? '.' + x[1] : '',
		rgx = /(\d+)(\d{3})/;

	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
};


function _debug(o, message, type) {
	if (_mdebug) {
		if (window.console) {
			type == "e" ? window.console.error(message, o) : window.console.info("%c " + message, "background: #222; color: #bada55", o);
		}
	}
}
//gone: var $body;

(function ($) {

	// initialize window
	$.props = { width: 0, height: 0, $window: $(window), $body: $(document.body), doctitle: document.title, isFixed: false};
	if (!$.Res) {
		$.Res = {};
	}
	$body = $(document.body); // to remove
	$.setContentWidth = function() {
		// determine width of viewport, and resize upon window resize
		$.props.width = $(window).width();
		$.props.height = $(window).height();
	}


	$(window).ready(function () {

		$.props.$body = $(document.body); // double checking

		jQuery.support.placeholder = (function () {
			var i = document.createElement('input');
			return 'placeholder' in i;
		})();

		jQuery.support.touch = (function () {
			return 'ontouchstart' in window || navigator.msMaxTouchPoints;
		})();

		$.setContentWidth();
		if (!$.props.isFixed) $(window).resize($.setContentWidth);


	});



})(jQuery);
//var window_width, window_height, $window, $body, fixed_width, document_title;

