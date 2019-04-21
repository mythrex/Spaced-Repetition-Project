function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function getAnswers() {
	var answer1 = $('#answer-1').val();
	var answer2 = $('#answer-2').val();
	var answer3 = $('#answer-3').val();
	var answer4 = $('#answer-4').val();
	$('#answer-1').val('');
	$('#answer-2').val('');
	$('#answer-3').val('');
	$('#answer-4').val('');
	return [answer1, answer2, answer3, answer4];
}

$(function() {
	if (!loadFromStorage('questions')) loadQuestions();
	$('#submit').click(function() {
		var answers = getAnswers();
		var questions = loadFromStorage('questions');
		for (var i = 0; i < answers.length; i++) {
			incSeen(i + 1);
			incDelta(i + 1);
			if (answers[i].toLowerCase() == questions[i + 1].answer.toLowerCase()) {
				incCorrect(i + 1);
			} else {
				incIncorrect(i + 1);
			}
		}
		getPredictions();
		var preds = loadFromStorage('preds');
		console.log(preds);
		for (var i = 0; i < preds.length; i++) {
			$(`#p-${i + 1}`).text(preds[i]['pred']);
		}
		$('#modal-results').modal('show');
	});
});
