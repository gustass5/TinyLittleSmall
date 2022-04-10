import { Canvas } from '@react-three/fiber';
import { IWorldData } from '../../App';

interface IMapPage {
	changeCurrentPage: (destination: string) => void;
	setCurrentWorld: (index: number) => void;
	worlds: IWorldData[];
	availableWorldCount: number;
}

export function MapPage({
	changeCurrentPage,
	worlds,
	setCurrentWorld,
	availableWorldCount
}: IMapPage) {
	function handleClick(index: number) {
		if (index > availableWorldCount) {
			return;
		}
		setCurrentWorld(index);
		changeCurrentPage('world');
	}

	return (
		<div className="h-screen flex flex-col">
			{worlds.map((world, index) => (
				<div
					key={index}
					className={`m-1 p-1 ${
						index <= availableWorldCount ? 'bg-blue-500' : 'bg-gray-500'
					}`}
					onClick={() => handleClick(index)}
				>
					WORLD: {index}
				</div>
			))}
		</div>
	);
}
