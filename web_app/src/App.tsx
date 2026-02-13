import diceLogo from './assets/dice.png'
import './App.css'

import { GameState } from './GameState';
import { Row } from './components/Row';
import { Column } from './components/Column';

import { PlayerHand } from './PlayerHand';

import { useLayoutEffect, useRef, useState } from 'react'
import { GameRender } from './GameRender';


export function App() {

  return <>

    
      <GameRender/>
    
  </>
}

type Size = {
  width: number;
  height: number;
};

interface SizerRef {
  children: React.ReactNode,

}

const Sizer: React.FC<SizerRef> = (props: SizerRef) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current?.parentElement;
    if (!element) return;

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ color: "red" }}>
      {props.children}
    </div>
  );

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



