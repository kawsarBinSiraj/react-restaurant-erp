import React from 'react';
import { Routes as PathWays, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// pages
import Dashboard from '../pages/Dashboard';
import CurrentOrders from '../pages/CurrentOrders';
import Restaurant from '../pages/Restaurant';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

const Routes = () => {
	return (
		<>
			<PathWays>
				<Route path="/" element={<ProtectedRoute  />}>
					<Route path="" element={<Dashboard />} />
				</Route>
				<Route path="/restaurant" element={<ProtectedRoute />}>
					<Route path="" element={<Restaurant />} />
				</Route>
				<Route path="/current-orders" element={<ProtectedRoute />}>
					<Route path="" element={<CurrentOrders />} />
				</Route>
				<Route path="/login" element={<Login />} />
				<Route path="*" element={<NotFound />} />
			</PathWays>
		</>
	);
};
export default Routes;
