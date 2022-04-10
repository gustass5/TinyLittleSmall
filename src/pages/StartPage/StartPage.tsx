import { Canvas } from '@react-three/fiber';
import { SceneContext } from '../../utils/SceneContext';
import { World } from '../WorldPage/World';
import * as THREE from 'three';

export function StartPage({
	changeCurrentPage,
	startNewGame,
	buttonText
}: {
	changeCurrentPage: (destination: string) => void;
	startNewGame: () => void;
	buttonText: string;
}) {
	return (
		<div className="h-screen flex items-center justify-center">
			<Canvas camera={{ fov: 45, position: [-17, 31, 33] }}>
				<SceneContext />
				<pointLight
					position={[10, 20, 10]}
					color={new THREE.Color('#FFCB8E').convertSRGBToLinear()}
					intensity={80}
					distance={200}
					castShadow={true}
				/>
				<World seed={Math.random().toString()} />
			</Canvas>
			<div className="flex flex-col px-10 h-full justify-center w-1/2 bg-orange-400/80 space-y-20">
				<header className="flex-1 flex items-end text-8xl text-orange-900">
					<span>
						TINY <br /> WORLDS
					</span>
				</header>
				<div className="flex-1 flex flex-col justify-between">
					<div
						className="text-center py-6 bg-gray-100 cursor-pointer text-3xl bg-orange-400 shadow text-orange-900 rounded-md hover:bg-orange-300 transition ease-in-out duration-100"
						onClick={() => changeCurrentPage('map')}
					>
						{buttonText}
					</div>

					<div
						className="text-center m-3 py-2 bg-gray-100 cursor-pointer border-2 bg-transparent border-orange-400 rounded-md text-orange-900 rounded hover:bg-orange-400 transition ease-in-out duration-100"
						onClick={() => {
							startNewGame();
						}}
					>
						Start New Game
					</div>
				</div>
			</div>
		</div>
	);
}
