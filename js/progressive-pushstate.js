var pp = new function () {
	var me = this;
	
	me.links = [];
	me.popstateEvent = function (e) {};
	
	
	me.init = function (popstateEvent, options) {
		me.links = document.getElementsByClassName('pp-link');
		me.popstateEvent = popstateEvent;
		
		var linksLen = me.links.length,
			i;
		
		for (i=0; i<linksLen; i++) {
			me.links[i].addEventListener('click', linkClickEvent);
		}
		
		window.addEventListener('popstate', me.popstateEvent);
		
		if (options.doPopstateOnload) {
			var splitLocation = location.href.split('?');
			
			if (splitLocation.length === 2) {
				var params = queryStringToObject(splitLocation[1]);
				me.popstateEvent({
					state: params
				});
			}
		}
	};
	
	function linkClickEvent(e) {
		var target = e.currentTarget,
			URL = target.href,
			splitURL = URL.split('?');
			
		if (splitURL.length === 2) {
			var qs = splitURL[1];
			e.preventDefault();
			me.updatePushState(qs);
			
			if (pp.popStateEvent) {
				pp.popStateEvent();
			}
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
		
		return me.sortObject(r);
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
	me.updatePushState = function (qs) {
		
		var params = queryStringToObject(qs);
		
		if (window.history.pushState) {
			var newUrl = getBaseUrl() + '?' + qs;
			
			window.history.pushState(params, '', newUrl + '?' + qs);
			
			me.popstateEvent({
				state: params
			});
			
		}
	};
	
	me.sortObject = function(obj) {
		return Object.keys(obj).sort().reduce(function (result, key) {
			result[key] = obj[key];
			return result;
		}, {});
	};
};

