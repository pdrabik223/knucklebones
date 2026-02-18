import './App.css'

import { GameState } from './GameState';
import { Row } from './components/Row';
import { Column } from './components/Column';

import { PlayerHand } from './PlayerHand';

import { useState } from 'react'
import { GameRender } from './GameRender';


export function App() {

  return <>

    <GameRender playerName='Jonny' opponentName='Randy' playerActive={true} />

  </>
}


const GameStateDisplay: React.FC<{}> = () => {

  const [diceValue, setDiceValue] = useState(0);
  const [gameState, _] = useState(new GameState());
  const [activePlayerId, setActivePlayerID] = useState(0);

  return <Row>
    <Column>
      <PlayerHand activePlayerId={activePlayerId} gameState={gameState} diceValue={diceValue} onSetCell={(column) => {

        gameState.setCell(activePlayerId, column, diceValue);
        setDiceValue(0);
        setActivePlayerID((activePlayerId + 1) % 2);

      }} />
    </Column>
    <Column>
      <button onClick={diceValue == 0 ? () => setDiceValue(Math.floor(Math.random() * 6) + 1) : undefined}> <h2>Roll dice</h2> </button>

      <h2> {diceValue}</h2>
    </Column>
  </Row>
}



