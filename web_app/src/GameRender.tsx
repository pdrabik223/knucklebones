import { Environment, PerspectiveCamera, Stats } from '@react-three/drei';

import { useRef, useState } from 'react'
import * as THREE from 'three'
import * as React from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
// import statueUrl from '../public/gravestones.obj'
import { useMemo } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Obj } from './Obj';
import { SelectableObj } from './SelectableObj';
import { OBJLoader, type Vector } from 'three/examples/jsm/Addons.js';

function abs(value: number) {
    return value < 0 ? -value : value

}

export interface DiceObjRef {
    position: THREE.Vector3,
    light: boolean;
}

export function DiceOBj(props: DiceObjRef) {

    const neonMaterial = useNeonMaterial({ color: new THREE.Color("#FF0000"), intensity: props.light ? 2 : 0 });

    const meshesRef = useRef<THREE.Mesh[]>([]);
    const phaseOffsetRef = useRef<number>(Math.random() * Math.PI * 2);

    const [lightUpAnimationCounter, setLightUpAnimationCounter] = useState(0);
    const [startAnimationDone, setStartAnimationDone] = useState(false);

    const neonMaterials = [
        useNeonMaterial({ color: ColorsMap[1], intensity: props.light ? 1.5 : 0 }),
        useNeonMaterial({ color: ColorsMap[2], intensity: props.light ? 1.5 : 0 }),
        useNeonMaterial({ color: ColorsMap[3], intensity: props.light ? 1.5 : 0 }),
        useNeonMaterial({ color: ColorsMap[4], intensity: props.light ? 1.5 : 0 }),
        useNeonMaterial({ color: ColorsMap[5], intensity: props.light ? 1.5 : 0 }),
        useNeonMaterial({ color: ColorsMap[6], intensity: props.light ? 1.5 : 0 }),

    ]

    const diceFaces: THREE.Group<THREE.Object3DEventMap>[] = [
        (useLoader(OBJLoader, "./dice_1.obj") as THREE.Group),
        (useLoader(OBJLoader, "./dice_2.obj") as THREE.Group),
        (useLoader(OBJLoader, "./dice_3.obj") as THREE.Group),
        (useLoader(OBJLoader, "./dice_4.obj") as THREE.Group),
        (useLoader(OBJLoader, "./dice_5.obj") as THREE.Group),
        (useLoader(OBJLoader, "./dice_6.obj") as THREE.Group),
    ]
    // const dice = useLoader(OBJLoader, "./dice_1.obj") as THREE.Group

    React.useEffect(() => {
        for (let face = 0; face < diceFaces.length; face++)
            diceFaces[face].traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    (child as THREE.Mesh).material = neonMaterials[face];
                    meshesRef.current.push(child as THREE.Mesh);
                }
            });

    }, [diceFaces, neonMaterial]);

    const [rotationVector, setRotationVector] = useState(new THREE.Vector3(0, 0, 0))
    const [criticalSpeedReached, setCriticalSpeedReached] = useState(false)
    const [randomValue, setRandomValue] = useState(0)

    useFrame(({ clock }) => {

        if (pressed) {
            rotationVector.x += 0.001
            rotationVector.y += 0.002
            rotationVector.z += 0.003
        } else {
            rotationVector.x -= 0.001
            rotationVector.y -= 0.001
            rotationVector.z -= 0.001
        }

        if (rotationVector.x < 0) rotationVector.x = 0
        if (rotationVector.y < 0) rotationVector.y = 0
        if (rotationVector.z < 0) rotationVector.z = 0

        if (rotationVector.x > 0.2) rotationVector.x = 0.2
        if (rotationVector.y > 0.3) rotationVector.y = 0.3
        if (rotationVector.z > 0.4) rotationVector.z = 0.4


        if (rotationVector.x == 0.2 && rotationVector.y == 0.3 && rotationVector.z == 0.4) {
            setCriticalSpeedReached(true)
        }

        if (rotationVector.x == 0 && rotationVector.y == 0 && rotationVector.z == 0) {

            let offsetX = (diceFaces[0].rotation.x % (Math.PI / 2)) 
            let offsetY = (diceFaces[0].rotation.y % (Math.PI / 2)) 
            let offsetZ = (diceFaces[0].rotation.z % (Math.PI / 2)) 

            if (abs(offsetX) < Math.PI / 20 && abs(offsetZ) < Math.PI / 20) {
                let posX = (4 + Math.floor(diceFaces[0].rotation.x / (Math.PI / 4))) % 4
                let posY = (4 + Math.floor(diceFaces[0].rotation.y / (Math.PI / 4))) % 4
                let posZ = (4 + Math.floor(diceFaces[0].rotation.z / (Math.PI / 4))) % 4
                console.log(posX, posY, posZ)
                return
            }

            for (let face of diceFaces) {
                face.rotateX( - (offsetX / 200))
                // face.rotateY( - (offsetY / 200))
                face.rotateZ( - (offsetZ / 200))
            }

        } else {
            for (let face of diceFaces) {
                face.rotateX(rotationVector.x)
                face.rotateY(rotationVector.y)
                face.rotateZ(rotationVector.z)
            }
        }


    });
    useFrame(({ clock }) => {
        if (!startAnimationDone) return;
        let flashIntensity = 0
        let color = "#ffffff"


        meshesRef.current.forEach((mesh) => {
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
                mesh.material.emissiveIntensity = Math.max(0.5, flashIntensity);
                mesh.material.color = new THREE.Color(color);
            }
        });
    });

    useFrame(({ clock }) => {
        if (startAnimationDone) return
        if (lightUpAnimationCounter == 200) {
            setStartAnimationDone(true)
            setLightUpAnimationCounter(0)
        }
        else setLightUpAnimationCounter(lightUpAnimationCounter + 1);

        const time = clock.getElapsedTime();
        const flashIntensity = 4 * Math.sin(time * 6.2) * Math.sin(time * 3.1) * Math.sin(time * 4.12);

        meshesRef.current.forEach((mesh) => {
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
                mesh.material.emissiveIntensity = flashIntensity;
            }
        });
    });


    const [pressed, setPressed] = useState(false)

    return (
        <>
            <mesh
                onPointerOver={(e) => {

                    e.stopPropagation()
                }}
                onPointerOut={() => { setPressed(false) }}
                onPointerDown={() => { setPressed(true) }}
                onPointerUp={() => setPressed(false)}
                position={props.position}>
                <boxGeometry args={[3, 3, 3]} />
                <meshPhongMaterial color={"black"} opacity={0.0} transparent />
            </mesh>

            <primitive
                object={diceFaces[0]}
                position={props.position}
                scale={[0.5, 0.5, 0.5]} />
            <primitive
                object={diceFaces[1]}
                position={props.position}
                scale={[0.5, 0.5, 0.5]} />
            <primitive
                object={diceFaces[2]}
                position={props.position}
                scale={[0.5, 0.5, 0.5]} />
            <primitive
                object={diceFaces[3]}
                position={props.position}
                scale={[0.5, 0.5, 0.5]} />
            <primitive
                object={diceFaces[4]}
                position={props.position}
                scale={[0.5, 0.5, 0.5]} />
            <primitive
                object={diceFaces[5]}
                position={props.position}
                scale={[0.5, 0.5, 0.5]} />
        </>
    );

}


