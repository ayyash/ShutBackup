(function ($) {


	if (!$.Sh) {
		$.Sh = {};
	};

	if (!$.UiSh) {
		$.UiSh = {};
	};
	var bodyLabel;

	$(function () {

		
		// prepare touch
		if (jQuery.support.touch) {
			$.props.$body.addClass("touch");
		} else {
			$.props.$body.addClass("notouch");
		}

		//TODO: BehaviorsReady
		// function that shows a general error badge in body
		bodyLabel = $.Sh.Label.call($.props.$body,{
			text: "",
			css: "gerrorbox",
			location: "beforeEnd",
			sticky: false
		});
		

	});
	$.BodyLabel = function (key, options) {
		bodyLabel.hide();
		//stickyLabel.hide();
		if (key != "hide") {
			if (!options.sticky) {
				options.showCloseBtn = false;
			}
			// TODO: if screensize is less than 460, use Tiny as default namespace
			
			bodyLabel.show($.extend({ text: $.ErrMessage(key, null, options.ns ? options.ns : "Detailed") }, options));

		}
	};

	$.ErrMessage = function (errorCode, fallBack, ns) {
		if (!ns) ns = "Tiny";
		var errorCode = errorCode || "Unknown",
			errorMessage = fallBack || $.Res[ns]["Unknown"];

		if (errorCode != 0) {
			errorCode = $.Res[ns][errorCode];
			if (errorCode) {
				errorMessage = errorCode;
			}
		}
		return errorMessage;

	}

	// added by shut framework, keep an eye when updating
	$.fn.mustacheparse = function () {
		return $(this).map(function (i, elm) {
			var template = $.trim($(elm).html());
			var output = Mustache.parse(template);

			return $(output).get();
		});
	};

	$.mustache = function (template, view, partials) {
		return Mustache.render(template, view, partials);
	};

	$.fn.mustache = function (view, partials) {
		return $(this).map(function (i, elm) {
			var template = $.trim($(elm).html());
			var output = $.mustache(template, view, partials);
			// clean output before jquerying
			//TODO:
			return $(output).get();
		});
	};
	$.fn.ShPosition = function (context) {

		// return offset of object relative to context
		var offset = this.offset(),
			contextOffset = context.offset();
		//_debug({ top: offset.top + context.scrollTop() - contextOffset.top, left: offset.left - contextOffset.left },"offset");
		return { top: offset.top + context.scrollTop() - contextOffset.top, left: offset.left - contextOffset.left };

	};



	$.fn.ShApplyHiLight = function () {
		if (this.effect) {
			return this.effect("highlight", {}, 1000);
		} else {
			return this;
		}
	};
	$.fn.ShBadge = function (text, location, css) {
		// prepeare sherror with text
		this.ShLabel({
			text: text || $.Res.SomeError,
			css: css || "redbox block",
			location: location || "beforeStart",
			sticky: true
		});

		return this;
	};
	$.fn.ShTrim = function (value) {
		// trim and set value, unless its file type!
		if (!this.is(":file"))
			value ? this.val($.trim(value)) : this.val($.trim(this.val()));
		return this.val();
	}
	$.fn.ShVal = function (value) {
		// set value then fire event
		//_debug(value, "changed");
		return this.val(value).trigger("change");
	}


	// $.Sh collection


	$.UiSh.removeParent = function (data, fnAfterRemove) {
		// remove which parent after done


		if (data.result) {
			var $t = this;

			setTimeout(function () {
				$t.closest($t.data("which") || "li").fadeOut(500, function () {

					$(this).remove();
					// i need a return or subfunction!
					if (fnAfterRemove && typeof (fnAfterRemove) == "function") {
						fnAfterRemove.call($t,data);
					}
				});
			}, 10);
		} else {


			this.ShLabel({
				which: this.data("which"),
				text: $.ErrMessage(data.errorCode,this.data("error-message")),
				css: this.data("errorcss"),
				location: this.data("error-location") || "beforeEnd",
				sticky: true
			});
			this.data("sh.label").show();
		}
	};

	// pretty price behavior
	$.Sh.PrettyPrice = function () {
		this.text(this.text().toPrettyPrice());
	};
	
	// Wizardlist. do i really need this here?
	// strip a tags from anything that comes after selected li
	$.Sh.WizardList = function () {
		this.ShWizardList();
	};
	var WizardList = function (el) {

		var boff = false;
		$.each(el.find(">li"), function () {
			var $t = $(this);
			if ($t.hasClass("selected") || boff) {
				boff = true;
				$t.addClass("inactive").find("a").contents().unwrap();

			}
		});
		return this;
	};

	// plugin
	$.fn.ShWizardList = function () {
		return this.each(function () {
			if (!$(this).data("sh.wizardlist")) {
				$(this).data("sh.wizardlist", new WizardList($(this)));
			}

		});
	};

	$.Sh.Confirm = function (options) {
		var _options = {
			message: this.data("message")
		};

		this.ShConfirm($.extend(_options, options));
	};

	// constructor, not exposed
	var Confirm = function (el, options) {
		this.options = options;
		var base = this;
		// initialize
		el.click(function (e) {
			var $this = $(this);
			if (e.isDefaultPrevented()) return false;

			if (!window.confirm(base.options.message.replace(/\\n/gim, "\n"))) {
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		});

		return this;
	};

	// plugin
	$.fn.ShConfirm = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.confirm")) {
				$(this).data("sh.confirm", new Confirm($(this), options));
			}

		});
	};

	// jquery-ui tip
	$.Sh.Tip = function (options) {
		var _options = {
			_my: this.data("my"),
			_at: this.data("at"),
			_extra: this.data("addclass")
		};
		_options = $.extend(_options, options);

		this.ShTip(_options);
	};
	$.Sh.Tip.defaults = {
		_my: "center-2 bottom-15",
		_at: "center top",
		_extra: ""
	};
	// constructor, not exposed
	var Tip = function (el, options) {
		this.options = options;
		var base = this;

		this.options = $.extend({}, $.Sh.Tip.defaults, options);

		if (jQuery.support.touch) {
			return this;
		}

		el.tooltip({
			show: false,
			hide: false,
			position: {
				my: base.options._my,
				at: base.options._at,
				using: function (position, feedback) {
					var $t = $(this).css(position)
						.addClass(feedback.vertical).addClass(base.options._extra);
					if (feedback.element.width < 50) $t.addClass("tight");
					else if (feedback.element.width > 100) $t.addClass("wide");

				}
			}
		});
		el.attr("data-title", el.attr("title"));

		return this;
	};

	// plugin
	$.fn.ShTip = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.tip")) {
				$(this).data("sh.tip", new Tip($(this), options));
			}

		});
	};

})(jQuery);