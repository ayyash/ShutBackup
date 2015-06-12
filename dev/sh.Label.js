/// <reference path="../jquery-1.4.1-vsdoc.js" />

(function ($) {
	if (!$.Sh) {
		$.Sh = {};
	};

	$.Sh.Label= function (options) {
		var _options = {
			text: this.data("label-text"),
			sticky: this.data("sticky"),
			css:  this.data("label-css"),
			closecss: 'closelabel',
			closetext: this.data("close-text"),
			showclosebtn: this.data("show-close"),
			location: this.data("label-location"),
			which: this.data("which"), // added sept 23
			showOnLoad: this.data("show-onload"),
			valid: true, // mmm
			onShow:  $.getFunction(this, "onshow"),
			onLoad:  $.getFunction(this, "onload"),
			onHide: $.getFunction(this, "onhide"),
		};
	
		this.ShLabel($.extend(_options, options));
		return this.data("sh.label");
	};


	$.Sh.Label.defaults = {
		text: $.Res.Error,
		sticky: false,
		css: '',
		closecss: 'closelabel',
		closetext: $.Res.Dismiss,
		showclosebtn: false,
		location: "afterEnd",
		showOnLoad: false,
		valid: true,
	};
	var Label= function (el, options) {

		this.options = $.extend({}, $.Sh.Label.defaults, options);

		this.element = el;

		this.$err = $("<span></span>").addClass(this.options.css).html(this.options.text);
		this.$closebtn = $("<span />").text(this.options.closetext).addClass(this.options.closecss);

		// initialize
		this.init(this.options);
	};

	Label.prototype = {

		init: function (options) {

			$.extend(this.options, options);

			if (this.options.showOnLoad) {
				this.show(this.options.text);
			}

			(this.options.onLoad) ? this.options.onLoad.call(this.element) : null;

			return this;
		},
		show: function (options) {
			var base = this;
			var s = $.extend({}, this.options, options);
			// things that can be passed on runtime:
			// text, css, which, location, sticky, showclosebtn
			
			if (!this.options.locked) {
				// show according to settings
				this.options.locked = true;

				// reset opacity
				// reset css as well

				this.$err.removeClass(this.options.newCss); // should i remove orginal css as well? no, where else would i add it back
				this.$err.addClass(s.css);
				this.$err.css("opacity", 1);
				this.$err.html(s.text);

				// save new css
				this.options.newCss = s.css;


				// where to insert, inseertAfter, insertBefore, appendTo, prependTo === afterEnd, beforeStart, beforeEnd, afterStart
				// if which is defined, it becomes the target instead of object
				var $target = s.which ? this.element.closest(s.which) : this.element;
				switch (s.location) {

					case "beforeStart":
						this.$err.insertBefore($target);
						break;
					case "afterStart":
						this.$err.prependTo($target);
						break;
					case "beforeEnd":
						this.$err.appendTo($target);
						break;
					case "afterEnd":
					default:
						this.$err.insertAfter($target);
						break;
				}

				(this.options.onShow) ? this.options.onShow.call(this.element) : null;

				if (!s.sticky) {
					base.$err.delay(3000).animate({ opacity: 0 }, "slow", function () {
						base.$err.remove();
						base.options.locked = false;
						(base.options.onHide) ? base.options.onHide.call(base.element) : null;
					});
				} else {
					this.options.valid = false; // if not sticky
					// add close button optionally
					if (s.showCloseBtn) this.$err.append(this.$closebtn);
					// make an onclick here
					
					this.$closebtn.on("click", function () {
						base.hide.call(base.element);
					});
				}


			}
			return this.element;

		},
		hide: function () {
			this.$err.remove();
			this.options.locked = false;
			(this.options.onHide) ? this.options.onHide.call(this.element) : null;

			if (this.options.sticky) {
				this.options.valid = true;
			}
			return this.element;
		}
	};

	// plugin
	$.fn.ShLabel = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.label")) {
				$(this).data("sh.label", new Label($(this), options));
			}

		});
	};


})(jQuery);
