/*********************************************************
 * Progressive Pushstate - a library to facilitate
 * progressively enhanced pushstate/popstate enabled applications
 * with a server-side fallback.
 * 
 * by Zoltan Hawryluk (zoltan.dulac@gmail.com)
 * MIT License.
 ********************************************************/


var pp = new function () {
	var me = this;
	
	me.linksEl = [];
	me.lastState = {};
	me.popstateEvent = function (e, state) {};
	me.options = {};
	
	
	me.init = function (popstateEvent, options) {
		me.options = (options || {}); 
		
		me.linksEl = document.getElementsByClassName('pp-link');
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
		
		if (me.options.pushScrollState) {
			// We make sure we throttle scroll and resize because
			// browsers fire these events like mad and slow the browser
			// down.
			me.onScrollDebounced = debounce(scrollEvent, me.options.debounceTime || 50);
			window.addEventListener('scroll', me.onScrollDebounced);
			window.addEventListener('resize', me.onScrollDebounced);
		}
		
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
	
	
	function getBaseUrl() {
		var loc = window.location;
		return loc.protocol + "//" + loc.host + loc.pathname;
	};
	
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
	
	me.getParamQueryString = function(params, i, isLastParam) {
		var q = "";

		q += i + '=' + params[i];

		if (!isLastParam) {
			q += '&';
		}

		return q;
	};

	
	function objectToQueryString(obj) {
		var i, sb = [];
		
		for (i in obj) {
			sb.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
			
		}
		
		return sb.join('&');
	}
	
	/**
	 * http://stackoverflow.com/a/19279268/1778273
	 *
	 * updates the URL in the user's browser to include their latest search query
	 * example:
	 * - http://hostname/path/to/page?q=one -> search for two -> http://hostname/path/to/page?q=two
	 *
	 * @param query the User's search query
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
	
	me.sortObject = function(obj) {
		return Object.keys(obj).sort().reduce(function (result, key) {
			result[key] = obj[key];
			return result;
		}, {});
	};
};

