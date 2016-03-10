
// mirror 

var compactStyle = ["padding", "margin", "border-width", "border-style", "border-color","border-radius"];
function mirror() {

	// last stylesheet?
	var stylesheet = document.styleSheets[0];
	//var rtlcsstext = rtlMirror(stylesheet);
	// disable original
	//stylesheet.ownerNode.textContent = rtlcsstext;

	var testRtl = MirrorText(stylesheet.ownerNode.innerText);
	stylesheet.ownerNode.textContent = testRtl;
	
}

function MirrorText(txt) {
	// this function is still under testing

	// find /* RTL BEGIN */ and /* RTL END */ and save their index location

	var re = /\/\* RTL BEGIN \*\/[\s\S]*?\/\* RTL END \*\//gim;
	var s;
	var matches = [];
	while ( s = re.exec(txt) ) {
		var rtl = s[0];
		matches.push(rtl);
		
	}
	var c = 0;
	txt = txt.replace(re, function () {
		return "#RTL#"+ c++;
	});

	// mirror txt, 
	txt = BasicMirror(txt);

	// then plug matches back in place
	for (var i = 0; i < matches.length; i++) {
		txt = txt.replace("#RTL#" + i, matches[i]);
	}
	
	return txt;
}

function BasicMirror(txt) {
	// simply switch left to right
	// right(?!.+{) and left(?!.+{) to replace properties only

	var regright = /right(?=(.*:\s|.*;)+)/ig;
	var regleft = /left(?=(.*:\s|.*;)+)/ig;

	var newStr = txt.replace(regright, "shuttemp").replace(regleft,"right").replace(/shuttemp/gi,"left");


	// find padding, margin, border, and switch b with d (a b c d)
	var repPad = function (match, p1, p2, p3, p4, offset, string) {
		return "padding: " + [p1, p4, p3, p2].join(" ") + ";";
	};
	var repMargin = function (match, p1, p2, p3, p4, offset, string) {
		return "margin: " + [p1, p4, p3, p2].join(" ") + ";";
	};
	var repBorderWidth = function (match, p1, p2, p3, p4, offset, string) {
		return "border-width: " + [p1, p4, p3, p2].join(" ") + ";";
	};
	var repBorderStyle = function (match, p1, p2, p3, p4, offset, string) {
		return "border-style: " + [p1, p4, p3, p2].join(" ") + ";";
	};
	var repBorderColor = function (match, p1, p2, p3, p4, offset, string) {
		return "border-color: " + [p1, p4, p3, p2].join(" ") + ";";
	};
	//TODO border-radius
	
	var padre = /padding: (-?\w+)\s{1}(-?\w+)\s{1}(-?\w+)\s{1}(-?\w+)?;/g;
	var marginre = /margin: (-?\w+)\s{1}(-?\w+)\s{1}(-?\w+)\s{1}(-?\w+)?;/g;
	var borstylere = /border-style: (\w+)\s{1}(\w+)\s{1}(\w+)\s{1}(\w+)?;/g;
	var borwidthre = /border-width: (\w+)\s{1}(\w+)\s{1}(\w+)\s{1}(\w+)?;/g;
	var borcolorre = /border-color: (\w+)\s{1}(\w+)\s{1}(\w+)\s{1}(\w+)?;/g;
	var borcolorre = /border-color: (\w+)\s{1}(\w+)\s{1}(\w+)\s{1}(\w+)?;/g;

	
	newStr = newStr.replace(padre, repPad);
	newStr = newStr.replace(marginre, repMargin);
	newStr = newStr.replace(borstylere, repBorderStyle);
	newStr = newStr.replace(borwidthre, repBorderWidth);
	newStr = newStr.replace(borcolorre, repBorderColor);
	
	return newStr;
}

// DEPRECATED
function rtlMirror(sheet) {
	// put text in a stylesheet inside an iframe of its own to process
	//var $sheet = $("<style rel='stylesheet' type='text/css' />").text(text).appendTo("body").attr("disabled", "true");
	//var sheet = $sheet.get(0).sheet;

	var str = "";

	for (var i = 0; i < sheet.cssRules.length; i++) {

		var rule = sheet.cssRules[i];
		
		switch (rule.type) {
			case 1:
			
				str += rtlMirrorRule(rule) + "\n";
				break;
			case 4: // media
				var mediastr = "";
				// if rtl just add to str
				
				if (rule.media.mediaText == "rtl" || rule.media.mediaText == "unknown") {

					for (var j = 0; j < rule.cssRules.length; j++) {
						var r = rule.cssRules[j].cssText;

						str += r + "\n";
					}

				} else {

					for (var j = 0; j < rule.cssRules.length; j++) {
						mediastr += "\n" + rtlMirrorRule(rule.cssRules[j]) + "\n";
					}
				}
				if (mediastr != "") {
					str += "\n@media " + rule.media.mediaText + " { ";
					str += mediastr;
					str += "\n}";
				}

				break;
			case 5: // fontface
				
				str += "\n" + rule.cssText.replace(/format\(([\w\-]*)\)/gi, "format('$1')") + "\n";
				break;
			default:
				continue;
		}



	}
	return str;

}

