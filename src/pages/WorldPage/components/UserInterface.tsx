import { useState } from 'react';
import { IWorldData } from '../../../App';

export function UserInterface({
	returnToMap,
	currentWorld
}: {
	currentWorld: number;
	returnToMap: () => void;
}) {
	const [currentPhoto, setCurrentPhoto] = useState('');

	function handlePhoto() {
		const canvas = document.querySelector('canvas');

		const dataURL = canvas?.toDataURL();
		const data = localStorage.getItem('TinyData');

		if (data !== null) {
			const newData: IWorldData[] = JSON.parse(data).reduce(
				(worldsData: IWorldData[], world: IWorldData, index: number) => {
					if (currentWorld === index) {
						return [...worldsData, { ...world, imageSet: true }];
					}

					return [...worldsData, world];
				},
				[]
			);
			localStorage.setItem('TinyData', JSON.stringify(newData));
		}
		if (dataURL !== undefined) {
			setCurrentPhoto(dataURL);
		}
	}

	function download() {
		const a = document.createElement('a'); //Create <a>
		a.href = currentPhoto; //Image Base64 Goes here
		a.download = `TinyWorld-${currentWorld}.png`; //File name Here
		a.click();
	}

	return (
		<div className="absolute w-full bottom-0 h-16 bg-black/10 z-10 flex justify-between items-center">
			<svg
				onClick={returnToMap}
				className="text-white mx-6 h-12 w-auto hover:text-red-400 transition ease-in-out duration-100 cursor-pointer "
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
			{currentPhoto === '' ? (
				<div className="h-10 w-20 border-2 border-dashed border-white text-xs text-center">
					World photograph
				</div>
			) : (
				<div className="flex h-10 w-auto">
					<img
						className="flex-1 border-2 border-dashed border-white"
						src={currentPhoto}
						alt="World photograph"
					/>
					<svg
						onClick={download}
						className="flex-1 text-white my-auto mx-2"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					>
						<path
							className="fill-current"
							d="M16 11h5l-9 10-9-10h5v-11h8v11zm1 11h-10v2h10v-2z"
						/>
					</svg>
				</div>
			)}
			<svg
				onClick={handlePhoto}
				className="text-white mx-6 h-12 w-auto hover:text-red-400 transition ease-in-out duration-100 cursor-pointer "
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path
					className="fill-current"
					d="M5 4h-3v-1h3v1zm10.93 0l.812 1.219c.743 1.115 1.987 1.781 3.328 1.781h1.93v13h-20v-13h3.93c1.341 0 2.585-.666 3.328-1.781l.812-1.219h5.86zm1.07-2h-8l-1.406 2.109c-.371.557-.995.891-1.664.891h-5.93v17h24v-17h-3.93c-.669 0-1.293-.334-1.664-.891l-1.406-2.109zm-11 8c0-.552-.447-1-1-1s-1 .448-1 1 .447 1 1 1 1-.448 1-1zm7 0c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z"
				/>
			</svg>
		</div>
	);
}