interface NeonMaterialProps {
    color?: THREE.Color;
    intensity?: number;
}

export function useNeonMaterial({
    color = new THREE.Color("#00ffff"),
    intensity = 5,
}: NeonMaterialProps) {
    return useMemo(() => {
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#ffffff"),
            emissive: color,
            emissiveIntensity: intensity,
            metalness: 0.5,
            roughness: 0.4,
        });

        return material;
    }, [color, intensity]);
}

const ColorsMap: THREE.Color[] = [
    new THREE.Color("#000000"), // Disabled

    new THREE.Color("#00c8ff"),
    new THREE.Color("#0055ff"), // this one does not 
    new THREE.Color("#39FF14"),
    new THREE.Color("#FFFF33"),
    new THREE.Color("#FF5F1F"),

    new THREE.Color("#ff0000"),

    new THREE.Color("#ffffff"), // Enabled

]


export interface GameRenderRef {

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

    const ref = useRef<HTMLDivElement | null>(null);
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });
    const [mouseCords, setMouseCords] = useState<Size>({ width: 0, height: 0 });
    const [hoverColumn, setHoverColumn] = useState<number | null>(null)



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
    let i = 0;
    return <div ref={ref}>
        <Canvas
            shadows
            gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
            style={{ backgroundColor: "#101218ff", height: size.height + "px", width: size.width + "px" }}>

            <ambientLight intensity={0.5} color={0xcccccc} />
            {/* {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} /> */}
            {/* <pointLight position={[20, 20, 100]} color={0xffffff} /> */}

            <directionalLight position={[10, 20, 10]} color={"#cccccc"} castShadow={true} />



            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(6, hoverColumn == 0 ? 1 : 0, 0 * gravestoneOffset)} path={"./gravestone_A.obj"} />
            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(0, hoverColumn == 1 ? 1 : 0, 0 * gravestoneOffset)} path={"./gravestone_B.obj"} />
            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(-6, hoverColumn == 2 ? 1 : 0, 0 * gravestoneOffset)} path={"./gravestone_C.obj"} />

            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(6, hoverColumn == 0 ? 1 : 0, - 1 * gravestoneOffset)} path={"./gravestone_D.obj"} />
            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(0, hoverColumn == 1 ? 1 : 0, - 1 * gravestoneOffset)} path={"./gravestone_E.obj"} />
            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(-6, hoverColumn == 2 ? 1 : 0, - 1 * gravestoneOffset)} path={"./gravestone_F.obj"} />

            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(6, hoverColumn == 0 ? 1 : 0, -2 * gravestoneOffset)} path={"./gravestone_G.obj"} />
            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(0, hoverColumn == 1 ? 1 : 0, -2 * gravestoneOffset)} path={"./gravestone_H.obj"} />
            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(-6, hoverColumn == 2 ? 1 : 0, -2 * gravestoneOffset)} path={"./gravestone_I.obj"} />

            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(6, hoverColumn == 0 ? 1 : 0, -5 * gravestoneOffset)} path={"./gravestone_J.obj"} />
            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(0, hoverColumn == 1 ? 1 : 0, -5 * gravestoneOffset)} path={"./gravestone_K.obj"} />
            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(-6, hoverColumn == 2 ? 1 : 0, -5 * gravestoneOffset)} path={"./gravestone_L.obj"} />

            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(6, hoverColumn == 0 ? 1 : 0, -6 * gravestoneOffset * 1.2)} path={"./gravestone_M.obj"} />
            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(0, hoverColumn == 1 ? 1 : 0, -6 * gravestoneOffset * 1.2)} path={"./gravestone_N.obj"} />
            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(-6, hoverColumn == 2 ? 1 : 0, -6 * gravestoneOffset * 1.2)} path={"./gravestone_O.obj"} />

            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(6, hoverColumn == 0 ? 1 : 0, -7 * gravestoneOffset * 1.4)} path={"./gravestone_P.obj"} />
            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(0, hoverColumn == 1 ? 1 : 0, -7 * gravestoneOffset * 1.4)} path={"./gravestone_R.obj"} />
            <Obj light={true} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(-6, hoverColumn == 2 ? 1 : 0, -7 * gravestoneOffset * 1.4)} path={"./gravestone_S.obj"} />

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


            <SelectableObj light={hoverColumn == 0} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(6, 0, 7)} path={"./arrow_A.obj"} />
            <SelectableObj light={hoverColumn == 1} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(0, 0, 7)} path={"./arrow_B.obj"} />
            <SelectableObj light={hoverColumn == 2} color={ColorsMap[++i % ColorsMap.length]} position={new THREE.Vector3(-6, 0, 7)} path={"./arrow_C.obj"} />

            <DiceOBj light={hoverColumn == 2} position={new THREE.Vector3(12, 0, 5)} />
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
