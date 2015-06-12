


(function ($) {
	
	// main definitions first

	$.props._BehaviorsReady = false;

	var getBehavior = function (o) {
		try {
			if ($.Sh[o] && typeof ($.Sh[o]) == "function") {
				// shplugin
				return $.Sh[o];

			} else if (window[o] && typeof (window[o]) == "function") {
				// temporarily. find function
				return window[o];

			}
			_debug(o, "Behavior is missing", "e");
			return null;
		} catch (e) {
			// faill silently
			_debug(o, "Behavior", "e");
			_debug(e, "Error", "e");
			return null;
		}
	};
	$.getFunction = function ($context, fn) {
		var fn = $context.data(fn);

		if (!fn || fn == null) return undefined;
		//if (window[fn] && typeof (window[fn]) == "function") {
		//	return window[fn];
		//}
		if ($.UiSh[fn] && typeof ($.UiSh[fn]) == "function") {
			return $.UiSh[fn];
		}
		return fn;
	};
	// document clicks
	$.popbasket = [];

	$.Behaviors = function (context, nonGreedy) {
		// group data-behavior, and run functions with prepare-name of behavior
		// if nonGreedy do not include context
		var $allbehaviors;
		if (context == null)
			$allbehaviors = $("[data-behavior]");
		else
			$allbehaviors = nonGreedy ? $("[data-behavior]", context) : jQuery.merge(context.filter("[data-behavior]"), $("[data-behavior]", context));


		$.each($allbehaviors, function (i, o) {
			var $t = $(this);
			// make multiple
			var fns = $t.attr("data-behavior").split(",");

			$.each(fns, function (i, o) {
				var b = getBehavior(o);

				b ? b.call($t) : null;
			});
		});

		// also fire onbehaviors ready
		$.props.$body.trigger("BehaviorsReady", [context]);

	};


	$.fn.ApplyBehavior = function (behaviors) {
		var fns = behaviors.split(",");
		var $t = $(this);
		$.each(fns, function (index, o) {
			var b = getBehavior(o);
			b ? b.call($t) : null;
		});
		return this;
	}



	$.ShRewire = function (context, nonGreedy) {

		$.Behaviors(context, nonGreedy);
		// try in timeout for onload events

		if ($.Sh.Modals) {

			$.Sh.Modals.rewire(context);
		}

		if ($.rewireload != null && typeof $.rewireload == "function") {
			$.rewireload(context);
		}
	}

	$.OnDocumentClick = function (element, fn) {
		element.data("ondocumentclick", fn);
		$.popbasket.push(element);

	};

	// create a loop to extend $.fn with Sh functions?! am i an idiot?
	$(function () {
		// initialize behaviors
		$.Behaviors();
		$.props._BehaviorsReady = true;

		$.props.$body.on("click", function (e) {
			// fire attached events
			$.each($.popbasket, function (i, o) {
				var fn = $.getFunction(o,"ondocumentclick");//o.data("ondocumentclick");
				fn && fn.call(o, e);
				
			});
		});

	});



})(jQuery);

