// http://forum.jscourse.com/t/18-zadanie-tajmery/726/1

(function() {
	'use strict';

	function topWalker(node, testFunc, lastParent) {
		while (node && node !== lastParent) {
			if (testFunc(node)) {
				return node;
			}
			node = node.parentNode;
		}
	}

	function CreateTimer(node) {
		this.S_KEY = 83;
		this.L_KEY = 76;
		this.R_KEY = 82;

		this.node = node;
		this.widget = this.createWidgetMarkUp();
		this.currentTimeDiv = this.widget.querySelector('.timer-current-time');
		this.startButton = this.widget.querySelector('.timer-start');
		this.resetButton = this.widget.querySelector('.timer-reset');
		this.lapButton = this.widget.querySelector('.timer-lap');
		this.lapsListDiv = this.widget.querySelector('.timer-stopwatch-laps');
		this.timerId = null;
		this.time = null;
		this.init();
	}

	CreateTimer.prototype.createDiv = function(classes, innerContent) {
		var div = document.createElement('div');
		for (var i = 0; i < classes.length; i += 1) {
			div.classList.add(classes[i]);
		}
		if (innerContent) {
			div.innerText = innerContent;
		}
		return div;
	};

	CreateTimer.prototype.createContent = function(structure, rootClassName) {
		var container = this.createDiv(rootClassName);
		var self = this;
		var content = structure.reduce(function(previousValue, currentItem) {
			var div = self.createDiv(currentItem.classes, currentItem.innerText);
			var subContent;
			if (currentItem.innerMarkUp) {
				subContent = self.createContent(currentItem.innerMarkUp, currentItem.classes);
				previousValue.appendChild(subContent);
				return previousValue;
			} else {
				previousValue.appendChild(div);
				return previousValue;
			}
		}, container);
		return content;
	};

	CreateTimer.prototype.createWidgetMarkUp = function() {
		var widgetStructure = {
			classes: ['timer-container'],
			innerMarkUp: [{
				classes: ['timer-time-info', 'column'],
				innerMarkUp: [{
					classes: ['timer-current-time'],
					innerText: '00:00:00:00'
				}, {
					classes: ['timer-stopwatch-laps'],
					innerText: ''
				}]
			}, {
				classes: ['buttons', 'column'],
				innerMarkUp: [{
					classes: ['timer-start'],
					innerText: 'Start'
				}, {
					classes: ['timer-lap'],
					innerText: 'Lap'
				}, {
					classes: ['timer-reset'],
					innerText: 'Reset'
				}]
			}]
		};
		var widgetMarkUp = this.createContent(widgetStructure.innerMarkUp, widgetStructure.classes);
		return widgetMarkUp;
	};

	CreateTimer.prototype.addZero = function(i) {
		if (i < 10) {
			i = '0' + i;
		}
		return i;
	};

	CreateTimer.prototype.getTime = function() {
		var now = new Date();
		var res = [];
		res.push(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
		return res;
	};

	CreateTimer.prototype.startTime = function() {
		var self = this;
		var stop;
		var start;
		// if (this.startButton.classList.contains('check')) {
		// 	start = stop;
		// } else
		if (this.time) {
			start = this.time;
		} else {
			start = this.getTime();
			this.time = start;
		}
		this.timerId = setInterval(function run() {
			var now = self.getTime();
			var difference = start.reduce(function(previousValue, currentItem, index) {
				var formattedMs;
				if (index !== 3) {
					previousValue += self.addZero(-(currentItem - now[index])) + ':';
					return previousValue;
				} else {
					formattedMs = now[index].toString();
					formattedMs = self.addZero(formattedMs.charAt(0) + formattedMs.charAt(1));
					previousValue += formattedMs;
					return previousValue;
				}
			}, '');
			// stop = now;
			self.currentTimeDiv.innerText = difference;
		}, 16);
	};

	CreateTimer.prototype.createLap = function() {
		var lapDiv = this.createDiv(['timer-stopwatch-laps-alert'], this.currentTimeDiv.innerText);
		var span = document.createElement('span');
		span.classList.add('timer-stopwatch-laps-cancel');
		lapDiv.appendChild(span);
		return lapDiv;
	};

	CreateTimer.prototype.addLap = function() {
		var lap = this.createLap();
		this.lapsListDiv.appendChild(lap);
	};

	CreateTimer.prototype.deleteAllLaps = function() {
		var laps = this.lapsListDiv.children;
		Array.prototype.forEach.call(laps, function(lap) {
			lap.classList.add('hidden');
		});
	};

	CreateTimer.prototype.stopTime = function() {
		return clearInterval(this.timerId);
	};

	CreateTimer.prototype.resetTime = function() {
		this.stopTime();
		this.time = null;
		this.currentTimeDiv.innerText = '00:00:00:00';
		this.deleteAllLaps();
	};

	CreateTimer.prototype.startButtonBehaviour = function() {
		if (this.startButton.classList.contains('started')) {
			this.startButton.classList.remove('started');
			this.startButton.classList.add('stopped', 'check');
			this.startButton.innerText = 'Start';
			return this.stopTime();
		}
		this.startButton.classList.remove('stopped');
		this.startButton.classList.add('started');
		this.startButton.innerText = 'Stop';
		return this.startTime();
	};

	CreateTimer.prototype.resetButtonBehaviour = function() {
		this.startButton.classList.remove('started', 'stopped', 'check');
		this.startButton.innerText = 'Start';
		this.resetTime();
	};

	CreateTimer.prototype.lapButtonBehaviour = function() {
		this.addLap();
	};

	CreateTimer.prototype.cancelButtonBehaviour = function() {
		if (topWalker(event.target, function(node) {
				return node.nodeName === 'SPAN';
			})) {
			event.target.parentNode.classList.add('hidden');
		}
	};

	CreateTimer.prototype.deleteLastClass = function() {
		var timerContainers = document.querySelectorAll('.timer-container');
		Array.prototype.forEach.call(timerContainers, function(timerContainer) {
			timerContainer.classList.remove('last');
		});
	};

	CreateTimer.prototype.toggleLastClass = function(event) {
		var timerContainer;
		if (topWalker(event.target, function(node) {
				timerContainer = node;
				return node.classList.contains('timer-container');
			}, document.body)) {
			this.deleteLastClass();
			timerContainer.classList.add('last');
		}
	};

	CreateTimer.prototype.onGlobalMouseOver = function() {
		var self = this;
		document.body.addEventListener('mouseover', function(event) {
			self.toggleLastClass(event);
		}, false);
	};

	CreateTimer.prototype.keysBehaviour = function(keyCode) {
		if (this.widget.classList.contains('last')) {
			if (keyCode === this.S_KEY) {
				return this.startButtonBehaviour();
			} else if (keyCode === this.L_KEY) {
				return this.lapButtonBehaviour();
			} else if (keyCode === this.R_KEY) {
				return this.resetButtonBehaviour();
			}
		}
	};

	CreateTimer.prototype.onGlobalKeyUp = function() {
		var self = this;
		var lastTimerContainer = document.querySelector('.last');
		document.body.addEventListener('keyup', function(event) {
			self.keysBehaviour(event.keyCode);
		}, false);
	};

	CreateTimer.prototype.initiateOnStopWatchButtonsClick = function() {
		var self = this;
		this.startButton.addEventListener('click', function() {
			return self.startButtonBehaviour();
		}, false);
		this.lapButton.addEventListener('click', function() {
			return self.lapButtonBehaviour();
		}, false);
		this.resetButton.addEventListener('click', function() {
			return self.resetButtonBehaviour();
		}, false);
	};

	CreateTimer.prototype.initiateOnLapClick = function() {
		var self = this;
		this.lapsListDiv.addEventListener('click', function(event) {
			self.cancelButtonBehaviour();
		}, false);
	};

	CreateTimer.prototype.init = function() {
		this.widget.addEventListener('mousedown', function(event) {
			event.preventDefault();
		}, false);
		this.initiateOnStopWatchButtonsClick();
		this.initiateOnLapClick();
		this.onGlobalMouseOver();
		this.onGlobalKeyUp();
		this.node.appendChild(this.widget);
	};

	window.CreateTimer = CreateTimer;
})();