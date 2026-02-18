import { useLoader, useFrame } from '@react-three/fiber';
import * as React from 'react';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/Addons.js';
import { useNeonMaterial } from './useNeonMaterial';

export interface SelectableObjRef {
    position: THREE.Vector3,
    path: string,
    color: THREE.Color;
    light: boolean;
    rotation?: THREE.Vector3,
}

export function SelectableObj(props: SelectableObjRef) {

    const neonMaterial = useNeonMaterial({ color: props.light ? props.color : new THREE.Color("#000000"), intensity: props.light ? 2 : 0 });

    const meshesRef = useRef<THREE.Mesh[]>([]);
    const phaseOffsetRef = useRef<number>(Math.random() * Math.PI * 2);

    const [lightUpAnimationCounter, setLightUpAnimationCounter] = useState(0);
    const [startAnimationDone, setStartAnimationDone] = useState(false);

    const obj = useLoader(OBJLoader, props.path) as THREE.Group;

    React.useEffect(() => {
        meshesRef.current = [];
        if (props.rotation != undefined)
            obj.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z)
        obj.traverse((child) => {

            if ((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).material = neonMaterial;
                meshesRef.current.push(child as THREE.Mesh);
            }
        });
    }, [obj, neonMaterial]);


    useFrame(({ clock }) => {
        if (!startAnimationDone) return;
        let flashIntensity = 4
        let color = "#ffffff"

        const time = clock.getElapsedTime() + phaseOffsetRef.current;
        flashIntensity = 3 + 2 * Math.sin(time * 3) * Math.sin(time * 1.3);

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



    return (
        <>
            <primitive
                object={obj}
                position={props.position}

                scale={[0.5, 0.5, 0.5]} />
        </>
    );

}
