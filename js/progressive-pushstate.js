/*********************************************************
 * Progressive Pushstate v0.7.16 - a library to facilitate
 * progressively enhanced pushstate/popstate enabled applications
 * with a server-side fallback.
 * 
 * by Zoltan Hawryluk (zoltan.dulac@gmail.com)
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *	http://www.apache.org/licenses/LICENSE-2.0
 ********************************************************/

var pp = new function () {
	var me = this,
		orientation = screen.orientation || screen.mozOrientation || screen.msOrientation,
		spaceRe = /\s+/g,
		
		// Needed by entify()
		ampRe = /&/g,
		ltRe = /</g,
		gtRe = />/g,
		
		// Needed by unentify()
		ampEntRe = /&amp;/g,
		ltEntRe = /&lt;/g,
		gtEntRe = /&gt;/g,
		htmlEl = document.getElementsByTagName('html')[0];

	
	me.lastState = {};
	me.popstateEvent = function (e, state) {};
	me.options = {};
	
	/*
	 * init(): called to initialize this object
	 * 
	 * popstateEvent: a method to call when the query string changes
	 * options: options to configure this object.	Values can be:
	 * 
	 * - pushScrollState: enables the application to keep track of
	 *	 scrollbar position in the app. (default: false)
	 * 
	 * - debounceTime: sets the debounce time for resize/scroll events
	 *	 (default: 50)
	 * 
	 * - doPopstateOnload: fire the popstateEvent onload (default: false)
	 * 
	 * - defaultState: the initial default state of the application
	 *	 (default: {} or if a link with class "pp-default" exists, the
	 *	 URL of that link).
	 * 
	 * - keyDebounceTime: sets the debounce time for form key events events.
	 *   (default: 500)
	 */
	me.init = function (popstateEvent, options) {
		/*
		 * First .. check for support for this library.  If this browser doesn't 
		 * have support, set a class on the body tag to indicate so, and leave.
		 */
		if (history.pushState) {
			htmlEl.className += 'pp-support';
		} else {
			htmlEl.className += 'pp-no-support';
			return;
		}
		me.options = (options || {});
		
		var formEls = document.getElementsByClassName('pp-form'),
			formElsLen = formEls.length,
			params,
			j;
			
		me.options = (options || {}); 
		
		// there should only be one link with this class, which
		// will have the default state of the app in the query string. 
		me.defaultEl = document.getElementsByClassName('pp-default');
		
		me.popstateEvent = popstateEvent;
		
		
		document.addEventListener('click', linkClickEvent);
		
		me.formChangeEventDebounced = debounce(formChangeEvent, me.options.keyDebounceTime || 500);
		
		/*
		 * We allow *all* forms of class `pp-form` to affect the pushState 
		 * (previously it was only the first form of this class that could do
		 * so).
		 */
		for (j=0; j<formElsLen; j++) {
			var formEl = formEls[j];
			me.initForm(formEl);
		}
		
		if (me.defaultEl.length > 0) {
			me.options.defaultState = queryStringToObject(me.defaultEl[0].href.split('?')[1]);
		}
		
		window.addEventListener('popstate', internalPopstateEvent);
		
		/*
		 * allow developers to maintain scrollbar state onScroll
		 * onResize and onorientationchange
		 */
		if (me.options.pushScrollState) {
			// We make sure we throttle scroll and resize because
			// browsers fire these events like mad and slow the browser
			// down.
			me.scrollEventDebounced = debounce(scrollEvent, me.options.debounceTime || 50);
			window.addEventListener('scroll', me.scrollEventDebounced);
			window.addEventListener('resize', me.scrollEventDebounced);
			
			// Doing screen orientation change event handling by first
			// checking for official W3C event handler, with an deprecated
			// browser fallback.	More info:
			// - https://w3c.github.io/screen-orientation/
			// - https://developer.mozilla.org/en-US/docs/Web/Events/orientationchange
			if (orientation) {
				orientation.addEventListener('change', me.scrollEvent);
			} else {
				window.addEventListener('orientationchange', me.scrollEvent);
			}
		}
		
		/*
		 * If options.doPopstateOnload exists, run the popstateEvent.
		 */
		if (me.options.doPopstateOnload && window.history.replaceState) {
			var splitLocation = location.href.split('?');
			
			if (splitLocation.length === 2) {
				params = queryStringToObject(splitLocation[1]);
			} else {
				params = {};
			}	
			window.history.replaceState(params, '', window.location.href);
			
			// if there is a form and this is not
			// a form event, let's populate the form.
			if (formEls.length !== 0) {
				updateForms(params);
			}
			
			me.popstateEvent({
				type: 'init',
				target: document,
				currentTarget: document,
				state: params
			});
			me.lastState = params;
		}
	};
	
	me.initForm = function(formEl) {
		var events = formEl.getAttribute('data-pp-events') || 'change',
			formFields = formEl.elements;
				
		if (events) {
			events = events.split(spaceRe);
			
			var eventsLen = events.length;
			
			for (i=0; i<eventsLen; i++) {
				var event = events[i];
				
				if (event.indexOf('key') === 0 || event === 'input') {
					document.addEventListener(events[i], me.formChangeEventDebounced);
				} else {
					document.addEventListener(events[i], formChangeEvent);
				}
				
			}
		} else {
			formEl.addEventListener('submit', formChangeEvent);
		}
	};
	
	/* Stolen from https://github.com/rodneyrehm/viewport-units-buggyfill/blob/master/viewport-units-buggyfill.js */
	function debounce(func, wait) {
		var timeout;
		return function() {
			var context = this;
			var args = arguments;
			var callback = function() {
				func.apply(context, args);
			};
	
			clearTimeout(timeout);
			timeout = setTimeout(callback, wait);
		};
	}
	
	
	/*
	 * getScrollLeft/Top() from http://stackoverflow.com/questions/11193453/find-the-vertical-position-of-scrollbar-without-jquery
	 * This will be used in the future to ensure when traversing
	 * the browser history, that the scroll position is 
	 * maintained this library is configured to do so.
	 */
	function getScrollLeft() {
		return (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
	}
	
	function getScrollTop() {
		return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	}
	
	function scrollEvent(e) {
		if (window.history.replaceState) {
			var url = window.history.href,
				scrollLeft = getScrollLeft(),
				scrollTop = getScrollTop(),
				state = me.lastState;
				
				state._scrollLeft = scrollLeft;
				state._scrollTop = scrollTop;
				
				window.history.replaceState(state, '', url);
		}
	}
	
	/*
	 * The onPopstate method handler. It runs the popstateEvent
	 * given by the application to this library after setting
	 * the event's state property.
	 */
	function internalPopstateEvent(e) {
		var state,
			formEls = document.getElementsByClassName('pp-form');
		;
		
		// if the state is null and we have a default state, use that instead.
		if (me.options.defaultState !== null && e.state === null) {
			state = me.options.defaultState;
		} else {
			state = e.state;
		}
		
		// if there is a form here, let's change the form values
		// to match the query string
		if (formEls.length !== 0) {
			updateForms(state);
		}
		
		me.popstateEvent(e, state);
		me.lastState = state;
	}
	
	/*
	 * This will take `el` that has set values (like a checkbox or a seclect box)
	 * and (un)check/(un)select it if the state says it is supposed to be.
	 */
	function updateSetValueInput (el, stateValues, isCheckbox) {
		var i, stateValue, checked = false;
		
		for (i=0; i<stateValues.length; i++) {
			stateValue = stateValues[i];
			
			// if the value is in the stateVal array, check the box
			if (stateValue === el.value) {
				checked = true;
			} 
		}
		
		if (isCheckbox) {
			el.checked = checked;
		} else {
			el.selected = checked;
		}
	}
	
	function updateForms(state) {
		var formEls = document.getElementsByClassName('pp-form'),
			h, i, j;
		
		/* 
		 * if state is undefined, we need to make it {} so this method knows it's
		 * the empty state.
		 */
		state = state || {};
		
		for (h=0; h < formEls.length; h++) {
			var formEl = formEls[h],
				fields = formEl.elements,
				numEl = fields.length,
				updatedNames = {};
				
			for (i=0; i<numEl; i++) {
				var field = fields[i],
					name = field.name,
					stateVal = state[name] || '';
				
				// if we dealt with this name already, then go to the next item in for
				// loop.	
				if (!updatedNames[name]) {
				
					
					switch (field.type) {
						case "submit":
							// we don't want to change the value of submit buttons, since
							// that is the visible label of the button, so we break here.
							break;
						case "radio":
						case "select-multiple":
						case "select-one":
						case "checkbox":
							var isCheckbox = (field.type === 'checkbox' || field.type === 'radio'),
								allElementsWithName = isCheckbox ? formEl.elements[name] : field.options,
								elsLen = allElementsWithName.length;
							
							// if stateVal isn't an array, make it one.
							if (typeof stateVal !== 'object') {
								stateVal = [stateVal];
							}
							
							/*
							 * allElementsWithName can be an array or a single element, so
							 * we need to check for that and apply the appropriate value.
							 */
							if (allElementsWithName.length) {
								for (j=0; j<elsLen; j++) {
									var el = allElementsWithName[j];
									updateSetValueInput(el, stateVal, isCheckbox);
								}
							} else {
								updateSetValueInput(allElementsWithName, stateVal, isCheckbox);
							}
							break;
							
						default:
							field.value = stateVal;
					}
						
					
					updatedNames[name] = true;
				}
				
			}
		}
	}
	/*
	 * click event that is fired on <a href="" class="pp-link">
	 * nodes.	It takes the link's URL and puts the data inside
	 * the query string into the document's popstate for the URL.
	 */
	function linkClickEvent(e) {
		var target = e.target,
			updateOptions = {
				isMerge: hasClass(target, 'pp-merge')
			};
		
		if (target.nodeName !== 'A' || ! target.classList.contains('pp-link')) {
			return;
		}
		
		var URL = target.href,
			splitURL = URL.split('?');
			
		if (splitURL.length === 2) {
			var qs = splitURL[1];
				
			e.preventDefault();
			me.updatePushState(e, qs, updateOptions);
			
		}
	}

	function hasClass( target, className ) {
			return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
	}
	
	function formChangeEvent(e) {
		/*
		 * Target is the event's current target, or the target's form element
		 * since Firefox (and possibly others) have an issue with keypress on 
		 * form setting the currentTarget correctly.
		 */
		var target, targetForm, qs,
			formEls = document.getElementsByClassName('pp-form'),
			updateOptions;
		
		if (e.type.indexOf('key') === 0) {
			target = e.currentTarget || getFormElementOfField(e.target);
		} else {
			target = e.target;
		}
		
		targetForm = (target.nodeName === 'FORM') ? target : getFormElementOfField(target);
		
		updateOptions = {
			isMerge: hasClass(targetForm, 'pp-merge')
		}
		
		if (target) {
			target = targetForm;
			
			if(!hasClass(target, 'pp-form')) {
				return;
			}
		}
		
		qs = me.formData2QueryString(target, {
			collapseMulti: me.options.collapseMulti
		});
			
		me.updatePushState(e, qs, updateOptions);
		
		if (e.type === 'submit') {
			for (var i=0; i<formEls.length; i++) {
				var autoFocusEl = formEls[i].querySelector('input[autofocus], textarea[autofocus], select[autofocus]');
				
				if (autoFocusEl) {
					autoFocusEl.focus();
					break;
				}
			}
			e.preventDefault();
		}
	}
	
	/*
	 * grabs the URL without the query string from the browser.
	 */
	function getBaseUrl() {
		var loc = window.location;
		return loc.protocol + "//" + loc.host + loc.pathname;
	};
	
	/*
	 * Takes a query string and returns the string converted
	 * into a JavaScript object.	If the query string has a 
	 * hash anchor in it, it is put in the object's _ppHash
	 * parameter.
	 */
	function queryStringToObject(qs) {
		var hashSplit = qs.split('#'),
			qsFrags = hashSplit[0].split('&'),
			qsFragsLen = qsFrags.length,
			i, j, r = {};
		
		for (i=0; i<qsFragsLen; i++) {
			var qsFrag = qsFrags[i],
				splitFrag = qsFrag.split('='),
				name = decodeURIComponent(splitFrag[0]),
				rawValue = splitFrag[1],
				oldValue = r[name];
			

			/*
			 * If the `collapseMulti` option is not used, checkboxes and select-multi's
			 * can be put into the query string as so:
			 * 
			 * checkboxProp=value1&checkboxProp=value2.
			 * 
			 * In order to accomodate for this, we should check if the object property
			 * corresponding to the checkbox name (in the above example 
			 * `checkboxProp`) is already set.	If so, we make that property into 
			 * an array with the old and new values in it. If not, then just add the
			 * property to the object. 
			 */
			if (me.options.collapseMulti) {
				var splitValue = rawValue.split(',');
				
				if (splitValue.length > 1) {
					for (j=0; j<splitValue.length; j++) {
						splitValue[j] = decodeURIComponent(splitValue[j]);
					}
					r[name] = splitValue;
				} else {
					r[name] = decodeURIComponent(rawValue);
				}
				
			} else {
				var decodedValue = decodeURIComponent(rawValue);
				
				if (oldValue) {
					switch (typeof oldValue) {
						case 'string':
							r[name] = [oldValue, decodedValue];
							break;
						case 'object':
							r[name].push(decodedValue);
							break;
						default:
							r[name] = decodedValue;
					}
				} else {
					r[name] = decodedValue;
				}
				
			}
		}
		
		if (hashSplit.length > 1) {
			r._ppHash = hashSplit[1];
		}
		
		return r;
	};
	
	/**
	 * Given an tag, find the first ancestor tag of a given tag name.
	 */ 
	function getAncestorByTagName (obj, tagName) {
		
		for (var node = obj.parentNode; 
			  node.nodeName !== 'BODY';
			  node = node.parentNode) {
		
			if (tagName === node.nodeName) {
				return node;
			}
			  
		}
		return null;
	}
	
	function getFormElementOfField(formField) {
		return formField.form || getAncestorByTagName(formField, 'FORM');
	}
	
	
	me.unentify = function (s) {
		return s.replace(ampEntRe, '&').
			replace(ltEntRe, '<').
			replace(gtEntRe, '>');
	};
	
	me.entify = function (s, options) {
		return s.replace(ampRe, "&amp;")
			.replace(ltRe,"&lt;")
			.replace(gtRe,"&gt;");
	};
	/*
	 * Takes a JavaScript object and converts it into a query string.
	 */
	function objectToQueryString(obj) {
		var i, j, sb = [],
			name = encodeURIComponent(i),
			value = obj[i];
		
		
		for (i in obj) {
			/*
			 * If the value is an array, then this is a multi-value form element 
			 * (i.e. multi-select or checkboxes).	
			 */
			if (typeof value === 'object') {
				
				/*
				 * If this is a collapseMulti form, then we should join all the values
				 * with a ',' in the URL.
				 */
				if (me.options.collapseMulti) {
					for (j=0; j<value.length; j++) {
						value[j] = encodeURIComponent(value[j]);
					}
					
					value = value.join(',');
					sb.push(name + '=' + value);
				
				/*
				 * Otherwise, we just add each of the values one at a time in the 
				 * query string.
				 */
				} else {
					for (j=0; j<value.length; j++) {
						sb.push(name + '=' + encodeURIComponent(obj[j]));
					}
				}
			
			/*
			 * If we get here, the value is assumed to be a string, so we just add
			 * it to the query string.
			 */
			} else {
				sb.push(name + '=' + encodeURIComponent(obj[i]));
			}
		}
		
		return sb.join('&');
	}
	
	/*
	 * Takes a query string and hash value and puts 
	 * it into the history's pushstate.	For example:
	 * 
	 * qs -> "this=1&that=2&other=3"
	 * hash -> myLinkName
	 * 
	 * will put this into the pushstate:
	 * 
	 * {
	 *	 this: '1',
	 *	 that: '2',
	 *	 other: '3',
	 *	 _ppHash: 'myLinkName'
	 * } 
	 */
	me.updatePushState = function (e, qs, options) {
		var target = e.currentTarget || e.target,
			formEls = document.getElementsByClassName('pp-form');
		
		options = options || {};
		
		switch (e.type) {
			case 'submit':
			case 'click':
				e.preventDefault();
				break;
		}
		
		var params = queryStringToObject(qs);
		
		/* Insert the how many pages in history this page is */
		if (me.lastState._ppPageNum === undefined && e.state === undefined) {
			params._ppPageNum = 0;
		} else if (e.type !== 'popstate') {
			params._ppPageNum = me.lastState._ppPageNum + 1;
		}
		
		if (window.history.pushState) {
			var newUrl = getBaseUrl() + '?' + qs;
			
			if (options.isMerge) {
				params = Object.assign(getNormalizedObject(window.history.state), params);
			}
		
			window.history.pushState(params, '', newUrl);
			
			e.state = params;
			
			/* 
			 * If there is a form and this is not
			 * a form event, let's populate the form.
			 */
			if (formEls.length !== 0 && target.nodeName !== 'FORM') {
				updateForms(params);
			}
			
			me.popstateEvent(e, params);
			me.lastState = params;
			
		}
	};
	
	function getNormalizedObject(obj) {
		var r = {}, i;
		
		for (i in obj) {
			if (obj[i]) {
				r[i] = obj[i];
			}
		}
		
		return r;
	}
	
	/*
	 * This will be used in the future to compare two states to see if 
	 * they are equal.
	 */
	me.sortObject = function(obj) {
		return Object.keys(obj).sort().reduce(function (result, key) {
			result[key] = obj[key];
			return result;
		}, {});
	};
	
	/*
	 * Serializes the data from all the inputs in a Web form
	 * into a query-string style string.
	 * @param docForm -- Reference to a DOM node of the form element
	 * @param formatOpts -- JS object of options for how to format
	 * the return string. Supported options:
	 * collapseMulti: (Boolean) take values from elements that
	 * can return multiple values (multi-select, checkbox groups)
	 * and collapse into a single, comman-delimited value
	 * (e.g., thisVar=asdf,qwer,zxcv)
	 * @returns query-string style String of variable-value pairs
	 * 
	 * Original code by Matthew Eernisse (mde@fleegix.org), March 2005
	 * Additional bugfixes by Mark Pruett (mark.pruett@comcast.net), 12th July 2005
	 * Multi-select added by Craig Anderson (craig@sitepoint.com), 24th August 2006
	 * HTML5 Form Element Support added by Zoltan Hawryluk (zoltan.dulac@gmail.com)
	 *
	*/

	me.formData2QueryString = function (docForm, formatOpts) {	
		var opts = formatOpts || {},
			str = '',
			formElem,
			lastElemName = '';
		
		for (i = 0; i < docForm.elements.length; i++) {
			formElem = docForm.elements[i];
	
			if (formElem.name) {
				switch (formElem.type) {
				
					// Multi-option select
					case 'select-multiple':
						var isSet = false;
						for(var j = 0; j < formElem.options.length; j++) {
							var currOpt = formElem.options[j];
							if(currOpt.selected) {
								if (opts.collapseMulti) {
									if (isSet) {
										str += ',' + encodeURIComponent(currOpt.value);
									}
									else {
										str += formElem.name + '=' + encodeURIComponent(currOpt.value);
										isSet = true;
									}
								}
								else {
									str += formElem.name + '=' + encodeURIComponent(currOpt.value) + '&';
								}
							}
						}
						if (opts.collapseMulti) {
							str += '&';
						}
						break;
					
					// Radio buttons
					case 'radio':
						if (formElem.checked) {
							str += formElem.name + '=' + encodeURIComponent(formElem.value) + '&';
						}
						break;
						
					// Checkboxes
					case 'checkbox':
						if (formElem.checked) {
							// Collapse multi-select into comma-separated list
							if (opts.collapseMulti && (formElem.name == lastElemName)) {
								// Strip of end ampersand if there is one
								if (str.lastIndexOf('&') == str.length-1) {
									str = str.substr(0, str.length - 1);
								}
								// Append value as comma-delimited string
								str += ',' + encodeURIComponent(formElem.value);
							}
							else {
								str += formElem.name + '=' + encodeURIComponent(formElem.value);
							}
							str += '&';
							lastElemName = formElem.name;
						}
						break;
					/*
					 * Text fields, hidden form elements, passwords, textareas, single
					 * select elements, range, date and color.	Note that we use 
					 * default here in order to catch others that may not be defined yet.
					 */
					default:
						str += formElem.name + '=' + encodeURIComponent(formElem.value) + '&';
						break;
				}
			}
		}
		// Remove trailing separator
		str = str.substr(0, str.length - 1);
		return str;
	};
	
	me.isInStateProperty = function (property, value) {
		if (property === undefined) {
			return false;
		}
		
		var propType = typeof(property),
			i;
		
		if (propType === 'string' && property === value) {
			return true;
		} else if (propType === 'object') {
			for (i=0; i<property.length; i++) {
				if (property[i] === value) {
					return true;
				}
			}
		}
		
		return false;
	};

};

// element-closest | CC0-1.0 | http://github.com/jonathantneal/closest

if (typeof Element.prototype.matches !== 'function') {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || function matches(selector) {
		var element = this;
		var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
		var index = 0;

		while (elements[index] && elements[index] !== element) {
			++index;
		}

		return Boolean(elements[index]);
	};
}

if (typeof Element.prototype.closest !== 'function') {
	Element.prototype.closest = function closest(selector) {
		var element = this;

		while (element && element.nodeType === 1) {
			if (element.matches(selector)) {
				return element;
			}

			element = element.parentNode;
		}

		return null;
	};
}

// Object.assign polyfill from 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
if (typeof Object.assign != 'function') {
	Object.assign = function (target, varArgs) { // .length of function is 2
		'use strict';
		if (target == null) { // TypeError if undefined or null
			throw new TypeError('Cannot convert undefined or null to object');
		}

		var to = Object(target);

		for (var index = 1; index < arguments.length; index++) {
			var nextSource = arguments[index];

			if (nextSource != null) { // Skip over if undefined or null
				for (var nextKey in nextSource) {
					// Avoid bugs when hasOwnProperty is shadowed
					if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
		}
		return to;
	};
}