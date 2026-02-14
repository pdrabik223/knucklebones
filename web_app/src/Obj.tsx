import { useLoader, useFrame } from '@react-three/fiber';
import * as React from 'react';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/Addons.js';
import { useNeonMaterial } from './GameRender';

export interface ObRef {
    position: THREE.Vector3,
    scale: THREE.Vector3,
    path: string,
    color: string;
    light: boolean;
}

export function Obj(props: ObRef) {

    const neonMaterial = useNeonMaterial({ color: props.light ? props.color : "#000000", intensity: props.light ? 2 : 0 });
    const meshesRef = useRef<THREE.Mesh[]>([]);
    const phaseOffsetRef = useRef<number>(Math.random() * Math.PI * 2);

    const [lightUpAnimationCounter, setLightUpAnimationCounter] = useState(0);

    const [loaded, setLoaded] = useState(false);
    const obj = useLoader(OBJLoader, props.path) as THREE.Group;


    React.useEffect(() => {
        if (loaded) return;
        const minRotation = -(Math.PI / 20);
        const maxRotation = (Math.PI / 20);
        obj.rotateY(minRotation + Math.random() * (maxRotation - minRotation));
        obj.rotateX(minRotation + Math.random() * (maxRotation - minRotation));
        setLoaded(true);
    });


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


        const time = clock.getElapsedTime() + phaseOffsetRef.current;

        const flashIntensity = 3 + 2 * Math.sin(time * 3) * Math.sin(time * 1.3);

        meshesRef.current.forEach((mesh) => {
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
                mesh.material.emissiveIntensity = Math.max(0.5, flashIntensity);
                mesh.material.color = new THREE.Color("#ffffff");
            }
        });
    });

    useFrame(({ clock }) => {
        if (!props.light || lightUpAnimationCounter > 200) return;

        const time = clock.getElapsedTime();
        const flashIntensity = 4 * Math.sin(time * 6.2) * Math.sin(time * 3.1) * Math.sin(time * 4.12);

        meshesRef.current.forEach((mesh) => {
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
                mesh.material.emissiveIntensity = flashIntensity;
                mesh.material.color = new THREE.Color("#ffffff");
            }
        });
        setLightUpAnimationCounter(lightUpAnimationCounter + 1);
    });
    return (
        <>
            <primitive
                object={obj}
                position={props.position}
                scale={props.scale} />
        </>
    );

}
