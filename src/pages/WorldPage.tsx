import { Canvas } from '@react-three/fiber';

interface IWorldPage {
	changeCurrentPage: (destination: string) => void;
}

export function WorldPage({ changeCurrentPage }: IWorldPage) {
	return (
		<Canvas>
			<ambientLight intensity={0.1} />
			<directionalLight color="red" position={[0, 0, 5]} />
			<mesh position={[1, 1, 1]} onClick={() => changeCurrentPage('main')}>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color="green" />
			</mesh>
		</Canvas>
	);
}
