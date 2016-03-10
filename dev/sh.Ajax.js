


(function ($) {
	if (!$.Sh) {
		$.Sh = {};
	}

	$.Sh.toJson = function (s) {
		if (s === "" || s == null) return {};
		var arr = s.split("&"),
			stack = {};

		for (var i = 0; i < arr.length; i++) {
			var a = arr[i].split("="),
				key = a[0], value = a[1];
			if (stack[key] != null) {
				// create an array
				if (!(stack[key] instanceof Array)) {
					var v = stack[key];
					stack[key] = [];
					stack[key].push(v);
				}
				stack[key].push(value);
			} else {
				stack[key] = value;
			}
		}
		return stack;
	};

	$.Sh.Ajax = function (options) {
		// a bridge, set up options from data-

		var src = this.data("src") || this.attr("href");
		var style = this.data("style") || (this.attr("data-params") ? "qs" : "o");
		var _options = {
			url: src,
			style: style,
			type: this.data("method"),
			data: this.data("params"),
			dataType: this.data("datatype"),
			contentType: this.data("contentype"),
			onload: $.getFunction(this, "onload"),
			onloading: $.getFunction(this,"onloading"),
			onprepost: $.getFunction(this, "onprepost"),
			onprogress: $.getFunction(this, "onprogress"),
			onfinish: $.getFunction(this, "onfinish"),
			onfinally: $.getFunction(this, "onfinally"),
			onpost: $.getFunction(this,"onpost"),
			loadingcss: this.data("loadingcss"),
			trigger: this.data("trigger"),
			silent: this.data("silent") // if true, do not fire on click of trigger
		};
		
		this.ShAjax($.extend(_options, options));
		
		return this.data("sh.ajax");
	};

	// expose default options
	$.Sh.Ajax.defaults = {
		style: "o",
		type: "POST",
		dataType: "json",
		data: {},
		//contentType: // default instead of application/x-www-form-urlencoded; charset=UTF-8, send "application/json; charset=utf-8",  otherwise (multipart/form-data)
		onload: null,
		onloading: function (bloading,srcelement) {
			bloading ? this.addClass($.Sh.Ajax.defaults.loadingcss) : this.removeClass($.Sh.Ajax.defaults.loadingcss);
		},
		onprepost: null,
		onprogress: null,
		onfinish: null,
		onfinally: null,
		onpost: function(xhr){
			_debug(xhr,"xhr");
		},
		loadingcss: "loadings",
		silent: false
	};

	// constructor, not exposed
	var Ajax = function (el, options) {

	
		this.options = $.extend({}, $.Sh.Ajax.defaults, options);	

		this.element = el;
		this._IsLoading = false;
		
		// initialize
		this.init();
	};

	Ajax.prototype = {
		
		init: function () {
					
			// TODOL internal object
			//this.options.dataobject = {};

			
			var base = this;
			// fire onload
			if (base.options.onload) base.options.onload.call(base.element);

			// turn data to json to make it easier to addparams
			// TODO: whatever jquery is doing to detect style, do it here, isArray, isPlainObject, else qs
			if (base.options.style == "qs") {
				base.options.data = $.Sh.toJson(base.options.data);
			} else if (base.options.style == "array") {
				base.options.data = $.Sh.toJson($.param(base.options.data));
			}
			//} else if ($.isEmptyObject(base.options.data)) {
			//	//base.options.data = {}; // this is to fix a stupid glitch, where another extend changes $.Sh.Ajax.defaults
			//}

			// ... TODO: delegate needs a selector, but what if I want to pass an object?
			if (!base.options.silent) {
			
				if (base.options.trigger) {
				
					// if not self, delegate within self, i have a problem, "this" doesnt belong to the trigger!
					base.element.on("click", base.options.trigger, function (e) {
						// what if base.options.trigger never exists? this should never happen right?
						//if (!$(e.target).is(base.options.trigger)) return false;
						
						return base._click(this, e);

					});
				} else {
					base.element.on("click", function (e) {
						return base._click(this, e);

					});
				}
				
			}
			// return instance
			return base;
		},
		_click: function (element, e) {
			var base = this;
			if (e.isDefaultPrevented() || base._IsLoading) {
				return false;
			}

			var $srcelement = $(element);
			e.preventDefault();

			return base.ajax($srcelement);
		},
		addparams: function (params, style) {
			switch (style) {
				case "qs":
					params = $.Sh.toJson(params);
					break;
				case "array":
					params = $.Sh.toJson($.param(params));
					break;
			}
			// changed
			this.options.data = $.extend({}, this.options.data, params); // extend. alla yostor
			
		},
		addtrigger: function (trigger) {
			var base = this;

			trigger.on("click", function (e) {
				return base._click(this, e);
			});
		},
		ajax: function(srcelement){
			// call ajax directly when this is called without trigger

			if (!srcelement) srcelement = this.element;
			var base = this;

			// call prepost, this is where data options can be extended
			if (base.options.onprepost) {
				if (!base.options.onprepost.call(base, srcelement)) return false;
			}

			// pass true for before loading
			base.options.onloading.call(base.element, true, srcelement);

			// TODO: if i am sending contenttype "application/json; charset=utf-8", then i need to stingify data
			//if (base.options.contentType.indexOf("json") > -1) base.options.data = JSON.stringify(d);

			// sheklo im turning qs params into json always 

			_debug(base.options.data, "data sent");
			_debug(base.options.url, "source");

			base._IsLoading = true;

			var ajaxops = {
				success: function (data, textStatus) {
					if (base.options.dataType != "html") _debug(data, "data received");
					else _debug({ content: data }, "content received");

					if (base.options.onfinish) base.options.onfinish.call(base.element, data, srcelement);

				},
				error: function (data, status) {
				
					if (!status){
						_debug(data.responseJSON || data.responseText, "error");
						if (base.options.onfinish) base.options.onfinish.call(base.element, base.options.dataType == "json" ? data.responseJSON : data.responseText, srcelement);
					}
					// let plugin handle different statuses
				},
				xhr: function () {
					myXhr = $.ajaxSettings.xhr();

					if (myXhr.upload) {
						myXhr.upload.addEventListener('progress', base.options.onprogress, false, srcelement);
					}
					return myXhr;
				},
				complete: function (xhr, status) {
					base.options.onloading.call(base.element, false, srcelement);
					base._IsLoading = false;

					if (base.options.onfinally) base.options.onfinally.call(base.element, base.options.dataType == "json" ? xhr.responseJSON : xhr.responseText, status,srcelement);
				}
			};	
			
			var xhr = $.ajax($.extend(ajaxops, base.options));
			
			base.options.onpost.call(base, xhr); // let developer call done, fail, and always

			return base; // instace of this object
		}
		
		
	};

	// plugin
	$.fn.ShAjax = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.ajax")) {
				$(this).data("sh.ajax", new Ajax($(this), options));
			}

		});
	};


})(jQuery);

