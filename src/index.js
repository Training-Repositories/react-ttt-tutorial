import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// Function components can be used when a component only contains a render method and
// maintains no state information. These components do not use 'this'!
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value} {/*Calls the parent onClick method*/}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} // Passes the onClick() function from parent to child
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  // React uses props to pass values and information from parent to child components.
  // Props should never be changed in a child component -> do this instead with parent
  // methods. State are similar to props, but managed by the component itself (not
  // passed down)
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  // Handler method for the onClick() event launched in the Board
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // Replace history
    const current = history[history.length - 1];

    // Slicing the component creates a copy rather than changing the original value. This
    // is very important for detecting state changes - creating a copy of an object, and
    // then changing that new object allows a comparison to be made against the original
    // object, and also preserves the original object in case it is needed later.
    const squares = current.squares.slice(0);

    // Check if someone has won
    if (calculateWinner(squares) || squares[i]) {
      return; // If so, do not continue
    }

    squares[i] = this.state.xIsNext ? "X" : "O"; // Inline if/else to determine X or O
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    }); // Calling setState updates the parent and all children automatically
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // React uses keys to manage its components - when a key is not assigned, React will
    // present a warning indicating "each child in a list should have a unique key prop"
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
}

// ========================================

// JSX elements are called in the form <NAME />
ReactDOM.render(<Game />, document.getElementById("root"));
