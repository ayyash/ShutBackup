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
			minDate: this.data("mindate")
		};


		this.ShDate($.extend(_options, options));
		return $(this).data("sh.date");
	};

	// expose default options
	$.Sh.Date.defaults = {
		dateFrmat: "mm/dd/yy",
		maxDaet: null,
		minDate: null
	};
	// constructor, not exposed
	var DateControl = function (el, options) {

		// extend options
		this.options = $.extend({}, $.Sh.Date.defaults, options);

		this.element = el;

		// initialize
		this.init(options);
	};

	DateControl.prototype = {

		init: function (options) {
			
			var base = this;

			this.element.datepicker({
				dateFormat: base.options.dateFormat,
				changeMonth: base.options.changeMonth,
				changeYear: base.options.changeYear,
				minDate: base.options.minDate,
				maxDate: base.options.maxDate
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
	};
	var DateRangeControl = function (el) {

		var dateFrom = el.find("[data-from]"),
			dateTo = el.find("[data-to]");

		var dateFromO = $.Sh.Date.call(dateFrom).setLimit(dateTo.val(), "max");
		var dateToO = $.Sh.Date.call(dateTo).setLimit(dateFrom.val(), "min");

		
		dateFrom.datepicker("option", "onSelect", function (date) { dateToO.setLimit(date, "min") });
		dateTo.datepicker("option", "onSelect", function (date) { dateFromO.setLimit(date, "max") });
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

