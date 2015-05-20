
/**
* formToArray() gathers form element data into an array of objects that can
* be passed to any of the following ajax functions: $.get, $.post, or load.
* Each object in the array has both a 'name' and 'value' property.  An example of
* an array for a simple login form might be:
*
* [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
*
* Methods copied from jquery form plugin
*/

(function ($) {

	$.fn.fieldValue = function (successful) {
		for (var val = [], i = 0, max = this.length; i < max; i++) {
			var el = this[i];
			var v = $.fieldValue(el, successful);
			if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
				continue;
			}
			if (v.constructor == Array)
				$.merge(val, v);
			else
				val.push(v);
		}
		return val;
	};
	/**
	 * Returns the value of the field element.
	 */
	$.fieldValue = function (el, successful) {
		var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
		if (successful === undefined) {
			successful = true;
		}

		if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
			(t == 'checkbox' || t == 'radio') && !el.checked ||
			(t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
			tag == 'select' && el.selectedIndex == -1)) {
			return null;
		}

		if (tag == 'select') {
			var index = el.selectedIndex;
			if (index < 0) {
				return null;
			}
			var a = [], ops = el.options;
			var one = (t == 'select-one');
			var max = (one ? index + 1 : ops.length);
			for (var i = (one ? index : 0) ; i < max; i++) {
				var op = ops[i];
				if (op.selected) {
					var v = op.value;
					if (!v) { // extra pain for IE...
						v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
					}
					if (one) {
						return v;
					}
					a.push(v);
				}
			}
			return a;
		}
		return $(el).val();
	};

	$.fn.formToArray = function (semantic, elements) {
		var a = [];
		if (this.length === 0) {
			return a;
		}

		var form = this[0];
		var els = semantic ? form.getElementsByTagName('*') : form.elements;
		if (!els) {
			return a;
		}

		var i, j, n, v, el, max, jmax;
		for (i = 0, max = els.length; i < max; i++) {
			el = els[i];
			n = el.name;
			if (!n) {
				continue;
			}


			v = $.fieldValue(el, true);

			if (v && v.constructor == Array) {
				if (elements)
					elements.push(el);
				for (j = 0, jmax = v.length; j < jmax; j++) {
					a.push({ name: n, value: v[j], type: el.type });
				}
			}
			else if (v !== null && typeof v != 'undefined') {
				if (elements)
					elements.push(el);
				a.push({ name: n, value: v, type: el.type }); //type: el.type, required: el.required
			}
		}

		return a;
	};

	$.fn.clearForm = function (includeHidden) {
		return this.each(function () {
			$('input,select,textarea', this).clearFields(includeHidden);
		});
	};
	$.fn.clearFields = $.fn.clearInputs = function (includeHidden) {
		var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
		return this.each(function () {
			var t = this.type, tag = this.tagName.toLowerCase();
			if (re.test(t) || tag == 'textarea') {
				this.value = '';
			}
			else if (t == 'checkbox' || t == 'radio') {
				this.checked = false;
			}
			else if (tag == 'select') {
				this.selectedIndex = null;
			}
			else if (t == "file") {
				if (/MSIE/.test(navigator.userAgent)) {
					$(this).replaceWith($(this).clone());
				} else {
					$(this).val('');
				}
			}
			else if (includeHidden) {
				// includeHidden can be the value true, or it can be a selector string
				// indicating a special test; for example:
				//  $('#myForm').clearForm('.special:hidden')
				// the above would clean hidden inputs that have the class of 'special'
				if ((includeHidden === true && /hidden/.test(t)) ||
					 (typeof includeHidden == 'string' && $(this).is(includeHidden)))
					this.value = '';
			}
		});
	};
	$.fn.resetForm = function () {
		return this.each(function () {
			$('input,select,textarea', this).resetFields();
		});
	};

	$.fn.resetFields = function () {
		var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week|hidden)$/i; // 'hidden' is not in this list
		return this.each(function () {
			var t = this.type, tag = this.tagName.toLowerCase();
			if (re.test(t) || tag == 'textarea') {
				this.value = this.defaultValue;
			}
			else if (t == 'checkbox' || t == 'radio') {
				this.checked = this.defaultChecked;
			}
			else if (tag == 'select') {
				for (var i = 0; i < this.options; i++) {
					this.options[i].selected = defaultSelected;
				}

			}
		});
	};

	$.fn.formToJson = function () {
		var arr = this.formToArray(true);
		_debug(arr, "input array");

		var values = {};
		$.each(arr, function () {
			// if name appears twice join in an array
			if (values[this.name] != null) {
				// create an array first
				if (!(values[this.name] instanceof Array)) {
					var v = values[this.name];
					values[this.name] = [];
					values[this.name].push(v);

				}
				values[this.name].push(this.value);
			} else {
				values[this.name] = this.value;
			}

		});

		return values;
	};

})(jQuery);