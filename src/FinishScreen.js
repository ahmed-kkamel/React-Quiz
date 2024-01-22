function FinishScreen({ points, maxPossiblePoints, highScore, dispatch }) {
	const percentage = (points / maxPossiblePoints) * 100;
	return (
		<>
			<p className="result">
				You scored <strong>{points}</strong> out of {maxPossiblePoints} (
				{Math.ceil(percentage)}%)
			</p>
			<p className="highscore">High Score:{highScore} points </p>
			<button
				className="btn btn-ui"
				onClick={() => dispatch({ type: "restart" })}
			>
				Restart
			</button>
		</>
	);
}

export default FinishScreen;
