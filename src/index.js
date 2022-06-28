import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  if (props.esGanador) {
    return (
      <button className="square ganador" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, esGanador) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        esGanador={esGanador}
      />
    );
  }

  squareGanador(i) {
    if (this.props.lineaGanador) {
      for (let j = 0; j < this.props.lineaGanador.length; j++) {
        if (this.props.lineaGanador[j] === i) {
          return true;
        }
      }
    }
    return false;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, this.squareGanador(0))}
          {this.renderSquare(1, this.squareGanador(1))}
          {this.renderSquare(2, this.squareGanador(2))}
        </div>
        <div className="board-row">
          {this.renderSquare(3, this.squareGanador(3))}
          {this.renderSquare(4, this.squareGanador(4))}
          {this.renderSquare(5, this.squareGanador(5))}
        </div>
        <div className="board-row">
          {this.renderSquare(6, this.squareGanador(6))}
          {this.renderSquare(7, this.squareGanador(7))}
          {this.renderSquare(8, this.squareGanador(8))}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      pasoNumero: 0,
      xTurno: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.pasoNumero + 1);
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
      pasoNumero: history.length,
      xTurno: !this.state.xTurno,
    });
  }

  irA(paso) {
    this.setState({
      pasoNumero: paso,
      xTurno: paso % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.pasoNumero];
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
    const lineaGanador = calcularGanador(current.squares);
    const ganador =
      lineaGanador === null ? null : current.squares[lineas[lineaGanador][0]];

    const movimientos = history.map((paso, movimiento) => {
      const desc = movimiento
        ? "Ir al movimiento #" + movimiento
        : "Ir al inicio del juego";
      return (
        <li key={movimiento}>
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
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            lineaGanador={lineas[lineaGanador]}
          />
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
      return i;
    }
  }
  return null;
}
