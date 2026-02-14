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

export function createFresnelMaterial(color: string) {
    return new THREE.ShaderMaterial({
        uniforms: {
            uColor: { value: new THREE.Color(color) },
            uPower: { value: 1.5 },
            uIntensity: { value: 1.4 },
        },
        vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);

        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;

        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
        fragmentShader: `
      uniform vec3 uColor;
      uniform float uPower;
      uniform float uIntensity;

      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      void main() {
        vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
        float fresnel = pow(1.0 - dot(viewDirection, vNormal), uPower);
        float glow = fresnel * uIntensity;

        gl_FragColor = vec4(uColor * glow, glow);
      }
    `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
    });
}

interface NeonMeshProps {
    geometry: THREE.BufferGeometry;
    color?: string;
}

export function NeonMesh({ geometry, color = "#00ffff" }: NeonMeshProps) {
    const coreMaterial = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            emissive: new THREE.Color(color),
            emissiveIntensity: 8,
            roughness: 0.2,
            metalness: 0.3,
        });
    }, [color]);

    const fresnelMaterial = useMemo(() => {
        return createFresnelMaterial(color);
    }, [color]);

    return (
        <>
            {/* Core neon mesh */}
            <mesh geometry={geometry} material={coreMaterial} />

            {/* Slightly scaled glow shell */}
            <mesh
                geometry={geometry}
                material={fresnelMaterial}
                scale={1.05}
            />
        </>
    );
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

    const coreMaterial = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            color: new THREE.Color(props.color),
            emissive: new THREE.Color(props.color),
            emissiveIntensity: 4,
            roughness: 0.2,
            metalness: 0.3,
        });
    }, [props.color]);

    const fresnelMaterial = useMemo(() => {
        return createFresnelMaterial(props.color);
    }, [props.color]);

    const neonMaterial = useNeonMaterial({ color: props.color, intensity: 0.9 });

    const obj = useLoader(OBJLoader, props.path) as THREE.Group

    React.useEffect(() => {
        obj.traverse((child) => {

            if ((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).material = fresnelMaterial;
            }



        });
    }, [obj, coreMaterial]);

    return (
        <>
            <primitive
                object={obj}
                position={props.position}
                scale={props.scale}
            />
        </>
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
            {/* 
            <NeonMesh
                geometry={new THREE.TorusKnotGeometry(1, 0.3, 100, 16)}
                color="#ff00ff"
            /> */}

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
