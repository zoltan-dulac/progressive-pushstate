var example1 = new function () {
	
	var me = this,
		outputEl = document.getElementById('output'),
		$jxr,
		cache = {},
		currentF,
		$content = $('#content'),
		$article = $('article'),
		currentState,
		newContent,
		transitionend = 'transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd',
		animationend = 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd';
	
	me.init = function () {
		pp.init(me.popstateEvent);
	};
	
	me.popstateEvent = function(e) {
		currentState = e.state;
		
		var cachedData = cache[currentState.f];
		
		if (cachedData === undefined) {
			
			$jxr = $.ajax('includes/' + currentState.f + '.html')
				.done(function () {
					newContent = $jxr.responseText;
					cache[currentState.f] = newContent;
					$article.on(animationend, hideTransitionEndEvent);
					$article.removeClass('show').addClass('hide');
					
				})
				.fail(function () {
					$content.html('File Not Found');
				});
			 
		} else {
			$article.on(animationend, hideTransitionEndEvent);
			newContent = cache[currentState.f];
			$article.removeClass('show').addClass('hide');
			
		}
 	};
 	
 	function hideTransitionEndEvent(e) {
 		$article.off(animationend, hideTransitionEndEvent);
		$article.on(animationend, showTransitionEndEvent);
		$content.html(newContent);
		
		$article.removeClass('hide').addClass('show');
 	}
 	
 	function showTransitionEndEvent(e) {
 		$article.off(animationend, showTransitionEndEvent);
 		$article.removeClass('show hide');
 	}
	 
};

example1.init();
