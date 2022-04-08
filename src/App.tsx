import { useState } from 'react';
import { MapPage } from './pages/MapPage/MapPage';
import { WorldPage } from './pages/WorldPage/WorldPage';

function App() {
	const [currentPage, changeCurrentPage] = useState('world');

	return (
		<div className="h-screen">
			{currentPage === 'main' ? (
				<MapPage
					changeCurrentPage={destination => changeCurrentPage(destination)}
				/>
			) : (
				<WorldPage
					changeCurrentPage={destination => changeCurrentPage(destination)}
				/>
			)}
		</div>
	);
}

export default App;
