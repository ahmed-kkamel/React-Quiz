import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Questions from "./Questions";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
const initialState = {
	questions: [],
	// loading , error ,ready , active , finished
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
};
function reducer(state, action) {
	console.log(action.payload);
	switch (action.type) {
		case "dataRecived":
			return { ...state, questions: action.payload, status: "ready" };
		case "dataFailed":
			return { ...state, status: "error" };
		case "start":
			return { ...state, status: "active" };
		case "newAnswer":
			const question = state.questions.at(state.index);
			return {
				...state,
				answer: action.payload,
				points:
					action.payload === question.correctOption
						? state.points + question.points
						: state.points,
			};
		case "nextQuestion":
			return {
				...state,
				index: state.index + 1,
				answer: null,
			};
		case "finish":
			return {
				...state,
				status: "finish",
				highScore:
					state.points > state.highScore ? state.points : state.highScore,
			};
		case "restart":
			return { ...initialState, questions: state.questions, status: "ready" };

		default:
			throw new Error("Unkown action");
	}
}
export default function App() {
	const [{ questions, status, index, answer, points, highScore }, dispatch] =
		useReducer(reducer, initialState);
	const numQuestions = questions.length;
	const maxPossiblePoints = questions.reduce(
		(prev, cur) => prev + cur.points,
		0
	);
	useEffect(function () {
		fetch("http://localhost:9000/questions")
			.then((res) => res.json())
			.then((data) => dispatch({ type: "dataRecived", payload: data }))
			.catch((err) => dispatch({ type: "dataFailed" }));
	}, []);
	return (
		<div className="app">
			<Header />
			<Main>
				{status === "loading" && <Loader />}
				{status === "error" && <Error />}
				{status === "ready" && (
					<StartScreen numQuestions={numQuestions} dispatch={dispatch} />
				)}
				{status === "active" && (
					<>
						<Progress
							index={index}
							numQuestions={numQuestions}
							points={points}
							maxPossiblePoints={maxPossiblePoints}
							answer={answer}
						/>
						<Questions
							question={questions[index]}
							answer={answer}
							dispatch={dispatch}
						/>
						<NextButton
							dispatch={dispatch}
							answer={answer}
							index={index}
							numQuestions={numQuestions}
						/>
					</>
				)}
				{status === "finish" && (
					<FinishScreen
						points={points}
						maxPossiblePoints={maxPossiblePoints}
						highScore={highScore}
						dispatch={dispatch}
					/>
				)}
			</Main>
		</div>
	);
}
