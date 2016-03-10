/// <reference path="jquery-1.5.1-vsdoc.js" />


(function ($) {
	if (!$.Sh) {
		$.Sh = {};
	};

	$.Sh.Fieldset = function (options) {
		// a bridge, set up options from data-
		
		var _options = {
			trigger: this.data("trigger"),
			remove: this.data("remove"),
			template: this.data("template"),
			collectionId: this.data("collection"),
			identifier: this.data("identifier"),
			isGreedy: this.data("greedy"),
			hookSelector: this.data("hook-selector"),
			addOnLoad: this.data("addonload"),
			altText: this.data("alt-text"), // this does not matter
			target: this.data("target"),
			onLoad: $.getFunction(this, "onload"),
			onAdd: $.getFunction(this, "onadd"),
			onRemove: $.getFunction(this, "onremove"),
			onBeforeAdd: $.getFunction(this, "onbeforeadd")
		};


		this.ShFieldset($.extend(_options, options));
		return $(this).data("sh.fieldset");
	};

	// expose default options
	$.Sh.Fieldset.defaults = {
		trigger: ".addfs",
		remove: ".remfs",
		template: ".tmplfs",
		collectionId: ".itemfs",
		isGreedy: false,
		addOnLoad: false,
		altText: $.Res.AddAnother,
		onBeforeAdd: function (e) {
			return true;
		}
	};
	// constructor, not exposed
	var Fieldset = function (el, options) {

		// extend options
		this.options = $.extend({}, $.Sh.Fieldset.defaults, options);

		
		this.element = el;

		// define template, allow template change on runtime
		this.template = $(this.options.template);
		
		// find trigger, remove trigger and target
		this.trigger = (this.options.trigger instanceof jQuery) ? this.options.trigger : this.element.find(this.options.trigger);

		// find alttext again
		if (!options.altText && this.trigger.data("alt-text")) this.options.altText = this.trigger.data("alt-text");
		
		this.target =  this.element.find(this.options.target);

		this.options.originalText = this.trigger.text();
		
		

		// initialize
		this.init();
	};

	Fieldset.prototype = {

		init: function () {
			var base = this;


			// save template
			base.template.mustacheparse();

			// delegate on remove, if want to take over do not define removeTrigger

			base.element.on("click", base.options.remove, function (e) {
				// remove this collection identifier
				
				if (!$(this).is(base.options.remove)) return false;

				e.preventDefault();
				
				base.remove($(this).closest(base.options.collectionId));
				return false;
			});

			// attach add to click of trigger
			base.trigger.click(function (e) {
				// if onbeforeadd is defined take over
				if (base.options.onBeforeAdd && base.options.onBeforeAdd.call(base)) {

					e.preventDefault();
					// create another row and insert before
					base.addNew(true);

				}
					
				
			});


			base._updateCollection();

			base.options.UniqueRowIndex = base.collection.length;
		
			base._updateAltText();
			

			if (base.options.addOnLoad && !base.collection.length) {
				
				base.addNew(false);
			}

			(base.options.onLoad) ? base.options.onLoad.call(this) : null;



		},
		addNew: function (bDoFocus) {

			var base = this;
			// add new field, pass rowIndex and identifier back


			var fs = $(base.template.mustache({ RowIndex: base.collection.length, Identifier: base.options.identifier, UniqueRowIndex: base.options.UniqueRowIndex })).insertBefore(base.target).ShApplyHiLight();
			

			// add row
			var rowvalue = base.getElementValue(fs);
			var row = { index: base.collection.length, item: fs, value: rowvalue, UniqueRowIndex: base.options.UniqueRowIndex };

			fs.data("row", row);
			base.collection.push(row);

			base._updateAltText(this);

			// find first input and try to focus
			if (bDoFocus) fs.find(":text,textarea,select").first().focus();

			// on add, if list is not greedy it should hide add button, hookSelector means new row is always empty, else it does not matter
			// but im going to use isGreedy instead
			
			if (!base.options.isGreedy) {
				
				if (row.value == 0) {
					base.showTrigger(false);
				}
			}

			$.ShRewire(fs);
			// 9/8 added unique row index
			base.options.UniqueRowIndex++;
			_debug(base.collection, "collection");

			(base.options.onAdd) ? base.options.onAdd.call(this, fs) : null;
			return this;
		},
		remove: function (src) {

			var base = this;


			// remove row
			var row = src.data("row");

			base.collection.remove(base.indexOf(row));
			src.remove();
			base._updateAltText();

			// on remove, check value again for non greedy lists and update add button

			if (!base.options.isGreedy) {
				base.showTrigger(!base.isOneEmpty());
			}

			(base.options.onRemove) ? base.options.onRemove.call(this, src) : null;

			return row;
		},
		indexOf: function (row) {
			var base = this;

			var index = -1;
			for (var i = 0; i < base.collection.length; i++) {
				if (base.collection[i].UniqueRowIndex == row.UniqueRowIndex) {
					index = i;
					break;
				}
			}
			return index;
		},
		_updateCollection: function () {

			// calculate row value and return in collection
			// empty strings and -1 values are empty
			var collection = [],
				uniqueRowIndex = 0,
				base = this;

			$.each(base.element.find(base.options.collectionId), function (i, n) {
				// for every one, create a row
				var $item = $(this);
				var value = 0;
				
				$.each($item.find(base.options.hookSelector), function () {
					// read hook fields
					var val = $.trim($(this).val());
					if (val != "" && val != "-1") value++;


				});

				var row = { index: i, item: $item, value: value, UniqueRowIndex: uniqueRowIndex++ };

				$item.data("row", row); // save row object in field
				collection.push(row);

			});

			//onkeyup, note to self, if nongreedy, autokeyup must be set to true otherwise how will i show trigger?
			
			if (!base.options.isGreedy) {
				
				base.element.on("keyup", base.options.hookSelector, function (e) {
					base._AutoUpdateTrigger($(this).closest(base.options.collectionId));
				});
			}

			base.collection = collection;

			
		},
		setValue: function (rowitem, value) {
			
			var row = rowitem.data("row");
			row.value = value;

		},
		getValue: function (rowitem) {

			return rowitem.data("row").value;
		},
		getElementValue: function (rowitem) {
			var base = this;
			// get values of all hook selectors
			var value = 0;
			$.each(rowitem.find(base.options.hookSelector), function () {
				// read hook fields
				var val = $.trim($(this).val());
				if (val != "" && val != "-1") value++;
			});

			return value;
		},
		isOneEmpty: function () {
			var base = this;
			// empty means one value is zero
			for (var i = 0; i < base.collection.length; i++) {
				if (base.collection[i].value == 0) return true;
			}

			return false;
		},
		showTrigger: function (bShow) {
			var base = this;
			
			bShow ? base.trigger.show() : base.trigger.hide();
		},
		_updateAltText: function () {
			// get the collection again using collection identifier, 
			var base = this;

			(base.collection.length) ? base.trigger.text(base.options.altText) : base.trigger.text(base.options.originalText);
			return base.collection.length;
		},
		_AutoUpdateTrigger: function (rowItem) {
			// get element value, and show hide trigger accordingly
			var base = this;

			var value = base.getElementValue(rowItem);
			// set value
			base.setValue(rowItem, value);
			base.showTrigger(!base.isOneEmpty());
		}


	};

	// plugin
	$.fn.ShFieldset = function (options) {
		return this.each(function () {
			if (!$(this).data("sh.fieldset")) {
				$(this).data("sh.fieldset", new Fieldset($(this), options));
			}

		});
	};


})(jQuery);

