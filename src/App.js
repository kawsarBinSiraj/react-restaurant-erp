import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes/Routes';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store, persistor } from './redux-store/Store';
import { PersistGate } from 'redux-persist/integration/react';
import Header from './components/Header/Header';
const axios = require('axios');

/**
 * Axios Global Config
 *
 * @type {string}
 */

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

function App() {
	return (
		<>
			<Provider store={store}>
				<BrowserRouter basename="/insignia-pos">
					<PersistGate loading={null} persistor={persistor}>
						<main id="main" className='px-xl-4 px-3 pt-2 pb-5'>
							<Header />
							<Routes />
						</main>
					</PersistGate>
					<ToastContainer />
				</BrowserRouter>
			</Provider>
		</>
	);
}

export default App;
