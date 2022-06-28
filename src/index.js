import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
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
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calcularGanador(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xTurno ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      xTurno: !this.state.xTurno,
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xTurno: true,
    };
  }
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const ganador = calcularGanador(current.squares);

    const movimientos = history.map((paso, movimiento) => {
      const desc = movimiento
        ? "Ir al movimiento #" + movimiento
        : "Ir al inicio del juego";
      return (
        <li>
          <button onClick={() => this.irA(movimiento)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (ganador) {
      status = "Ganador: " + ganador;
    } else {
      status = "Turno para: " + (this.state.xTurno ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{movimientos}</ol>
        </div>
      </div>
    );
  }
}

//=====================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calcularGanador(squares) {
  const lineas = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lineas.length; i++) {
    const [a, b, c] = lineas[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
