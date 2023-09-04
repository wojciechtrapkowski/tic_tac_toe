import { useState } from 'react';
import './App.css';
import React, { Component }  from 'react';

function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    // If squares[i] is not empty
    if(squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if(xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;

  if(winner) {
    status = "Winner: " + squares[winner[0]];
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
  <>
      <div className="status">
        Game status: {status}
      </div>
      {Array(3).fill(null).map((_, row) => (
        <div key={row} className="board-row">
          {Array(3).fill(null).map((_, col) => {
            const index = row * 3 + col;
            if(winner != null && winner.includes(index)) {
              return (
                      <div className="winner-tile"> 
                        <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />
                      </div> 
              );
            } else {
              return (
                <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />
              );
            }
          })}
        </div>
      ))}
  </>
    );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function resetGame() {
    const emptyGame = [Array(9).fill(null)];
    setHistory(emptyGame);
    setCurrentMove(0);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove+ 1 ), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map( (squares, move) => {
    let description;
    
    if (move>0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  });


  return (
    <div className="game">
        <div className="board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
        </div>
        <button className="reset-button" onClick={resetGame}>Reset</button>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
    </div>
  );
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}