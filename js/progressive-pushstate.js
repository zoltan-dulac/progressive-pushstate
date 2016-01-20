/*********************************************************
 * Progressive Pushstate - a library to facilitate
 * progressively enhanced pushstate/popstate enabled applications
 * with a server-side fallback.
 * 
 * by Zoltan Hawryluk (zoltan.dulac@gmail.com)
 * MIT License.
 ********************************************************/


var pp = new function () {
	var me = this,
		orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
	
	me.linksEl = [];
	me.lastState = {};
	me.popstateEvent = function (e, state) {};
	me.options = {};
	
	/*
	 * init(): called to initialize this object
	 * 
	 * popstateEvent: a method to call when the query string changes
	 * options: options to configure this object.  Values can be:
	 * 
	 * - pushScrollState: enables the application to keep track of
	 *   scrollbar position in the app. (default: false)
	 * - debounceTime: sets the debounce time for resize/scroll events
	 *   (default: 50)
	 * - doPopstateOnload: fire the popstateEvent onload (default: true)
	 * - defaultState: the initial default state of the application
	 *   (default: {} or if a link with class "pp-default" exists, the
	 *   URL of that link).
	 * 
	 */
	me.init = function (popstateEvent, options) {
		me.options = (options || {}); 
		
		// links that will update the state of the application
		me.linksEl = document.getElementsByClassName('pp-link');
		
		// there should only be one link with this class, which
		// will have the default state of the app in the query string. 
		me.defaultEl = document.getElementsByClassName('pp-default');
		
		
		me.popstateEvent = popstateEvent;
		
		var linksElLen = me.linksEl.length,
			i;
		
		for (i=0; i<linksElLen; i++) {
			me.linksEl[i].addEventListener('click', linkClickEvent);
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
			// browser fallback.  More info:
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
		if (me.options.doPopstateOnload) {
			var splitLocation = location.href.split('?');
			
			if (splitLocation.length === 2) {
				var params = queryStringToObject(splitLocation[1]);
				me.popstateEvent({
					type: 'init',
					target: document,
					currentTarget: document
				}, {
					state: params
				});
			}
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

			window.history.replaceState(state, '', url);
		}
	}
	
	/*
	 * The onPopstate method handler. It runs the popstateEvent
	 * given by the application to this library after setting
	 * the event's state property.
	 */
	function internalPopstateEvent(e) {
		var state;
		
		// if the state is null and we have a default state, use that instead.
		if (me.options.defaultState !== null && e.state === null) {
			state = me.options.defaultState;
		} else {
			state = e.state;
		}
		me.popstateEvent(e, state);
		me.lastState = state;
	}
	
	/*
	 * click event that is fired on <a href="" class="pp-link">
	 * nodes.  It takes the link's URL and puts the data inside
	 * the query string into the document's popstate for the URL.
	 */
	function linkClickEvent(e) {
		var target = e.currentTarget,
			URL = target.href,
			splitURL = URL.split('?');
			
		if (splitURL.length === 2) {
			var splitHash=splitURL[1].split('#'),
				qs = splitHash[0],
				hash = splitHash[1];
				
			e.preventDefault();
			me.updatePushState(e, qs, hash);
			
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
	 * into a JavaScript object.
	 */
	function queryStringToObject(qs) {
		var keyVals = qs.split('&'),
		keyValsLen = keyVals.length,
		i, r = {};
		
		for (i=0; i<keyValsLen; i++) {
			var keyVal = keyVals[i],
				splitVal = keyVal.split('=');
			
			r[decodeURIComponent(splitVal[0])] = decodeURIComponent(splitVal[1]);
		}
		
		return r;
	}
	
	/*
	 * Takes a JavaScript object and converts it into a query string.
	 */
	function objectToQueryString(obj) {
		var i, sb = [];
		
		for (i in obj) {
			sb.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
			
		}
		
		return sb.join('&');
	}
	
	/*
	 * Takes a query string and hash value and puts 
	 * it into the history's pushstate.  For example:
	 * 
	 * qs -> "this=1&that=2&other=3"
	 * hash -> myLinkName
	 * 
	 * will put this into the pushstate:
	 * 
	 * {
	 * 	  this: '1',
	 *    that: '2',
	 *    other: '3',
	 *    _ppHash: 'myLinkName'
	 * } 
	 */
	me.updatePushState = function (e, qs, hash) {
		
		e.preventDefault();
		
		
		var params = queryStringToObject(qs);
		
		if (hash) {
			params._ppHash = hash;
		}
		
		if (window.history.pushState) {
			var newUrl = getBaseUrl() + '?' + qs;
			
			if (hash) {
				newUrl += '#' + hash;
			}
			
			window.history.pushState(params, '', newUrl);
			
			e.state = params;
			
			me.popstateEvent(e, params);
			
			me.lastState = params;
			
		}
	};
	
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
};

