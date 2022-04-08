import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
interface IWorld {
	changeCurrentPage: (destination: string) => void;
}

export function World({ changeCurrentPage }: IWorld) {
	const [envMap, setEnvMap] = useState<THREE.Texture>();

	const { gl } = useThree();

	useEffect(() => {
		const pmrem = new THREE.PMREMGenerator(gl);
		// [TODO]: Check if I should dispose any textures
		new RGBELoader()
			.setDataType(THREE.FloatType)
			.load('assets/envmap.hdr', dataTexture => {
				setEnvMap(pmrem.fromEquirectangular(dataTexture).texture);
			});
		console.log('Happens');
		// [NOTE]: No idea ar reikia inlcudint cia `gl`, also care, kad nesetintu every render
	}, [gl]);

	return (
		<mesh onClick={() => changeCurrentPage('main')}>
			<sphereGeometry args={[5, 10, 10]} />
			<meshStandardMaterial envMap={envMap} roughness={0} metalness={1} />
		</mesh>
	);
}
