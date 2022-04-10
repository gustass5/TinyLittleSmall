import { useState } from 'react';
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
	const [currentWorldCard, setCurrentWorldCard] = useState(availableWorldCount);

	function setCurrentCard(index: number) {
		if (index < 0 || index >= worlds.length) {
			return;
		}

		setCurrentWorldCard(index);
	}

	function handleClick(index: number) {
		if (index > availableWorldCount) {
			return;
		}
		setCurrentWorld(index);
		changeCurrentPage('world');
	}

	return (
		<main className="bg-orange-200 select-none">
			<div className="h-screen items-center justify-center max-w-7xl flex mx-auto py-6 sm:px-6 lg:px-8">
				<svg
					className="h-24 mx-6 w-auto cursor-pointer text-orange-400 hover:text-orange-600"
					onClick={() => setCurrentCard(currentWorldCard - 1)}
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
				>
					<path
						className="fill-current"
						d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"
					/>
				</svg>

				<div className="relative w-3/4 h-3/4">
					<div className="absolute top-[-100px] text-orange-900 w-full text-6xl text-center p-1 cursor-pointer hover:text-gray-500">
						World {currentWorldCard + 1}
					</div>
					<div className="h-full  h-full border-4 border-dashed border-orange-400 rounded-lg">
						<WorldCard
							handleClick={index => handleClick(index)}
							currentWorldCard={currentWorldCard}
							availableWorldCount={availableWorldCount}
						/>
					</div>
				</div>

				<svg
					className="h-24 mx-6 w-auto text-orange-400 cursor-pointer  hover:text-orange-500"
					onClick={() => setCurrentCard(currentWorldCard + 1)}
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
				>
					<path
						className="fill-current"
						d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"
					/>
				</svg>
			</div>
		</main>
	);
}

function WorldCard({
	currentWorldCard,
	availableWorldCount,
	handleClick
}: {
	currentWorldCard: number;
	availableWorldCount: number;
	handleClick: (index: number) => void;
}) {
	if (currentWorldCard === availableWorldCount) {
		return (
			<div
				className="flex h-full items-center justify-center text-6xl cursor-pointer hover:text-gray-500 bg-cover bg-center "
				style={{
					backgroundImage: 'url(/assets/placeholder.png)'
				}}
			>
				<div className="flex items-center justify-center rounded w-full h-full bg-black/50">
					<svg
						onClick={() => handleClick(currentWorldCard)}
						className="w-1/2 h-1/2  text-orange-100 hover:text-orange-300"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					>
						<path
							className="fill-current"
							d="M5 4h-3v-1h3v1zm8 6c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zm11-5v17h-24v-17h5.93c.669 0 1.293-.334 1.664-.891l1.406-2.109h8l1.406 2.109c.371.557.995.891 1.664.891h3.93zm-19 4c0-.552-.447-1-1-1s-1 .448-1 1 .447 1 1 1 1-.448 1-1zm13 4c0-2.761-2.239-5-5-5s-5 2.239-5 5 2.239 5 5 5 5-2.239 5-5z"
						/>
					</svg>
				</div>
			</div>
		);
	}

	return currentWorldCard > availableWorldCount ? (
		<div
			className="flex h-full items-center justify-center text-6xl cursor-pointer hover:text-gray-500 bg-cover bg-center "
			style={{
				backgroundImage: 'url(/assets/placeholder.png)'
			}}
		>
			<div className="flex items-center justify-center rounded w-full h-full bg-black/50">
				<svg
					className="text-black w-1/2 h-1/2"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
				>
					<path
						className="fill-current"
						d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10 0v-4c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-8z"
					/>
				</svg>
			</div>
		</div>
	) : (
		<div
			className="flex h-full justify-end p-4 text-6xl cursor-pointer hover:text-gray-500 bg-cover bg-center"
			style={{
				backgroundImage: 'url(/assets/placeholder.png)'
			}}
			onClick={() => handleClick(currentWorldCard)}
		>
			<svg
				className="text-green-500 w-32 h-32"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path
					className="fill-current"
					d="M23.334 11.96c-.713-.726-.872-1.829-.393-2.727.342-.64.366-1.401.064-2.062-.301-.66-.893-1.142-1.601-1.302-.991-.225-1.722-1.067-1.803-2.081-.059-.723-.451-1.378-1.062-1.77-.609-.393-1.367-.478-2.05-.229-.956.347-2.026.032-2.642-.776-.44-.576-1.124-.915-1.85-.915-.725 0-1.409.339-1.849.915-.613.809-1.683 1.124-2.639.777-.682-.248-1.44-.163-2.05.229-.61.392-1.003 1.047-1.061 1.77-.082 1.014-.812 1.857-1.803 2.081-.708.16-1.3.642-1.601 1.302s-.277 1.422.065 2.061c.479.897.32 2.001-.392 2.727-.509.517-.747 1.242-.644 1.96s.536 1.347 1.17 1.7c.888.495 1.352 1.51 1.144 2.505-.147.71.044 1.448.519 1.996.476.549 1.18.844 1.902.798 1.016-.063 1.953.54 2.317 1.489.259.678.82 1.195 1.517 1.399.695.204 1.447.072 2.031-.357.819-.603 1.936-.603 2.754 0 .584.43 1.336.562 2.031.357.697-.204 1.258-.722 1.518-1.399.363-.949 1.301-1.553 2.316-1.489.724.046 1.427-.249 1.902-.798.475-.548.667-1.286.519-1.996-.207-.995.256-2.01 1.145-2.505.633-.354 1.065-.982 1.169-1.7s-.135-1.443-.643-1.96zm-12.584 5.43l-4.5-4.364 1.857-1.857 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.642z"
				/>
			</svg>
		</div>
	);
}
