import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import 'tachyons';

const root = createRoot(document.getElementById('root'));

root.render(<App />)

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

