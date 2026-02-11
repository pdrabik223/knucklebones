import type { JSX } from 'react';
import { IoMdArrowRoundUp } from 'react-icons/io';
import { v4 as uuidv4 } from 'uuid';

import { Column } from './components/Column';
import { Row } from './components/Row';
import type { GameState } from './GameState';
import { Cell } from './Cell';



export interface PlayerGridRef {
    gameState: GameState,
    boardId: number,
    onSetCell?: (column: number) => void,
}




export const PlayerGrid: React.FC<PlayerGridRef> = (props: PlayerGridRef) => {
    let board;

    if (props.boardId == 0)
        board = props.gameState.boardA;
    else
        board = props.gameState.boardB;

    let cellGrid: JSX.Element[] = [];

    for (let x = 0; x < 3; x++) {
        let row: JSX.Element[] = [];
        for (let y = 0; y < 3; y++) {
            let cellWidget = <Cell key={uuidv4()} value={board[x][y]} />;
            row.push(cellWidget);
        }
        cellGrid.push(<Row>{row}</Row>);
    }

    let controls: JSX.Element[] = [];
    if (props.onSetCell != null) {
        for (let x = 0; x < 3; x++) {
            if (props.gameState.canSetCell(props.boardId, x)) {
                controls.push(
                    <button onClick={() => props.onSetCell!(x)}>
                        <IoMdArrowRoundUp scale={20} color="#ea0000" />
                    </button>
                );
            } else {
                controls.push(
                    <button>
                        <IoMdArrowRoundUp scale={20} color="#3f3f3f" />
                    </button>
                );

            }
        }
    }

    let sumPoints: JSX.Element[] = [];

    for (let x = 0; x < 3; x++) {
        sumPoints.push(
            <p>{props.gameState.sumPointsForColumn(props.boardId, x)} _ </p>
        );
    }


    return (

        <Column>
            {cellGrid}
            <Row>{controls}</Row>
            <Row>{sumPoints}</Row>
        </Column>


    );
};
