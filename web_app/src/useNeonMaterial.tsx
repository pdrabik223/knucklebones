import { useMemo } from 'react';
import * as THREE from 'three';


export interface NeonMaterialProps {
    color?: THREE.Color;
    intensity?: number;
}

export function useNeonMaterial({
    color = new THREE.Color("#00ffff"), intensity = 5,
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
