import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { SceneContext } from '../../utils/SceneContext';
import { World } from './World';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useEffect } from 'react';

interface IWorldPage {
	changeCurrentPage: (destination: string) => void;
}

export function WorldPage({ changeCurrentPage }: IWorldPage) {
	return (
		<Canvas
			gl={{
				toneMapping: THREE.ACESFilmicToneMapping,
				outputEncoding: THREE.sRGBEncoding,
				physicallyCorrectLights: true
			}}
			// camera-position={[-17, 31, 33]}
			camera={{ fov: 45, position: [0, 0, 50] }}
		>
			<SceneContext />
			<ambientLight intensity={0.1} />
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
