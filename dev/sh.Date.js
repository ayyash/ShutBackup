/// <reference path="jquery-1.5.1-vsdoc.js" />

(function ($) {
	if (!$.Sh) {
		$.Sh = {};
	};
	
	$.Sh.Date = function (options) {
		// a bridge, set up options from data-
		
		var _options = {
			changeMonth: this.data("changemonth"),
			changeYear: this.data("changeyear"),
			dateFormat: this.data("dateformat"),
			maxDate: this.data("maxdate"),
			minDate: this.data("mindate"),
			defaultDate: this.data("default-date")
		};

		this.ShDate($.extend(_options, options));		
		return this.data("sh.date");
	};

	// expose default options
	$.Sh.Date.defaults = {
		dateFormat: $.Res.Localization.DateFormat,
		maxDaet: null,
		minDate: null
	};
	// constructor, not exposed
	var DateControl = function (el, options) {

		// extend options
		this.options = $.extend({}, $.Sh.Date.defaults, options);

		this.element = el;

		// initialize
		this.init();
	};

	DateControl.prototype = {

		init: function () {
			
			var base = this;
			// if default value set, pass setDate

			this.element.datepicker({
				dateFormat: base.options.dateFormat,
				changeMonth: base.options.changeMonth,
				changeYear: base.options.changeYear,
				minDate: base.options.minDate,
				maxDate: base.options.maxDate,
				defaultDate: base.options.defaultDate
			});


			// this.element.datepicker()
			this.instance = this.element.data("datepicker");

			

			// return instance
			return this;
		},
		setLimit: function (date, limit) {
			if (!date || date == "") return this;
			date = $.datepicker.parseDate(this.options.dateFormat, date, this.instance.settings);
			this.element.datepicker("option", limit == "min" ? "minDate" : "maxDate", date);

			return this;
		},
		removeLimit: function (limit) {
			this.element.datepicker("option", limit == "min" ? "minDate" : "maxDate", null);
			return this;
		}

	};

	// plugin
	$.fn.ShDate= function (options) {
		return this.each(function () {
			if (!$(this).data("sh.date")) {
				$(this).data("sh.date", new DateControl($(this), options));
			}

		});
	};


	// date range
	$.Sh.DateRange = function () {
		
		this.ShDateRange();
		return this.data("sh.daterange");
	};
	var DateRangeControl = function (el) {

		var dateFrom = el.find("[data-from]"),
			dateTo = el.find("[data-to]"),
			_this = this;

		this.dateFromO = $.Sh.Date.call(dateFrom).setLimit(dateTo.val(), "max");
		this.dateToO = $.Sh.Date.call(dateTo).setLimit(dateFrom.val(), "min");

		
		dateFrom.datepicker("option", "onSelect", function (date) { _this.dateToO.setLimit(date, "min") });
		dateTo.datepicker("option", "onSelect", function (date) { _this.dateFromO.setLimit(date, "max") });
	};

	
	// plugin
	$.fn.ShDateRange = function () {
		return this.each(function () {
			if (!$(this).data("sh.daterange")) {
				$(this).data("sh.daterange", new DateRangeControl($(this)));
			}

		});
	};

})(jQuery);

