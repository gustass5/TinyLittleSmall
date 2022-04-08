import React from 'react';
import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');

if (root !== null) {
	createRoot(root).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
}
