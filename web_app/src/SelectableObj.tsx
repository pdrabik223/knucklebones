import { useLoader, useFrame } from '@react-three/fiber';
import * as React from 'react';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/Addons.js';
import { useNeonMaterial } from './GameRender';

export interface SelectableObjRef {
    position: THREE.Vector3,
    scale: THREE.Vector3,
    path: string,
    color: string;
    light: boolean;
}

export function SelectableObj(props: SelectableObjRef) {

    const neonMaterial = useNeonMaterial({ color: props.light ? props.color : "#000000", intensity: props.light ? 2 : 0});

    const meshesRef = useRef<THREE.Mesh[]>([]);
    const phaseOffsetRef = useRef<number>(Math.random() * Math.PI * 2);

    const [lightUpAnimationCounter, setLightUpAnimationCounter] = useState(0);

    const obj = useLoader(OBJLoader, props.path) as THREE.Group;

    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);

    React.useEffect(() => {
        meshesRef.current = [];
        obj.traverse((child) => {

            if ((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).material = neonMaterial;
                meshesRef.current.push(child as THREE.Mesh);
            }
        });
    }, [obj, neonMaterial]);


    useFrame(({ clock }) => {
        if (!props.light && lightUpAnimationCounter > 200) return;
        let flashIntensity = 4
        let color = "#ffffff"
        if (!hovered) {
            const time = clock.getElapsedTime() + phaseOffsetRef.current;
            flashIntensity = 3 + 2 * Math.sin(time * 3) * Math.sin(time * 1.3);

        }

        meshesRef.current.forEach((mesh) => {
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
                mesh.material.emissiveIntensity = Math.max(0.5, flashIntensity);
                mesh.material.color = new THREE.Color(color);
            }
        });
    });

    useFrame(({ clock }) => {
        if (lightUpAnimationCounter > 200) return;

        const time = clock.getElapsedTime();
        const flashIntensity = 4 * Math.sin(time * 6.2) * Math.sin(time * 3.1) * Math.sin(time * 4.12);

        meshesRef.current.forEach((mesh) => {
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
                mesh.material.emissiveIntensity = flashIntensity;
            }
        });
        setLightUpAnimationCounter(lightUpAnimationCounter + 1);
    });


    return (
        <>
            <primitive
                onClick={() => setActive(!active)}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                object={obj}
                position={props.position}
                scale={props.scale} />
        </>
    );

}
