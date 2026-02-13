
import type { GameState } from './GameState';
import { PlayerGrid } from './PlayerGrid';



export interface PlayerHandRef {
  activePlayerId: number
  gameState: GameState
  diceValue: number
  onSetCell: ((column: number) => void) | undefined
}



export const PlayerHand: React.FC<PlayerHandRef> = (props: PlayerHandRef) => {

  return <>

    <PlayerGrid gameState={props.gameState} boardId={(props.activePlayerId + 1) % 2} />

    <br></br>
    <br></br>

    <PlayerGrid gameState={props.gameState} boardId={props.activePlayerId} onSetCell={props.onSetCell} />
  </>;
};
