import { useEffect } from 'react';
import { useState } from 'react';
import { MapPage } from './pages/MapPage/MapPage';
import { WorldPage } from './pages/WorldPage/WorldPage';

const WORLD_COUNT = 6;
const SEED_LENGTH = 8;

interface IWorldData {
	seed: string;
}

function App() {
	const [currentPage, changeCurrentPage] = useState('world');
	const [worldsData, updateWorldsData] = useState<IWorldData[]>([]);

	useEffect(() => {
		const data = localStorage.getItem('TinyData');
		updateWorldsData(data === null ? generateWorldsData() : JSON.parse(data));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		console.log({ worldsData });
	}, [worldsData]);

	function generateWorldsData(): IWorldData[] {
		let worlds: IWorldData[] = [];
		for (let i = 0; i < WORLD_COUNT; i++) {
			const seed = generateSeed(SEED_LENGTH);
			worlds = [...worlds, { seed }];
		}
		localStorage.setItem('TinyData', JSON.stringify(worlds));
		return worlds;
	}

	function generateSeed(length: number): string {
		let result = '';
		let characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	if (worldsData.length === 0) {
		// [TODO]: Add component with loading animation
		return <div>LOADING...</div>;
	}

	return (
		<div className="h-screen">
			{currentPage === 'main' ? (
				<MapPage
					changeCurrentPage={destination => changeCurrentPage(destination)}
				/>
			) : (
				<WorldPage
					seed={worldsData[0].seed}
					changeCurrentPage={destination => changeCurrentPage(destination)}
				/>
			)}
		</div>
	);
}

export default App;
