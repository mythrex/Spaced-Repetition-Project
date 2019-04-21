function saveToStorage(json, key = 'data') {
	localStorage.setItem(key, JSON.stringify(json));
}

function loadFromStorage(key = 'data') {
	if (localStorage.getItem(key)) {
		return JSON.parse(localStorage.getItem(key));
	}
	return false;
}

function loadQuestions() {
	$.get('/static/questions.json', function(data) {
		saveToStorage(data, 'questions');
		makeData();
	});
}

function scaleDays(milisec, maxDays = 254, deadLine = 2) {
	return Math.round((milisec * maxDays) / (deadLine * 3600 * 1000));
}
// make the data for updation.
// this data will be sent to model
function makeData() {
	var questions = loadFromStorage('questions');
	var obj = {};
	for (var id in questions) {
		obj[id] = {
			seen: 4,
			correct: 4,
			incorrect: 0,
			delta: 0,
			lastSeen: null
		};
	}
	saveToStorage(obj, 'data');
}

// increment seen
function incSeen(id) {
	var data = loadFromStorage('data');
	data[id]['seen'] += 1;
	saveToStorage(data, 'data');
}

// increment correct
function incCorrect(id) {
	var data = loadFromStorage('data');
	data[id]['correct'] += 1;
	saveToStorage(data, 'data');
}

// increment incorrect
function incIncorrect(id) {
	var data = loadFromStorage('data');
	data[id]['incorrect'] += 1;
	saveToStorage(data, 'data');
}

function incDelta(id) {
	var data = loadFromStorage('data');
	var prevLastSeen = data[id]['lastSeen'];
	var curTime = new Date();
	if (!(prevLastSeen == null)) {
		data[id]['delta'] = scaleDays(Math.abs(curTime - new Date(prevLastSeen)));
	} else {
		data[id]['delta'] = 0;
	}
	data[id]['lastSeen'] = curTime;
	saveToStorage(data, 'data');
}

function getPredictions() {
	var data = loadFromStorage('data');
	var req = [];
	for (var id in data) {
		req.push({
			id: id,
			data: [
				data[id].seen,
				data[id].correct,
				data[id].incorrect,
				data[id].delta
			]
		});
	}
	$.post('/predict', { data: JSON.stringify(req) }, function(data) {
		saveToStorage(data, 'preds');
	});
}
