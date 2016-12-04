var example1 = new function () {
	
	var me = this,
		outputEl = document.getElementById('output'),
		$jxr,
		cache = {},
		currentF,
		$content = $('#content'),
		$screenReaderAlert = $('#screen-reader-alert'),
		$body = $('body'),
		currentState,
		newContent,
		transitionend = 'transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd',
		animationend = 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd';
	
	me.init = function () {
		pp.init(me.popstateEvent);
	};
	
	me.popstateEvent = function(e) {
		currentState = e.state;
		
		if (!currentState.f) {
			currentState.f = 'home';
		}
		
		/* See if this information was cached */
		var cachedData = cache[currentState.f];
		
		/* 
		 * If it hasn't been cached, then grab it with an ajax call (the file
		 * contains an HTML snippet)
		 */
		if (cachedData === undefined) {
			
			$jxr = $.ajax('includes/' + currentState.f + '.html')
				.done(function () {
					
					/*
					 * When the Ajax call is succesful, take the contents of the data
					 * and place it in the cache as well as in the private variable 
					 * `newContent`.
					 */
					newContent = $jxr.responseText;
					cache[currentState.f] = newContent;
					
					/*
					 * Hide the content with a slick CSS animation and when that animation
					 * ends, fire the `hideTransitionEndEvent` method.
					 */
					$body.on(animationend, hideTransitionEndEvent);
					$body.removeClass('show').addClass('hide');
					
					readATNowShowingMessage(currentState.f);
					
				})
				.fail(function () {
					/*
					 * If this animation fails, inform the user 
					 */
					$content.html('File Not Found');
					$screenReaderAlert.html('Requested page does not exist.');
				});
		
		/*
		 * If this page was cached earlier, then set the private variable 
		 * `newContent` to the cached data, hide the content and fire the
		 * `hideTransitionEndEvent` method.
		 */
			 
		} else {
			$body.on(animationend, hideTransitionEndEvent);
			newContent = cache[currentState.f];
			$body.removeClass('show').addClass('hide');
			readATNowShowingMessage(currentState.f);
		}
 	};
 	
 	/*
 	 * Updates the page's alert area that assistive technologies such as 
 	 * screenreaders will use to inform the user the page has changed.
 	 */
 	function readATNowShowingMessage(pageName) {
 		$screenReaderAlert.html('Now viewing <strong>' + pageName + '<strong> page.');
 	}
 	
 	function hideTransitionEndEvent(e) {
 		/*
 		 * set the content area of the page to the data inside the private
 		 * variable `newContent` and show the animation.  When that show animation
 		 * finishes, fire the `showTransitionEndEvent` method.
 		 */
 		$body.off(animationend, hideTransitionEndEvent);
		$body.on(animationend, showTransitionEndEvent);
		$content.html(newContent);
		
		$body.removeClass('hide').addClass('show');
 	}
 	
 	function showTransitionEndEvent(e) {
 		/*
 		 * scroll to the top of the page and clean up the page.
 		 */
 		window.scrollTo(0, 0);
 		$body.off(animationend, showTransitionEndEvent);
 		$body.removeClass('show hide');
 	}
	 
};

example1.init();
