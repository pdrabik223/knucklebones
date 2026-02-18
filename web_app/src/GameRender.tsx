import { Environment, PerspectiveCamera, Stats } from '@react-three/drei';

import { useRef, useState } from 'react'
import * as THREE from 'three'
import * as React from 'react'
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Obj } from './Obj';

import { DiceOBj } from './DiceOBj';
import { ColorsMap } from './ColorsMap';
import { GameState } from './GameState';
import { Arrow } from './Arrow';

function graveBPath(x: number, y: number): string {
    const paths = [
        "./gravestone_J.obj"
        , "./gravestone_K.obj"
        , "./gravestone_L.obj"
        , "./gravestone_M.obj"
        , "./gravestone_N.obj"
        , "./gravestone_O.obj"
        , "./gravestone_P.obj"
        , "./gravestone_R.obj"
        , "./gravestone_S.obj"]
    let id = x * 3 + y
    return paths[id]
}
function graveAPath(x: number, y: number): string {
    const paths = [
        "./gravestone_A.obj"
        , "./gravestone_B.obj"
        , "./gravestone_C.obj"
        , "./gravestone_D.obj"
        , "./gravestone_E.obj"
        , "./gravestone_F.obj"
        , "./gravestone_G.obj"
        , "./gravestone_H.obj"
        , "./gravestone_I.obj"
    ]
    let id = x * 3 + y
    return paths[id]
}


export interface GameRenderRef {
    playerName: string,
    opponentName: string,
    playerActive: boolean

}

type Orientation = {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
};

type Size = {
    width: number;
    height: number;
};


export const GameRender: React.FC<GameRenderRef> = (props: GameRenderRef) => {
    const [gameState, _] = useState(new GameState());
    const ref = useRef<HTMLDivElement | null>(null);
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });
    const [mouseCords, setMouseCords] = useState<Size>({ width: 0, height: 0 });
    const [hoverColumn, setHoverColumn] = useState<number | null>(null);
    const [diceValue, setDiceValue] = useState<number | null>(null);
    const [playerActive, setPLayerActive] = useState<boolean>(props.playerActive);

    function cameraShift(defaultPosition: THREE.Vector3) {
        if (size.height > size.width * 1.2) {
            if (orientation.alpha === null || orientation.beta === null)
                return defaultPosition

            defaultPosition.x += orientation.alpha * 3
            defaultPosition.y += orientation.beta * 3

            return defaultPosition
        }
        defaultPosition.x += ((mouseCords.width / size.width) * 2 - 1) * 3
        defaultPosition.y += ((mouseCords.height / size.height) * 2 - 1) * 3

        return defaultPosition

    }
    const [orientation, setOrientation] = useState<Orientation>({
        alpha: null,
        beta: null,
        gamma: null,
    });

    React.useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            setOrientation({
                alpha: event.alpha,
                beta: event.beta,
                gamma: event.gamma,
            });
        };

        window.addEventListener("deviceorientation", handleOrientation);

        return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, []);


    React.useLayoutEffect(() => {
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

    React.useEffect(() => {
        const updatePosition = (event: MouseEvent) => {
            setMouseCords({ width: event.clientX, height: event.clientY });
        };

        window.addEventListener("mousemove", updatePosition);

        return () => {
            window.removeEventListener("mousemove", updatePosition);
        };
    }, []);

    const gravestoneOffset = 8


    function setValue(column: number) {
        if (diceValue != null)
            gameState.setCell(0, column, diceValue)
        setDiceValue(null)
        setPLayerActive(!playerActive)
    }


    function getBoard(board: number[][], offset: number = 0, yOffsetMult: number = 1, gravePaths: boolean = false) {
        let cellGrid = []

        let path = gravePaths ? graveAPath : graveBPath;

        for (let x = 0; x < 3; x++)
            for (let y = 0; y < 3; y++)
                cellGrid.push(
                    <Obj light={true} color={ColorsMap[board[x][y]]} position={new THREE.Vector3((y * 6) - 6, hoverColumn == y ? 1 : 0, - (x + offset) * yOffsetMult)} path={path(x, y)} />
                );
        return cellGrid;
    }

    return <div ref={ref}>
        <Canvas
            shadows
            gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
            style={{ backgroundColor: "#101218ff", height: size.height + "px", width: size.width + "px" }}>

            <ambientLight intensity={0.5} color={0xcccccc} />

            <directionalLight position={[10, 20, 10]} color={"#cccccc"} castShadow={true} />

            {getBoard(gameState.boardA, 0, gravestoneOffset, true)}
            {getBoard(gameState.boardB, 5, gravestoneOffset + 1.5)}

            <Arrow
                light={diceValue != null}
                color={ColorsMap[diceValue != null ? diceValue : 0]}
                position={new THREE.Vector3(6, 0, playerActive ? 7 : -75)}
                path={"./arrow_A.obj"}
                enable={diceValue != null}
                onClick={() => setValue(2)}
                onHoverChange={(e, isHovering) => {
                    e.stopPropagation()
                    if (isHovering)
                        setHoverColumn(2)
                    else
                        setHoverColumn(-1)
                }}
                reverseDirection={!playerActive}
            />

            <Arrow
                light={diceValue != null}
                color={ColorsMap[diceValue != null ? diceValue : 0]}
                position={new THREE.Vector3(0, 0, playerActive ? 7 : -75)}
                path={"./arrow_B.obj"}
                enable={diceValue != null}
                onClick={() => setValue(1)}
                onHoverChange={(e, isHovering) => {
                    e.stopPropagation()
                    if (isHovering)
                        setHoverColumn(1)
                    else
                        setHoverColumn(-1)
                }}
                reverseDirection={!playerActive}
            />

            <Arrow
                light={diceValue != null}
                color={ColorsMap[diceValue != null ? diceValue : 0]}
                position={new THREE.Vector3(-6, 0, playerActive ? 7 : -75)}
                path={"./arrow_C.obj"}
                enable={diceValue != null}
                onClick={() => setValue(0)}
                onHoverChange={(e, isHovering) => {
                    e.stopPropagation()
                    if (isHovering)
                        setHoverColumn(0)
                    else
                        setHoverColumn(-1)
                }}
                reverseDirection={!playerActive}
            />


            <DiceOBj
                diceValue={diceValue}
                setDiceValue={setDiceValue}
                light={hoverColumn == 2} position={new THREE.Vector3(12, 0, playerActive ? 7 : -70)} />

            <PerspectiveCamera
                makeDefault
                position={cameraShift(new THREE.Vector3(3, 23, playerActive ? 25 : 15))}
                rotation={[
                    -Math.PI / 6,
                    0,
                    0,
                ]}
                fov={75}
                near={0.1}
                far={1000}
            />
            <Environment
                files="rogland_clear_night_4k.hdr"   // place HDR in public/hdr/
                background
            />
            <Stats />
            <EffectComposer>
                <Bloom

                    intensity={0.6}
                    luminanceThreshold={0}
                    luminanceSmoothing={0.8}
                />
            </EffectComposer>
        </Canvas>
    </div>;

};
