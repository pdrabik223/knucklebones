// import { useState } from 'react'
import diceLogo from './assets/dice.png'
// import viteLogo from '/vite.svg'
import { IoMdArrowRoundUp } from "react-icons/io";
import './App.css'
import { Row } from './components/Row'
import { Column } from './components/Column'
import { useState, type JSX } from 'react'

import { v4 as uuidv4 } from 'uuid';

class GameState {
  boardA: number[][] = [[0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]]
  boardB: number[][] = [[0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]]
  constructor() {
  }

  canSetCell(board: number, column: number) {
    if (board == 0) {
      for (let i = 0; i < 3; i++)
        if (this.boardA[i][column] == 0) return true;

    } else {
      for (let i = 0; i < 3; i++)
        if (this.boardB[i][column] == 0) return true;
    }
    return false;

  }

  setCell(board: number, column: number, value: number) {
    if (this.canSetCell(board, column)) {
      if (board == 0) {
        for (let i = 0; i < 3; i++)
          if (this.boardA[i][column] == 0) { this.boardA[i][column] = value; return }
      } else {
        for (let i = 0; i < 3; i++)
          if (this.boardB[i][column] == 0) { this.boardB[i][column] = value; return }
      }
    }
  }
}


export function App() {

  const [diceValue, setCount] = useState(0);
  const [gameState, _] = useState(new GameState());


  return (
    <>
      <div>
        {/* <img src={diceLogo} alt="dice" /> */}
        <PlayerGrid gameState={gameState} boardId={0} />

        <br></br>

        <br></br>

        <PlayerGrid gameState={gameState} boardId={1} onSetCell={(column) => {
          gameState.setCell(1, column, diceValue),
            console.log(gameState),
            setCount(0)
        }} />

        <button onClick={() => setCount(Math.floor(Math.random() * 6) + 1)}> <h2>Roll dice</h2> </button>

        <h2> {diceValue}</h2>
      </div>
    </>
  )
}

interface PlayerGridRef {
  gameState: GameState,
  boardId: number,
  onSetCell?: (column: number) => void,
}


const PlayerGrid: React.FC<PlayerGridRef> = (props: PlayerGridRef) => {
  let board;

  if (props.boardId == 0)
    board = props.gameState.boardA;
  else
    board = props.gameState.boardB;

  let cellGrid: JSX.Element[] = []
  for (let x = 0; x < 3; x++) {
    let row: JSX.Element[] = []
    for (let y = 0; y < 3; y++) {
      let cellWidget = <Cell key={uuidv4()} value={board[x][y]} />
      row.push(cellWidget)
    }
    cellGrid.push(<Row>{row}</Row>)
  }

  let controls: JSX.Element[] = [];
  if (props.onSetCell != null) {
    for (let x = 0; x < 3; x++) {
      if (props.gameState.canSetCell(props.boardId, x)) {
        controls.push(
          <button onClick={() => props.onSetCell!(x)}>
            <IoMdArrowRoundUp scale={20} color="#ea0000" />
          </button>
        )
      } else {
        controls.push(
          <button>
            <IoMdArrowRoundUp scale={20} color="#3f3f3f" />
          </button>
        )

      }
    }
  }

  return (

    <Column>
      {cellGrid}
      <Row>{controls}</Row>
    </Column>


  );
}


interface CellRef {
  value: number
}


const Cell: React.FC<CellRef> = (props: CellRef) => {

  return (
    <h2>
      {props.value}
    </h2>
  );
}

