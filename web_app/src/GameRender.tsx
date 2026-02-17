import { Environment, PerspectiveCamera, Stats } from '@react-three/drei';

import { useRef, useState } from 'react'
import * as THREE from 'three'
import * as React from 'react'
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Obj } from './Obj';
import { SelectableObj } from './SelectableObj';

import { DiceOBj } from './DiceOBj';
import { ColorsMap } from './ColorsMap';
import { GameState } from './GameState';


export interface GameRenderRef {
    playerName: string

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
    }

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

    function getBoard(board: number[][], offset: number = 0, yOffsetMult: number = 1, gravePaths: boolean = false) {
        let cellGrid = []

        let path = gravePaths ? graveAPath : graveBPath;

        for (let x = 0; x < 3; x++)
            for (let y = 0; y < 3; y++)
                cellGrid.push(
                    <Obj light={true} color={ColorsMap[board[x][y]]} position={new THREE.Vector3((y * 6) - 6, 0, - (x + offset) * yOffsetMult)} path={path(x, y)} />
                );
        return cellGrid;
    }

    return <div ref={ref}>
        <Canvas
            shadows
            gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
            style={{ backgroundColor: "#101218ff", height: size.height + "px", width: size.width + "px" }}>

            <ambientLight intensity={0.5} color={0xcccccc} />
            {/* {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} /> */}
            {/* <pointLight position={[20, 20, 100]} color={0xffffff} /> */}

            <directionalLight position={[10, 20, 10]} color={"#cccccc"} castShadow={true} />

            {getBoard(gameState.boardA, 0, gravestoneOffset, true)}
            {getBoard(gameState.boardB, 5, gravestoneOffset + 1.5)}


            <SelectableObj light={diceValue != null} color={ColorsMap[diceValue != null ? diceValue : 0]} position={new THREE.Vector3(6, 0, 7)} path={"./arrow_A.obj"} />
            <SelectableObj light={diceValue != null} color={ColorsMap[diceValue != null ? diceValue : 0]} position={new THREE.Vector3(0, 0, 7)} path={"./arrow_B.obj"} />
            <SelectableObj light={diceValue != null} color={ColorsMap[diceValue != null ? diceValue : 0]} position={new THREE.Vector3(-6, 0, 7)} path={"./arrow_C.obj"} />

            <mesh
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHoverColumn(2)
                }}
                onPointerOut={() => setHoverColumn(-1)}
                onClick={() => { setValue(2) }}
                position={new THREE.Vector3(6, 0, -30)}>
                <boxGeometry args={[5, 1, 80]} />
                <meshPhongMaterial color={"black"} opacity={0.1} transparent />
            </mesh>

            <mesh
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHoverColumn(1)
                }}
                onPointerOut={() => setHoverColumn(-1)}
                onClick={() => { setValue(1) }}
                position={new THREE.Vector3(0, 0, -30)}>
                <boxGeometry args={[5, 1, 80]} />
                <meshPhongMaterial color={"black"} opacity={0.1} transparent />
            </mesh>

            <mesh
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHoverColumn(0)
                }}
                onPointerOut={() => setHoverColumn(-1)}
                onClick={() => { setValue(0) }}
                position={new THREE.Vector3(-6, 0, -30)}>
                <boxGeometry args={[5, 1, 80]} />
                <meshPhongMaterial color={"black"} opacity={0.1} transparent />
            </mesh>


            <DiceOBj
                diceValue={diceValue}
                setDiceValue={setDiceValue}
                light={hoverColumn == 2} position={new THREE.Vector3(12, 0, 5)} />

            <axesHelper />
            <PerspectiveCamera
                makeDefault
                position={cameraShift(new THREE.Vector3(3, 23, 25))}
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
