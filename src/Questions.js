import Option from "./Option";
function Questions({ question, dispatch, answer }) {
	console.log(question);
	return (
		<div>
			<h4>{question.question}</h4>
			<Option question={question} dispatch={dispatch} answer={answer} />
		</div>
	);
}

export default Questions;
