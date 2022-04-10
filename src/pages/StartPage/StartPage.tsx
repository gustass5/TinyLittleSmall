import { Canvas } from '@react-three/fiber';
import { SceneContext } from '../../utils/SceneContext';
import { World } from '../WorldPage/World';
import * as THREE from 'three';
import { WORLD_COUNT } from '../../App';

export function StartPage({
	changeCurrentPage,
	startNewGame,
	availableWorldCount
}: {
	changeCurrentPage: (destination: string) => void;
	startNewGame: () => void;
	availableWorldCount: number;
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
					<div>
						<div
							className="text-center py-6 bg-gray-100 cursor-pointer text-3xl bg-orange-400 shadow text-orange-900 rounded-md hover:bg-orange-300 transition ease-in-out duration-100"
							onClick={() => changeCurrentPage('map')}
						>
							{availableWorldCount === 0 ? 'Start' : 'Continue'}
						</div>
						{availableWorldCount === WORLD_COUNT && (
							<div className="text-orange-600 p-4">
								You successfully finished the demo! <br />
								Thank you for playing Tiny Worlds. <br />
								You can continue and see your worlds again or start a
								new game. <br />
								(Warning: After starting new game, all your existing
								worlds will be deleted and new worlds will be generated
								in their place)
							</div>
						)}
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
