var example1 = new function () {
	
	var me = this,
		outputEl = document.getElementById('output'),
		$jxr,
		cache = {},
		currentF,
		$content = $('#content'),
		$body = $('body'),
		currentState,
		newContent,
		transitionend = 'transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd',
		animationend = 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd';
	
	me.init = function () {
		
		// enable position sticky polyfill for browsers that need it.
		//$('nav').Stickyfill();
		$( 'nav' ).fixedsticky();
		
		pp.init(me.popstateEvent, {
			doPopstateOnload: true
		});
	};
	
	me.popstateEvent = function(e) {
		currentState = e.state;
		
		var cachedData = cache[currentState.f];
		
		if (cachedData === undefined) {
			
			$jxr = $.ajax('includes/' + currentState.f + '.html')
				.done(function () {
					newContent = $jxr.responseText;
					cache[currentState.f] = newContent;
					$body.on(animationend, hideTransitionEndEvent);
					$body.removeClass('show').addClass('hide');
					
				})
				.fail(function () {
					$content.html('File Not Found');
				});
			 
		} else {
			$body.on(animationend, hideTransitionEndEvent);
			newContent = cache[currentState.f];
			$body.removeClass('show').addClass('hide');
			
		}
 	};
 	
 	function hideTransitionEndEvent(e) {
 		$body.off(animationend, hideTransitionEndEvent);
		$body.on(animationend, showTransitionEndEvent);
		$content.html(newContent);
		
		$body.removeClass('hide').addClass('show');
 	}
 	
 	function showTransitionEndEvent(e) {
 		window.scrollTo(0, 0);
 		$body.off(animationend, showTransitionEndEvent);
 		$body.removeClass('show hide');
 	}
	 
};

example1.init();
