import { Canvas } from '@react-three/fiber';

interface IMapPage {
	changeCurrentPage: (destination: string) => void;
}

export function MapPage({ changeCurrentPage }: IMapPage) {
	return (
		<Canvas>
			<ambientLight intensity={0.1} />
			<directionalLight color="red" position={[0, 0, 5]} />
			<mesh position={[1, 1, 1]} onClick={() => changeCurrentPage('world')}>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color="hotpink" />
			</mesh>
		</Canvas>
	);
}
