var example3 = new function () {
	var me = this,
		formEl = document.getElementsByTagName('form')[0],
		tableEl = document.getElementById('wcag-requirements'),
		rowEls = tableEl.querySelectorAll('#wcag-requirements tbody tr'),
		captionEl = tableEl.getElementsByTagName('caption')[0];
	
	me.init = function () {
		var el, i, cells, sectionCell, levelCell;
		
		
		pp.init(me.popstateEvent);
		
		formEl.addEventListener('focus', formFocusinEvent, true);
		formEl.addEventListener('blur', formFocusoutEvent, true);
		tableEl.addEventListener('animationstart', animationendEvent);
		tableEl.addEventListener('animationend', animationendEvent);
	};
	
	function formFocusinEvent(e) {
		formEl.classList.add('has-focused-elements');
	}
	
	function formFocusoutEvent(e) {
		formEl.classList.remove('has-focused-elements');
	}
	
	function animationstartEvent(e) {
		tableEl.classList.remove('animation-done');
	}
	
	function animationendEvent(e) {
		tableEl.classList.add('animation-done');
	}
	
	me.popstateEvent = function (e) {
		var currentState = e.state,
			level = currentState['level[]'],
			section = currentState.section,
			classes,
			levelRows,
			sectionRows,
			rowEl, i,
			rowClassList,
			captionSection = (currentState.section == null) ? 'all sections' : currentState.section.replace('-', ' '),
			captionLevel,
			visibleRowCount = 0;
		
		
		for (i=0; i<rowEls.length; i++) {
			rowEl = rowEls[i];
			rowClassList = rowEl.classList;
			rowClassList.remove('even');
			if ((!level || pp.isInStateProperty(level, rowEl.dataset.level)) && (!section || rowClassList.contains(section))) {
				rowClassList.remove('hide');
				rowClassList.add('show');
				if (visibleRowCount % 2 === 0) {
					rowClassList.add('even');
				} 
				visibleRowCount++;
			} else {
				rowClassList.remove('show');
				rowClassList.add('hide');
			}
		}
		
		
		
		if (!level || level.length === 3) {
			captionLevel = 'of WCAG A, AA and AAA';
		} else {
			switch (typeof(level)) {
				case 'string':
					captionLevel = 'of WCAG Level ' + level.replace('level-', '');
					break;
				default:
					captionLevel = 'of WCAG Levels ' + level[0].replace('level-', '') + ' and ' + level[1].replace('level-', '');
					break;
			}
		}
		
		captionEl.innerHTML = 'This is a table that contains ' + captionSection + ' ' + captionLevel;
		
		
 	
	};
};

example3.init();
