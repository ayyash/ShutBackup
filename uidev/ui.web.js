/// <reference path="jquery-1.5.1-vsdoc.js" />


(function ($) {

	
	// keep this, add whatever behaviors need to be rewired after ajax placement
	$.rewireload = function (context) {
		// rewire load with context, if null, rewire all body
		//Placeholders();

		// reestablish google links if available
		if (window.DataGA) {
			DataGA(context);
		}

	}

	$.props.$body.on("BehaviorsReady", function (e, context) {
		//FocusDefault(context || $body);

	});
	$(function () {
		// track errors
		window.errors = 0;

		// need another sticky error, with a button to close error
		$.rewireload();
	
		$.ThrowOut();

	});
	$.ThrowOut = function () {
		$(document).ajaxSuccess(function (event, xhr, settings, data) {

			if (data.result && data.redirectUrl) {
				window.location.href = data.redirectUrl;
			}
		});
	};

})(jQuery);

