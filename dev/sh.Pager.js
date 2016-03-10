(function ($) {
	if (!$.Sh) {
		$.Sh = {};
	};

	$.Sh.Pager = function (options) {
		// a bridge, set up options from data-

		var _options = {
			tmpl: (this.data("tmpl-id")) ? $("#" + this.data("tmpl-id")) : undefined,
			target: $(this.data("target")),
			pagesize: this.data("page-size"),
			childselector: this.data("childselector"),
			trigger: this.data("trigger"),
			dir: this.data("dir"),
			onpage: $.getFunction(this, "onpage"),
			method: this.data("method"),
			legacy: this.data("legacy")
		};
		this.ShPager($.extend(_options, options));
		return this.data("sh.pager");
	};

	// expose default options
	$.Sh.Pager.defaults = {
		tmpl: $("#tmpl_paged_array"),
		pagesize: $.Res.PageSize || 25, // reassign in ui.data
		childselector: "li",
		trigger: ".amore",
		dir: "+",
		method: "GET",
		legacy: true
	};
	// constructor, not exposed
	var Pager = function (el, options) {

		this.options = $.extend({}, $.Sh.Pager.defaults, options);
		this.element = el;
		this.template = this.options.tmpl.length ? this.options.tmpl : null;
		this.triggerElement = this.element.find(this.options.trigger);
		this.Ajax = null;
		if (!this.options.method) this.options.method = "GET";
		// initialize
		this.init();

	};

	Pager.prototype = {

		init: function () {
			// extend options

			var base = this;

			this.Ajax = $.Sh.Ajax.call(base.element, {
				method: base.options.method,
				trigger: base.options.trigger,
				onfinish: function (data, trigger) {
					if (data.result) {


						// check data.result first ,not needed tho if data.d contains the error
						var $resultset = (base.template) ? $(base.template.mustache(data.d)) : $($.parseHTML(data.d));
						
						// append list to target then rewire 
						// CHANGE: make append or prepend optional
						base.options.dir == "+" ? $resultset.appendTo(base.options.target) : $resultset.prependTo(base.options.target);
						$.ShRewire($resultset);

						// check page size, if result set is less than pagesize, hide link

						if (data.d.IsLastPage || $resultset.filter(base.options.childselector).length < base.options.pagesize) {
							if (base.options.legacy) {
								// newer version
								base.triggerElement.hide();
							} else {
								this.hide();
								// legacy // note to self: trigger is not the ajax trigger, the ajax trigger here is pager itself, reason? to style pager with its amore together
							}
							
						}

						// assign to element data anything that needs to be reposted

						this.data("sh.ajax").addparams(data.pageparams);


						// on page, return results only
						if (base.options.onpage) base.options.onpage.call(base, $resultset.filter(base.options.childselector)); // why didnt i think of this before?!

					} else {
						$.BodyLabel(data.errorCode, { css: "gerrorbox", sticky: true });
					}

				}
			});



			// return instance
			return this;
		}

	};

	// plugin
	$.fn.ShPager = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.pager")) {
				$(this).data("sh.pager", new Pager($(this), options));
			}

		});
	};


})(jQuery);

