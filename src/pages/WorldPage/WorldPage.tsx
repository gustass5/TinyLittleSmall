import { Canvas, useThree } from '@react-three/fiber';
import { SceneContext } from '../../utils/SceneContext';
import { World } from './World';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useEffect } from 'react';
import * as THREE from 'three';
import { UserInterface } from './components/UserInterface';
interface IWorldPage {
	seed: string;
	currentWorld: number;
	returnToMap: () => void;
}

export function WorldPage({ seed, currentWorld, returnToMap }: IWorldPage) {
	return (
		<>
			<UserInterface returnToMap={returnToMap} currentWorld={currentWorld} />
			<Canvas
				gl={canvas =>
					new THREE.WebGLRenderer({
						canvas,
						antialias: true,
						// [NOTE]: Might not be the most efficient solution
						preserveDrawingBuffer: true
					})
				}
				camera={{ fov: 45, position: [-17, 31, 33] }}
			>
				<SceneContext />
				<pointLight
					position={[10, 20, 10]}
					color={new THREE.Color('#FFCB8E').convertSRGBToLinear()}
					intensity={80}
					distance={200}
					castShadow={true}
				/>
				<World seed={seed} />
				<CameraController />
			</Canvas>
		</>
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
