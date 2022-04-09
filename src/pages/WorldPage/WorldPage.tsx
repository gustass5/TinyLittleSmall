import { Canvas, useThree } from '@react-three/fiber';
import { SceneContext } from '../../utils/SceneContext';
import { World } from './World';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useEffect } from 'react';
import * as THREE from 'three';
interface IWorldPage {
	changeCurrentPage: (destination: string) => void;
}

export function WorldPage({ changeCurrentPage }: IWorldPage) {
	return (
		<Canvas camera={{ fov: 45, position: [-17, 31, 33] }}>
			<SceneContext />
			<pointLight
				position={[10, 20, 10]}
				color={new THREE.Color('#FFCB8E')
					.convertSRGBToLinear()
					.convertSRGBToLinear()}
				intensity={80}
				distance={200}
				castShadow={true}
			/>
			<World changeCurrentPage={destination => changeCurrentPage(destination)} />
			<CameraController />
		</Canvas>
	);
}

const CameraController = () => {
	const { camera, gl } = useThree();
	useEffect(() => {
		const controls = new OrbitControls(camera, gl.domElement);

		controls.minDistance = 3;
		controls.maxDistance = 50;
		controls.target.set(0, 0, 0);
		controls.dampingFactor = 0.05;
		controls.enableDamping = true;
		return () => {
			controls.dispose();
		};
	}, [camera, gl]);
	return null;
};
