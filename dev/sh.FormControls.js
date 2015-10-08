

(function ($) {
	if (!$.Sh) {
		$.Sh = {};
	};

	$.Sh.Radio = function (options) {
		// a bridge, set up options from data-
		var _options = {
			container: this.data('container'),
			css: this.data('checked'),
			onCheck: $.getFunction(this, "oncheck"),
			onUncheck: $.getFunction(this, "onuncheck"),
			onChange: $.getFunction(this, "onchange"),
			onDblCheck: $.getFunction(this, "ondblcheck")
		};


		this.ShRadio($.extend(_options, options));
		
		return this.data("sh.radio");
	};

	// expose default options
	$.Sh.Radio.defaults = {
		container: "label",
		css: "checked"
	};
	// constructor, not exposed
	var Radio = function (el, options) {

		this.element = el;

		this.options = $.extend({}, $.Sh.Radio.defaults, options);

		this.control = this.element.find('input[type="radio"]:first');

		this.group = $('input[name="' + this.control.attr("name") + '"]'); // get the whole group

		this.checked = this.control.is(":checked");
		if (this.checked) this.element.addClass(this.options.css);

		// initialize
		this.init();
	};

	Radio.prototype = {

		init: function () {

			var base = this;

			// TODO, disabled and readonly, hover effect


			base.control.on("click", function () {
				// if already checked, fire special event
				if (base.checked) {
					if (base.options.onDblCheck) base.options.onDblCheck.call(base);
				} else {
					// remove checked from group (TODO: may be i should exclude current?)
					base.group.each(function () {
						
						if (!$(this).is(base.control)) {
							
							var shRadio = $(this).closest(base.options.container);
							if (shRadio.data("sh.radio")) {
								//shRadio.removeClass(base.options.css).data("sh.radio").checked = false;
								shRadio.data("sh.radio").uncheck();
							}
						}
					});
					base.element.addClass(base.options.css);
					base.checked = true;
					
					if (base.options.onCheck) base.options.onCheck.call(base);
				}



			});
			base.control.on("change", function () {
				if (base.options.onChange) base.options.onChange.call(base, this.checked);
			});


			return this;

		},
		uncheck: function () {

			var base = this;

			base.control.removeProp('checked');
			base.element.removeClass(base.options.css);
			base.checked = false;
			
			if (base.options.onUncheck) base.options.onUncheck.call(base);
			return base;
		},
		add: function (elememt) {
			// add element to group
			this.group.add(element);
		}

	};

	// plugin
	$.fn.ShRadio = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.radio")) {
				$(this).data("sh.radio", new Radio($(this), options));
			}

		});
	};

	$.Sh.RadioGroup = function (options) {
		var $radiogroup = this,
			container = this.data("container") || "label",
			css = this.data("css"),
			$containers = this.find(container);

		// for each container, Radio
		$containers.each(function () {
			var _label = $.Sh.Radio.call($(this), $.extend({ container: container, css: css }, options));
			if (_label.checked) $radiogroup.data("selected",_label);
		});

		
	};


	// CHECKBOX

	$.Sh.Checkbox = function (options) {
		// a bridge, set up options from data-
		var _options = {
			css: this.data("css"),
			onCheck: $.getFunction(this, "oncheck"),
			onUncheck: $.getFunction(this, "onuncheck")
		};


		this.ShCheckbox($.extend(_options, options));
		return this.data("sh.checkbox");
	};

	// expose default options
	$.Sh.Checkbox.defaults = {
		css: 'checked'
	};
	// constructor, not exposed
	var Checkbox = function (el, options) {

		this.element = el;

		// extend options
		this.options = $.extend({}, $.Sh.Checkbox.defaults, options);

		this.control = this.element.find('input[type="checkbox"]:first');

		this.group = $('input[name="' + this.control.attr("name") + '"]'); // get the whole group

		this.checked = this.control.is(":checked");
		if (this.checked) this.element.addClass(this.options.css);

		// initialize
		this.init();
	};

	Checkbox.prototype = {

		init: function (options) {

			var base = this;

			// TODO, disabled and readonly, hover effect


			base.control.on("click", function () {
				
				// TODO: if already checked, fire special event
				base.toggle(this.checked);

			});
			
			return this;

		},
		check: function(){
			this.toggle(true);
		},
		uncheck: function () {
			this.toggle(false);
		},
		toggle: function (checked) {
			var base = this;
			checked ? base.element.addClass(base.options.css) : base.element.removeClass(base.options.css);
			checked ? base.control.prop('checked', true) : base.control.removeProp('checked');
			base.checked = checked;

			if (checked && base.options.onCheck) base.options.onCheck.call(base);
			if (!checked && base.options.onUncheck) base.options.onUncheck.call(base);

		},
		add: function (elememt) {
			// add element to group
			this.group.add(element);
		}


	};

	// plugin
	$.fn.ShCheckbox = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.checkbox")) {
				$(this).data("sh.checkbox", new Checkbox($(this), options));
			}

		});
	};


	$.Sh.TallField = function () {
		// for tall fields only, hide background image of required if text is larger than 90% of field

		var _currentW = this.width() * 0.9,
			$this = this;
		this.on("blur", function () {
			var s = $("<span />").text($this.ShTrim()).appendTo($.props.$body);
			var _w = s.width();
			s.remove();

			if (_w > _currentW) {
				$this.addClass("clearit");
			} else {
				$this.removeClass("clearit");
			}
		});

		this.trigger("blur");
		
	};

})(jQuery);

