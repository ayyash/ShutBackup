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
			onpage: $.getEvent(this, "onpage")
		};

		this.ShPager($.extend(_options, options));
	};

	// expose default options
	$.Sh.Pager.defaults = {
		tmpl: $("#tmpl_paged_array"),
		pagesize: 25, // reassign in ui.data
		childselector: "li",
		trigger: ".amore"
	};
	// constructor, not exposed
	var Pager = function (el, options) {

		this.options = $.extend({}, $.Sh.Pager.defaults, options);

		this.element = el;
		this.template = this.options.tmpl.length ? this.options.tmpl : null;
		this.options.trigger = this.element.find(this.options.trigger);
		
		
		// initialize
		this.init(options);
	};

	Pager.prototype = {

		init: function (options) {
			// extend options

			var base = this;


			$.Sh.Ajax.call(this.element, {
				method: "GET",
				onfinish: function (data, trigger) {
					if (data.result) {


						// check data.result first ,not needed tho if data.d contains the error
						var $resultset = (base.template) ? $(base.template.mustache(data.d)) : $($.parseHTML(data.d));

						// append list to target then rewire 
						$resultset.appendTo(base.options.target);
						$.ShRewire($resultset);
					
						// check page size, if result set is less than pagesize, hide link
						
						if (data.d.IsLastPage || $resultset.filter(base.options.childselector).length < base.options.pagesize) {
							this.hide();
						}

						// assign to element data anything that needs to be reposted
						
						this.data("sh.ajax").addparams(data.pageparams);


						// on page, return results only
						if (base.options.onpage) base.options.onpage.call(this, $resultset);

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