// DEPRECATED
function rtlMirrorRule(rule) {
	// if font face dont mirror
	if (rule.type == 5) {
		return rule.cssText;
	}

	// TODO: check 1:
	// 1. right and left in cssText
	// 2. compact forms (or simply always use exact forms, though that would make the css file bigger) [padding margin border]
	// 3. content should be encapsulated with quotes

	// check the existence of right or left in css text
	var cssText = rule.cssText;

	// if "content" is part of definition, encapsulate
	if (cssText.indexOf("content") > -1) {
		cssText = cssText.replace(/\\\\/gi, "\\");
	}

	//if (cssText.indexOf("left") < 0 && cssText.indexOf("right") < 0) return cssText.replace(/(::)/gi, ":");

	// reconstruct cssText, start from selectorText
	var str = cssText.substring(rule.selectorText.length)
					.replace(/left/gi, "tempr").replace(/right/gi, "left").replace(/tempr/gi, "right")
					.replace(/( 0px)/gi, " 0");
	str = "\n" + rule.selectorText + str + " \n";

	// TODO: generate other browser formats
	
	//if (str.indexOf("::") > -1 && rule.selectorText.indexOf("-webkit") < 0) {
	//	console.log(rule.selectorText);
	//	str = str.replace(/(::)/gi, ":");
	//}
	
	
	var rtl = "";

	for (var i = 0; i < compactStyle.length; i++) {
		if (cssText.indexOf(compactStyle[i] + ":") > -1) {
			// overwriters
			rtl += rtlCompact(rule, compactStyle[i]);
		}
	}

	// remove :: from selector text, this is rtl compact overwrites
	//if (rtl != "") rtl = "\n" + rule.selectorText.replace(/(::)/gi, ":") + "{" + rtl + " } \n";
	if (rtl != "") rtl = "\n" + rule.selectorText + "{" + rtl + " } \n";

	//if (rtl != "" && rtl.indexOf("::") > -1 && rule.selectorText.indexOf("-webkit") < 0) {
	//	rtl = rtl.replace(/(::)/gi, ":");
	//}
	
	return str + rtl;
}

// DEPRECATED
function rtlCompact(rule, ow) {

	var str = "";
	// just overright left and right, this is to take care of compact forms which have right and left always

	// get all padding-left, margin-left, border-left-width, border-left-style, border-left-color
	// if border, insert left in the middle
	var propName = ow + "-{0}", propNameB;
	if (ow == "border-style") propName = "border-{0}-style";
	if (ow == "border-width") propName = "border-{0}-width";
	if (ow == "border-color") propName = "border-{0}-color";
	if (ow == "border-radius") {
		propName = "border-top-{0}-radius";
		propNameB = "border-bottom-{0}-radius";
	}
	var leftPropName = propName.replace("{0}", "left"),
			rightPropName = propName.replace("{0}", "right"),
			propPro = (rule.style.getPropertyPriority(leftPropName) != "" ? "!important" : ""), // i think if one is important both are
			leftValue = rule.style.getPropertyValue(leftPropName),
			rightValue = rule.style.getPropertyValue(rightPropName);

	if (propNameB) {
		var leftPropNameB = propNameB.replace("{0}", "left"),
			rightPropNameB = propNameB.replace("{0}", "right"),
			propProB = (rule.style.getPropertyPriority(leftPropNameB) != "" ? "!important" : ""), // i think if one is important both are
			leftValueB = rule.style.getPropertyValue(leftPropNameB),
			rightValueB = rule.style.getPropertyValue(rightPropNameB);
		if (leftValueB != rightValueB) {
			str += rightPropNameB + ":" + leftValueB + propProB + ";\n";


			// left: right value and right priority if it exists
			str += leftPropNameB + ":" + rightValueB + propProB + ";\n";
		}
	}

	if (leftValue == rightValue) return "";

	//right: left value and left priority
	str += rightPropName + ":" + leftValue + propPro + ";\n";


	// left: right value and right priority if it exists
	str += leftPropName + ":" + rightValue + propPro + ";\n";


	// remove :: from selector text

	return str;

}