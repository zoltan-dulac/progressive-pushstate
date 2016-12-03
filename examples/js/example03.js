var example3 = new function () {
	
	var me = this,
		outputEl = document.getElementById('output'),
		$jxr,
		cache = {},
		currentF,
		$content = $('#content'),
		$article = $('article'),
		currentState,
		newContent,
		animationend = 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',
		animationDir;
	
	me.init = function () {
		pp.init(me.popstateEvent);
	};
	
	me.popstateEvent = function(e) {
		currentState = e.state;
		
		var cachedData = cache[currentState.country];
		
		if (pp.lastState && pp.lastState._ppPageNum > e.state._ppPageNum) {
			animationDir = 'left';
		} else {
			animationDir = 'right';
		}
		
		$article.addClass(animationDir);
		
		if (cachedData === undefined) {
			
			$jxr = $.ajax('showCountries.php?country=' + currentState.country)
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
			newContent = cache[currentState.country];
			$article.removeClass('show').addClass('hide');
			
		}
 	};
 	
 	
 	function hideTransitionEndEvent(e) {
 		$article.off(animationend, hideTransitionEndEvent);
		$article.on(animationend, showTransitionEndEvent);
		$article.html(newContent);
		
		$article.removeClass('hide').addClass('show');
 	}
 	
 	function showTransitionEndEvent(e) {
 		$article.off(animationend, showTransitionEndEvent);
 		$article.removeClass('show hide left right');
 	}
	 
};

example3.init();
