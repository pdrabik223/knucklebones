// import { useState } from 'react'
import diceLogo from './assets/dice.png'
// import viteLogo from '/vite.svg'
import './App.css'
import { useState } from 'react'

import { PlayerGrid } from './PlayerGrid';
import { GameState } from './GameState';

export function App() {

  const [diceValue, setDiceValue] = useState(0);
  const [gameState, _] = useState(new GameState());
  const [activePlayerId, setActivePlayerID] = useState(0);


  return (
    <>
      <div>
        {/* <img src={diceLogo} alt="dice" /> */}

        <PlayerHand activePlayerId={activePlayerId} gameState={gameState} diceValue={diceValue} onSetCell={(column) => {

          gameState.setCell(activePlayerId, column, diceValue);
          setDiceValue(0);
          setActivePlayerID((activePlayerId + 1) % 2);

        }} />
        <button onClick={diceValue == 0 ? () => setDiceValue(Math.floor(Math.random() * 6) + 1) : undefined}> <h2>Roll dice</h2> </button>

        <h2> {diceValue}</h2>
      </div>
    </>
  )
}
interface PlayerHandRef {
  activePlayerId: number
  gameState: GameState
  diceValue: number
  onSetCell: ((column: number) => void) | undefined
}


export const PlayerHand: React.FC<PlayerHandRef> = (props: PlayerHandRef) => {

  console.log(props.gameState)


  return <>

    <PlayerGrid gameState={props.gameState} boardId={(props.activePlayerId + 1) % 2} />

    <br></br>
    <br></br>

    <PlayerGrid gameState={props.gameState} boardId={props.activePlayerId} onSetCell={props.onSetCell} />
  </>
}