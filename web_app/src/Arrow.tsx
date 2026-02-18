
import * as THREE from 'three';

import { SelectableObj } from './SelectableObj';
import type { ThreeEvent } from '@react-three/fiber';

export interface ArrowRef {
    position: THREE.Vector3,
    path: string,
    color: THREE.Color;
    light: boolean;
    reverseDirection: boolean;
    enable: boolean;
    onHoverChange: (e: ThreeEvent<PointerEvent>, isHovering: boolean) => void;
    onClick: () => void;
}

export function Arrow(props: ArrowRef) {
    return <>
        <SelectableObj light={props.light} color={props.color} position={props.position} path={props.path}
            rotation={new THREE.Vector3(0, props.reverseDirection ? Math.PI : 0, 0)}
        />

        <mesh
            onPointerOver={props.enable ? (e) => props.onHoverChange(e, true) : undefined}
            onPointerOut={props.enable ? (e) => props.onHoverChange(e, false) : undefined}
            onClick={props.enable ? props.onClick : undefined}
            position={new THREE.Vector3(props.position.x, 0, -30)}>
            <boxGeometry args={[5, 1, 80]} />
            <meshPhongMaterial color={"black"} opacity={0} transparent />
        </mesh></>;
}
