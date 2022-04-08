import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

export function SceneContext() {
	const { scene } = useThree();
	useEffect(() => {
		scene.background = new THREE.Color('#FFEECC');
	});
	return null;
}
