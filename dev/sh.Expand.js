/// <reference path="../jquery-1.4.1-vsdoc.js" />
(function ($) {
	if (!$.Sh) {
		$.Sh = {};
	};

	$.Sh.Expands = function (options) {
		// a bridge, set up options from data-
		var _options = {
			onInit: $.getFunction(this,"oninit"),
			onShow: $.getFunction(this,"onshow"),
			onHide: $.getFunction(this, "onhide"),
			onToggle: $.getFunction(this, "ontoggle"),
			onBeforeShow: $.getFunction(this, "onbeforeshow"),
			onBeforeHide: $.getFunction(this, "onbeforehide"),
			guts: this.data("guts"),
			src: this.data("hsrc"),
			state: this.data("state"),
			active: this.data("active"),
			effect: this.data("effect"),
			togglecss: this.data("toggle-css"),
			hidesrc: this.data("hide-src"),
			showsrc: this.data("show-src")
		};

		this.ShExpands($.extend(_options, options));
		return this.data("sh.expands");
	};



	// expose default options
	$.Sh.Expands.defaults = {
		guts: '>.guts',
		src: '>.h',
		active: true,
		effect: "slide",
		togglecss: "toggle"
	};
	// constructor, not exposed
	var Expands = function (el, options) {

		this.element = el;

		// extend options
		this.options = $.extend({}, $.Sh.Expands.defaults, options);


		this.srcElement = el.find(this.options.src);
		this.gutsElement = el.find(this.options.guts);


		// initialize
		this.init();
	};

	Expands.prototype = {
		// TODO: change src and guts on runtime
		
		init: function () {

			var base = this;


			this.srcElement.length && this.element.on("click", base.options.src, function (e) {
				base._click(e);
			});

			this.options.hidesrc && this.element.on("click", base.options.hidesrc, function (e) {
				base._click(e, "hide");
			});

			this.options.showsrc && this.element.on("click", base.options.showsrc, function (e) {
				base._click(e, "show");
			});

			base.options.onInit &&  base.options.onInit.call(this);

			// if to show show by default 
			if (base.options.state == "show") {
				base.show();
			} else {
				base.hide();
			}

			// return instance
			return this;
		},
		addtrigger: function (trigger, verb) {
			// add trigger on runtime from anywhere
			var base = this;

			trigger.on("click", function (e) {
				base._click(e, verb);
			});
		},
		addguts:function(element){
			// add element as a new gut?
			this.gutsElement.add(element);
		},
		_click: function (e, verb) {
			var base = this;
			e.preventDefault();
			if (!base.options.active) return;


			if (verb == "hide") {
				base.hide();
				return;
			}
			if (verb == "show") {
				base.show();
				return;
			}
			// normally, toggle
			base.toggle();
			
		},
		show: function () {

			if (!this.options.active) return;

			if (this.options.onBeforeShow) {
				this.options.onBeforeShow();
				return this;
			}

			// show , if onToggle is defined, i should find out whether to call it or not according to what? visible state
			
			if (!this.gutsElement.is(":visible")) {
				
				this.options.onToggle &&  this.options.onToggle.call(this); // fire toggle
				switch (this.options.effect) {
					case "slide":
						this.gutsElement.slideDown(50); // show
						break;
					case "fade":
						this.gutsElement.fadeIn();
						break;
					case "none":
						this.gutsElement.show();
						break;
				}
				
			}
			// i think i should return if element is already visibt
			this.options.state = "show";
			this.element.addClass(this.options.togglecss);
			this.options.onShow && this.options.onShow.call(this); // fire onshow anyway // double check
			return this;

		},
		toggle: function () {
			if (!this.options.active) return;

			// for effects of slide and fade
			if (this.gutsElement.is(":visible")) {
				this.hide();
			} else {
				this.show();
			}
			
			return this;

		},
		hide: function () {
			if (!this.options.active) return;

			if (this.options.onBeforeHide) {
				this.options.onBeforeHide();
				return this;
			}

			if (this.gutsElement.is(":visible")) {
				this.options.onToggle && this.options.onToggle.call(this); // fire toggle, this shouldnt fire always
				switch (this.options.effect) {
					case "slide":
						this.gutsElement.slideUp(100);
						break;
					case "fade":
						this.gutsElement.fadeOut();
						break;
					case "none":
						this.gutsElement.hide();
						break;
				}

			}
			this.options.state = null;
			this.element.removeClass(this.options.togglecss);
			this.options.onHide && this.options.onHide.call(this);
			return this;
		},
		setActive: function (bActive) {
			this.options.active = bActive;
		}

	};

	// plugin
	$.fn.ShExpands = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.expands")) {
				$(this).data("sh.expands", new Expands($(this), options));
			}

		});
	};

	$.Sh.AltExpands = function () {
		// on click to show hide src, show guts, on hide, show src

		$.Sh.Expands.call(this, {
			onShow: function () {
				this.srcElement.hide();
			},
			onHide: function () {
				this.srcElement.show();
			}
		});

	};
	$.Sh.ExpandOnce = function () {
		$.Sh.Expands.call(this, {
			effect: "none",
			onShow: function () {
				this.srcElement.remove();
			}
		});
	};

	$.Sh.PopList = function (options) {
		// click element to show hide a well position absolute layer
		var _options = {
			onShow: function () {
				// position
				this.gutsElement.position({
					of: this.srcElement,
					my: "center top",
					at: "center bottom",
					collision: "fit fit" // watch this
				});
			}
		};


		var o = $.Sh.Expands.call(this, $.extend(_options, options));
		this.data("ondocumentclick", function (e) {
			
			if (!jQuery.contains(this.get(0), e.target)) {
				o.hide();
			}
		});
		$.popbasket.push(this);

		return o;
	};

	$.Sh.ExpandLabel = function (options) {
		// onshow or hide, change srcelemnet according to passed attributes
		var slabel, hlabel;

		var _thisoptions = {
			mono: this.data("mono"),
			listsize: this.data("list-size"),
			gutscss: this.data("guts-css"),
			selector: this.data("selector"),
			slabel: this.data("show-label"),
			hlabel: this.data("hide-label")
		}
		_thisoptions = $.extend({}, $.Sh.ExpandLabel.defaults, _thisoptions, options);

		if (_thisoptions.mono) {
			this.find(_thisoptions.selector + ":gt(" + (_thisoptions.listsize - 1) + ")").addClass(_thisoptions.gutscss);
		}


		// reset options
		var _options = {
			onInit: function () {
				(this.options.state == "show") ? this.srcElement.html(_thisoptions.hlabel) : this.srcElement.html(_thisoptions.slabel);
				if (this.gutsElement.length == 0) this.srcElement.hide();
			},
			onShow: function () {
				this.srcElement.html(_thisoptions.hlabel);
			},
			onHide: function () {
				this.srcElement.html(_thisoptions.slabel);
			}

		};

		var o = $.Sh.Expands.call(this, $.extend(_options, options));
		return o;

	};

	$.Sh.ExpandLabel.defaults = {
		mono: false,
		gutscss: "guts",
		listsize: 3,
		selector: "li",
		slabel: $.Res.More,
		hlabel: $.Res.Less
	};

	$.Sh.FilterList = function (options) {
		// a bridge, set up options from data-
		//attach Expands first then use to gather items


		var o = $.Sh.PopList.call(this, options);
		var _options = {
			itemselector: this.data("itemselector"),
			selected: this.data("selected"), // object
			selectedValue: this.data("selected-value"), // value
			css: this.data("css"),
			onchange: this.data("onchange"),
			html: this.data("html"),
			expands: o
		};

		this.ShFilterList($.extend(_options, options));

	};

	// expose default options
	$.Sh.FilterList.defaults = {
		itemselector: "li",
		css: "selected",
		html: false
	};
	// constructor, not exposed
	var FilterList = function (el, options) {
		// extend options
		this.options = $.extend({}, $.Sh.FilterList.defaults, options);
		this.element = el;

		this.expands = this.options.expands; // inherits expands

		this.items = this.expands.gutsElement.find(this.options.itemselector);

		// if no selected, find selected
		if (!this.options.selected) {
			// find selected by value or by selected css
			this.options.selected = this.options.selectedValue ? this.items.filter("[data-value='{0}']".format(this.options.selectedValue)) : this.items.filter("."+this.options.css).first();
			
			// still not found, get first
			if (!this.options.selected.length)
				this.options.selected = this.items.first();
		}

		// initialize
		this.init(options);
	};

	FilterList.prototype = {
		init: function (options) {

			var base = this;
			// update src element with selected element
			this.expands.gutsElement.on("click", this.options.itemselector, function (e) {
				base._click(e, $(this));
			});

			// select selected item
			this.select(this.options.selected);

		},
		_click: function (e, src) {
			// change selected
			if (!this.options.selected.is(src)) {
				this.items.removeClass(this.options.css);
				this.select(src);
				this.options.onchange && this.options.onchangec.call(this, src);
			}

			//hide
			this.expands.hide();
			//e.preventDefault();
			
		},
		additem: function (item) {
			$.merge(this.options.items, item);
		},
		select: function (item) {
			item.addClass(this.options.css);
			this.options.html ? this.expands.srcElement.html(item.html()) : this.expands.srcElement.text(item.text()); // watch
			this.options.selected = item;

		}
	};

	// plugin
	$.fn.ShFilterList = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.filterlist")) {
				$(this).data("sh.filterlist", new FilterList($(this), options));
			}

		});
	};


	// TABS: client tabs
	$.Sh.Tabs = function (options) {
		// guts
		// exapnds, after adding group and guts

		var _options = {
			onSelect: $.getFunction(this,"onselect"),
			onLoad: $.getFunction(this,"onload"),
			toggle: this.data("toggle"),
			effect: this.data("effect"),
			tabSelector: this.data("tabs"),
			selectcss: this.data("selected-css")
		};


		this.ShTabs($.extend(_options, options));
		return $(this).data("sh.tabs");
	};

	// expose default options
	$.Sh.Tabs.defaults = {
		delay: false,
		toggle: false,
		effect: "slide",
		selectcss: "selected"
	};
	
	var Tabs = function (el, options) {

		this.element = el;
		// extend options
		this.options = $.extend({}, $.Sh.Tabs.defaults, options);

		this.collection = [];
		this.group = this.element.find(this.options.tabSelector);

		
		// initialize
		this.init();
	};

	Tabs.prototype = {

		init: function () {
			
			var base = this;

			$.each(base.group, function (i, o) {
				var expands = $.Sh.Expands.call($(o), {effect: base.options.effect});
				expands.gutsElement = $($(o).data("guts")); // TODO: context
				
				base.collection.push(expands);
			});

			// selected or first item
			var selected = base.group.filter("." + base.options.selectcss);
			base.selected = selected.length ? selected.data("sh.expands") : base.group.first().data("sh.expands");

			base.group.on("click", function (e) {
				e.preventDefault();
				// select tab
				base.select($(this).data("sh.expands"));

			});

			// on load may change selected
			base.options.onLoad && base.options.onLoad.call(base);

			// select if one is selected
			base.selected && base.select(base.selected);

			// return instance
			return this;
		},
		select: function (item) {
			// make all unselected and make item selected
			// fire hide all, then show this
			var base = this;
			if (item.options.state == "show" && !base.options.toggle) return;

			$.each(base.collection, function (i, o) {
				o.hide();
				o.element.removeClass(base.options.selectcss);
			});

			item.show();
			item.element.addClass(base.options.selectcss);

			base.selected = item;

			base.options.onSelect && base.options.onSelect.call(base);
		}
		
	};

	// plugin
	$.fn.ShTabs = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.tabs")) {
				$(this).data("sh.tabs", new Tabs($(this), options));
			}

		});
	};


})(jQuery);

