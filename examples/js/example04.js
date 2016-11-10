var example4 = new function () {
	
	var me = this,
		tableEl = document.getElementById('wcag-requirements');
		rowEls = tableEl.querySelectorAll('#wcag-requirements tbody tr');
	
	me.init = function () {
		var el, i;
		
		for (i=0; i<rowEls.length; i++) {
			el = rowEls[i];
			var levelCell = el.getElementsByTagName('td')[3];
			
			el.classList.add('level-' + levelCell.innerHTML);
				
		}
		
		pp.init(me.popstateEvent);
	}
	
	me.popstateEvent = function (e) {
		var currentState = e.state,
			level = currentState.level;
		
		
		if (currentState.level) {
			if (typeof(level) === 'string') {
				tableEl.className = currentState.level;
			} else {
				tableEl.className = currentState.level.join(' ');
			}
		} else {
			tableEl.className = 'all-levels';
		}
		
	}
}

example4.init();
