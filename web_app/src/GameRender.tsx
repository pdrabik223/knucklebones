import { Environment, OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei';

import { useRef, useState, type JSX } from 'react'
import * as THREE from 'three'
import * as React from 'react'
import { Canvas } from '@react-three/fiber';
// import statueUrl from '../public/gravestones.obj'
import { useMemo } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Obj } from './Obj';
import { SelectableObj } from './SelectableObj';


interface NeonMaterialProps {
    color?: string;
    intensity?: number;
}

export function useNeonMaterial({
    color = "#00ffff",
    intensity = 5,
}: NeonMaterialProps) {
    return useMemo(() => {
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#ffffff"),
            emissive: new THREE.Color(color),
            emissiveIntensity: intensity,
            metalness: 0.5,
            roughness: 0.4,
        });

        return material;
    }, [color, intensity]);
}



export interface GameRenderRef {

}


type Size = {
    width: number;
    height: number;
};

export const GameRender: React.FC<GameRenderRef> = (props: GameRenderRef) => {

    const ref = useRef<HTMLDivElement | null>(null);
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });
    const [mouseCords, setMouseCords] = useState<Size>({ width: 0, height: 0 });
    const [hoverColumn, setHoverColumn] = useState<number | null>(null)
    const [selectedColumn, setSelectedColumn] = useState<number | null>(null)

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

    const spaceBetweenGravestones = 8

    return <div ref={ref}>
        <Canvas
            shadows
            gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
            style={{ backgroundColor: "#101218ff", height: size.height + "px", width: size.width + "px" }}>

            <ambientLight intensity={0.5} color={0xcccccc} />
            {/* {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} /> */}
            {/* <pointLight position={[20, 20, 100]} color={0xffffff} /> */}

            <directionalLight position={[10, 20, 10]} color={"#cccccc"} castShadow={true} />

            <Obj light={true} color={"#00ff37"} position={new THREE.Vector3(6, 0, 0 * spaceBetweenGravestones)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_A.obj"} />
            <Obj light={true} color={"#f1ff2b"} position={new THREE.Vector3(-6, 0, 0 * spaceBetweenGravestones)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_B.obj"} />
            <Obj light={true} color={"#0099ff"} position={new THREE.Vector3(0, 0, 0 * spaceBetweenGravestones)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_C.obj"} />

            <Obj light={false} color={"#ff4800"} position={new THREE.Vector3(6, 0, -1 * spaceBetweenGravestones)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_D.obj"} />
            <Obj light={false} color={"#ffffff"} position={new THREE.Vector3(-6, 0, -1 * spaceBetweenGravestones)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_E.obj"} />
            <Obj light={false} color={"#c800ff"} position={new THREE.Vector3(0, 0, -1 * spaceBetweenGravestones)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_F.obj"} />

            <Obj light={true} color={"#ff4800"} position={new THREE.Vector3(6, 0, -2 * spaceBetweenGravestones)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_G.obj"} />
            <Obj light={true} color={"#c800ff"} position={new THREE.Vector3(-6, 0, -2 * spaceBetweenGravestones)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_H.obj"} />
            <Obj light={true} color={"#0099ff"} position={new THREE.Vector3(0, 0, -2 * spaceBetweenGravestones)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_I.obj"} />

            <Obj light={true} color={"#00ff37"} position={new THREE.Vector3(6, 0, -5 * spaceBetweenGravestones)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_J.obj"} />
            <Obj light={true} color={"#f1ff2b"} position={new THREE.Vector3(-6, 0, -5 * spaceBetweenGravestones)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_K.obj"} />
            <Obj light={true} color={"#ff4800"} position={new THREE.Vector3(0, 0, -5 * spaceBetweenGravestones)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_L.obj"} />

            <Obj light={true} color={"#00ff37"} position={new THREE.Vector3(6, 0, -6 * spaceBetweenGravestones * 1.2)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_M.obj"} />
            <Obj light={true} color={"#ff4800"} position={new THREE.Vector3(-6, 0, -6 * spaceBetweenGravestones * 1.2)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_N.obj"} />
            <Obj light={true} color={"#0099ff"} position={new THREE.Vector3(0, 0, -6 * spaceBetweenGravestones * 1.2)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_O.obj"} />

            <Obj light={true} color={"#c800ff"} position={new THREE.Vector3(6, 0, -7 * spaceBetweenGravestones * 1.4)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_P.obj"} />
            <Obj light={true} color={"#f1ff2b"} position={new THREE.Vector3(-6, 0, -7 * spaceBetweenGravestones * 1.4)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_R.obj"} />
            <Obj light={true} color={"#c800ff"} position={new THREE.Vector3(0, 0, -7 * spaceBetweenGravestones * 1.4)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_S.obj"} />

            <mesh
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHoverColumn(2)
                }}
                onPointerOut={() => setHoverColumn(-1)}
                onClick={() => { }}
                position={new THREE.Vector3(-6, 0, -30)}>
                <boxGeometry args={[5, 1, 80]} />
                <meshPhongMaterial color={"black"} opacity={0.1} transparent />
            </mesh>

            <mesh
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHoverColumn(1)
                }}
                onPointerOut={() => setHoverColumn(-1)}
                onClick={() => { }}
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
                onClick={() => { }}
                position={new THREE.Vector3(6, 0, -30)}>
                <boxGeometry args={[5, 1, 80]} />
                <meshPhongMaterial color={"black"} opacity={0.1} transparent />
            </mesh>

            <SelectableObj light={hoverColumn == 0} color={"#c800ff"} position={new THREE.Vector3(6, 0, 7)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./arrow_A.obj"} />
            <SelectableObj light={hoverColumn == 1} color={"#c800ff"} position={new THREE.Vector3(0, 0, 7)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./arrow_B.obj"} />
            <SelectableObj light={hoverColumn == 2} color={"#c800ff"} position={new THREE.Vector3(-6, 0, 7)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./arrow_C.obj"} />


            <axesHelper />
            <PerspectiveCamera
                makeDefault
                position={[0 + ((mouseCords.width / size.width) * 2 - 1) * 3, 23 + ((mouseCords.height / size.height) * 2 - 1) * 3, 25]}
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
