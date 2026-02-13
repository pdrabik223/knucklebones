import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

import { useRef, useState, type JSX } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import * as React from 'react'
import { Canvas } from '@react-three/fiber';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
// import statueUrl from '../public/gravestones.obj'


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





const loader = new OBJLoader();


const loadOBJ = async () => {
    let result = loader.loadAsync('/gravestones.obj')
    return result
}

const assets = new Map<String, THREE.Group<THREE.Object3DEventMap>>();

assets.set("one", await loadOBJ())
assets.set("two", await loadOBJ())

export interface ObRef {
    position: THREE.Vector3,
    scale: THREE.Vector3,
    path: string
}

export function Obj(props: ObRef) {
    // This reference will give us direct access to the THREE.Mesh object
    // Hold state for hovered and clicked events
    // const [obj, setObj] = useState<THREE.Group<THREE.Object3DEventMap> | null>(null)
    const [clicked, click] = useState(false)
    const [hover, onHover] = useState(false)

    const obj = useLoader(OBJLoader, props.path) as THREE.Group

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

    return <div ref={ref}><Canvas style={{ backgroundColor: "#3c5fdd", height: size.height + "px", width: size.width + "px" }}>

        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-20, -20, -20]} />

        <Obj position={new THREE.Vector3(6, 0, 0)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_A.obj"} />
        <Obj position={new THREE.Vector3(-6, 0, 0)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_B.obj"} />
        <Obj position={new THREE.Vector3(0, 0, 0)} scale={new THREE.Vector3(0.5, 0.5, 0.5)} path={"./gravestone_C.obj"} />

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
    </Canvas>
    </div>;

};
