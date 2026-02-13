import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

import { useRef, useState, type JSX } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import * as React from 'react'
import { Canvas } from '@react-three/fiber';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
// import statueUrl from '../public/gravestones.obj'
import { useMemo } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export function Box(props: JSX.IntrinsicElements['mesh']) {
    // This reference will give us direct access to the THREE.Mesh object
    const ref = useRef<THREE.Mesh>(null!)
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    // Rotate mesh every frame, this is outside of React without overhead
    useFrame((state, delta) => (ref.current.rotation.x += 0.01))

    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )

}




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
            color: new THREE.Color(color),
            emissive: new THREE.Color(color),
            emissiveIntensity: intensity,
            metalness: 0.2,
            roughness: 0.3,
        });

        return material;
    }, [color, intensity]);
}

export interface ObRef {
    position: THREE.Vector3,
    scale: THREE.Vector3,
    path: string,
    color: string;
}

export function Obj(props: ObRef) {
    // This reference will give us direct access to the THREE.Mesh object
    // Hold state for hovered and clicked events
    // const [obj, setObj] = useState<THREE.Group<THREE.Object3DEventMap> | null>(null)
    const [clicked, click] = useState(false)
    const [hover, onHover] = useState(false)

    const neonMaterial = useNeonMaterial({ color: props.color, intensity: 0.9 });

    const obj = useLoader(OBJLoader, props.path) as THREE.Group

    React.useEffect(() => {
        obj.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).material = neonMaterial;
            }
        });
    }, [obj, neonMaterial]);

    return (
        <primitive
            object={obj}
            onClick={() => click(!clicked)}
            onPointerOver={() => onHover(true)}
            onPointerOut={() => onHover(false)}
            position={props.position}
            scale={props.scale}


        />
    )

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

    return <div ref={ref}>
        <Canvas
            gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
            style={{ backgroundColor: "#101218ff", height: size.height + "px", width: size.width + "px" }}>

            {/* <ambientLight intensity={0.5} color={0xcccccc} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-20, -20, -100]} color={0xffffff} /> */}

            <Obj color={"#00ff37"} position={new THREE.Vector3(6, 0, 0)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_A.obj"} />
            <Obj color={"#f1ff2b"} position={new THREE.Vector3(-6, 0, 0)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_B.obj"} />
            <Obj color={"#0099ff"} position={new THREE.Vector3(0, 0, 0)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_C.obj"} />

            <axesHelper />
            <PerspectiveCamera
                makeDefault
                position={[0, 10, 25]}
                lookAt={[0, 0, 0]}
                fov={75}
                near={0.1}
                far={1000}
            />
            {/* <OrbitControls
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 20}
            maxDistance={8}
            minDistance={1}
            enablePan={false}
            target={[0, 1.5, 0]} /> */}
            <EffectComposer>
                <Bloom
                    intensity={0.2}
                    luminanceThreshold={0}
                    luminanceSmoothing={0.8}
                />
            </EffectComposer>
        </Canvas>
    </div>;

};
