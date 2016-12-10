var example4 = new function () {
	var me = this,
		resultsEl = document.getElementById('results'),
		rangeValEl = document.getElementById('rangeVal'),
		fontSizeEl = document.getElementById('fontSize'),
		formEl = document.getElementsByTagName('form')[0];
	
	me.init = function () {
		pp.init(me.popstateEvent);
		
		formEl.addEventListener('input', onInputEvent);
		onInputEvent();
	};
	
	me.popstateEvent = function (e) {
		e.preventDefault();
		var currentState = e.state;
	
		if (currentState.numDigits) {
			resultsEl.style.fontSize = fontSizeEl.value + 'px';
			resultsEl.innerHTML = piGenerator.calc(currentState.numDigits);
		}
	};
	
	function onInputEvent(e) {
		rangeValEl.innerHTML = fontSizeEl.value;
	}
	
	function showAllCombinations(string) {
		if (string.length === 0) {
			return;
		}
		
		var firstChar = string.substring(0, 1),
			restString = string.substring(1);
			
		
	}
};



example4.init();
