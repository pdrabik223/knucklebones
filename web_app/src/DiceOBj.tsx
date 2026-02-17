import { useLoader, useFrame } from '@react-three/fiber';
import * as React from 'react';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/Addons.js';

import { useNeonMaterial } from './useNeonMaterial';
import { ColorsMap } from './ColorsMap';

export interface DiceObjRef {
    position: THREE.Vector3,
    light: boolean,
    diceValue: number | null,
    setDiceValue: (val: number) => void
}
export function abs(value: number) {
    return value < 0 ? -value : value

}

export function DiceOBj(props: DiceObjRef) {

    const meshesRef = useRef<THREE.Mesh[]>([]);

    const [lightUpAnimationCounter, setLightUpAnimationCounter] = useState(0);
    const [startAnimationDone, setStartAnimationDone] = useState(false);

    const neonMaterials = [
        useNeonMaterial({ color: ColorsMap[1], intensity: props.light ? 2 : 0 }),
        useNeonMaterial({ color: ColorsMap[2], intensity: props.light ? 2 : 0 }),
        useNeonMaterial({ color: ColorsMap[3], intensity: props.light ? 2 : 0 }),
        useNeonMaterial({ color: ColorsMap[4], intensity: props.light ? 2 : 0 }),
        useNeonMaterial({ color: ColorsMap[5], intensity: props.light ? 2 : 0 }),
        useNeonMaterial({ color: ColorsMap[6], intensity: props.light ? 2 : 0 }),
    ];

    const diceFaces: THREE.Group<THREE.Object3DEventMap>[] = [
        (useLoader(OBJLoader, "./dice_1.obj") as THREE.Group),
        (useLoader(OBJLoader, "./dice_2.obj") as THREE.Group),
        (useLoader(OBJLoader, "./dice_3.obj") as THREE.Group),
        (useLoader(OBJLoader, "./dice_4.obj") as THREE.Group),
        (useLoader(OBJLoader, "./dice_5.obj") as THREE.Group),
        (useLoader(OBJLoader, "./dice_6.obj") as THREE.Group),
    ];

    React.useEffect(() => {
        for (let face = 0; face < diceFaces.length; face++)

            diceFaces[face].traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    (child as THREE.Mesh).material = neonMaterials[props.diceValue == null ? face : props.diceValue - 1];
                    meshesRef.current.push(child as THREE.Mesh);
                }
            });

    }, [diceFaces]);

    const [rotationVector, setRotationVector] = useState(new THREE.Vector3(0, 0, 0));
    const [criticalSpeedReached, setCriticalSpeedReached] = useState(false);
    // const [randomValue, setRandomValue] = useState(0);

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

        if (rotationVector.x == 0 && rotationVector.y == 0 && rotationVector.z == 0)
            if (THREE.MathUtils.radToDeg(diceFaces[0].rotation.x) % 90 == 0 &&
                THREE.MathUtils.radToDeg(diceFaces[0].rotation.y) % 90 == 0 &&
                THREE.MathUtils.radToDeg(diceFaces[0].rotation.z) % 90 == 0) return

        if (rotationVector.x == 0.2 && rotationVector.y == 0.3 && rotationVector.z == 0.4) {
            setCriticalSpeedReached(true);
        }

        if (rotationVector.x == 0 && rotationVector.y == 0 && rotationVector.z == 0) {
            const snapAngle = 90;
            let x = THREE.MathUtils.radToDeg(diceFaces[0].rotation.x);
            let y = THREE.MathUtils.radToDeg(diceFaces[0].rotation.y);
            let z = THREE.MathUtils.radToDeg(diceFaces[0].rotation.z);

            x = Math.round(x / snapAngle) * snapAngle;
            y = Math.round(y / snapAngle) * snapAngle;
            z = Math.round(z / snapAngle) * snapAngle;

            for (let face of diceFaces) {
                face.rotation.set(
                    THREE.MathUtils.degToRad(x),
                    THREE.MathUtils.degToRad(y),
                    THREE.MathUtils.degToRad(z))
            }

            if (criticalSpeedReached && props.diceValue == null)
                props.setDiceValue(2 + 1)

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
        let flashIntensity = 2;
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
