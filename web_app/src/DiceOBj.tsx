import { useLoader, useFrame } from '@react-three/fiber';
import * as React from 'react';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/Addons.js';

import { useNeonMaterial } from './useNeonMaterial';
import { ColorsMap } from './ColorsMap';

export interface DiceObjRef {
    position: THREE.Vector3,
    light: boolean;
}
export function abs(value: number) {
    return value < 0 ? -value : value

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
    ];

    const diceFaces: THREE.Group<THREE.Object3DEventMap>[] = [
        (useLoader(OBJLoader, "./dice_1.obj") as THREE.Group),
        (useLoader(OBJLoader, "./dice_2.obj") as THREE.Group),
        (useLoader(OBJLoader, "./dice_3.obj") as THREE.Group),
        (useLoader(OBJLoader, "./dice_4.obj") as THREE.Group),
        (useLoader(OBJLoader, "./dice_5.obj") as THREE.Group),
        (useLoader(OBJLoader, "./dice_6.obj") as THREE.Group),
    ];
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

    const [rotationVector, setRotationVector] = useState(new THREE.Vector3(0, 0, 0));
    const [criticalSpeedReached, setCriticalSpeedReached] = useState(false);
    const [randomValue, setRandomValue] = useState(0);

    useFrame(({ clock }) => {

        if (pressed) {
            rotationVector.x += 0.001;
            rotationVector.y += 0.002;
            rotationVector.z += 0.003;
        } else {
            rotationVector.x -= 0.001;
            rotationVector.y -= 0.001;
            rotationVector.z -= 0.001;
        }

        if (rotationVector.x < 0) rotationVector.x = 0;
        if (rotationVector.y < 0) rotationVector.y = 0;
        if (rotationVector.z < 0) rotationVector.z = 0;

        if (rotationVector.x > 0.2) rotationVector.x = 0.2;
        if (rotationVector.y > 0.3) rotationVector.y = 0.3;
        if (rotationVector.z > 0.4) rotationVector.z = 0.4;


        if (rotationVector.x == 0.2 && rotationVector.y == 0.3 && rotationVector.z == 0.4) {
            setCriticalSpeedReached(true);
        }

        if (rotationVector.x == 0 && rotationVector.y == 0 && rotationVector.z == 0) {

            let offsetX = (diceFaces[0].rotation.x % (Math.PI / 2));
            let offsetY = (diceFaces[0].rotation.y % (Math.PI / 2));
            let offsetZ = (diceFaces[0].rotation.z % (Math.PI / 2));

            if (abs(offsetX) < Math.PI / 20 && abs(offsetZ) < Math.PI / 20) {
                let posX = (4 + Math.floor(diceFaces[0].rotation.x / (Math.PI / 4))) % 4;
                let posY = (4 + Math.floor(diceFaces[0].rotation.y / (Math.PI / 4))) % 4;
                let posZ = (4 + Math.floor(diceFaces[0].rotation.z / (Math.PI / 4))) % 4;
                console.log(posX, posY, posZ);
                return;
            }

            for (let face of diceFaces) {
                face.rotateX(-(offsetX / 200));
                // face.rotateY( - (offsetY / 200))
                face.rotateZ(-(offsetZ / 200));
            }

        } else {
            for (let face of diceFaces) {
                face.rotateX(rotationVector.x);
                face.rotateY(rotationVector.y);
                face.rotateZ(rotationVector.z);
            }
        }


    });
    useFrame(({ clock }) => {
        if (!startAnimationDone) return;
        let flashIntensity = 0;
        let color = "#ffffff";


        meshesRef.current.forEach((mesh) => {
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
                mesh.material.emissiveIntensity = Math.max(0.5, flashIntensity);
                mesh.material.color = new THREE.Color(color);
            }
        });
    });

    useFrame(({ clock }) => {
        if (startAnimationDone) return;
        if (lightUpAnimationCounter == 200) {
            setStartAnimationDone(true);
            setLightUpAnimationCounter(0);
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


    const [pressed, setPressed] = useState(false);

    return (
        <>
            <mesh
                onPointerOver={(e) => {

                    e.stopPropagation();
                }}
                onPointerOut={() => { setPressed(false); }}
                onPointerDown={() => { setPressed(true); }}
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
