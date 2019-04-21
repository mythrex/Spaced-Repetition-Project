function saveToStorage(json, key = 'data') {
	localStorage.setItem(key, JSON.stringify(json));
}

function loadFromStorage(key = 'data') {
	return JSON.parse(localStorage.getItem(key));
}

function loadQuestions() {
	$.get('/static/questions.json', function(data) {
		saveToStorage(data, 'questions');
	});
}

// make the data for updation.
// this data will be sent to model
function makeData() {
	questions = loadFromStorage('questions');
	var obj = {};
	for (var id in questions) {
		obj[id] = {
			seen: 0,
			correct: 0,
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
		data[id]['delta'] = Math.abs(curTime - new Date(prevLastSeen));
	} else {
		data[id]['delta'] = 0;
	}
	data[id]['lastSeen'] = curTime;
	saveToStorage(data, 'data');
}
