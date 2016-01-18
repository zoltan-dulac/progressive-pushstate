var example1 = new function () {
	
	var outputEl = document.getElementById('output');
	
	this.init = function () {
		pp.init(this.popstateEvent);
	};
	
	this.popstateEvent = function(e) {
		outputEl.innerHTML = JSON.stringify(e.state);
	};
};

example1.init();
