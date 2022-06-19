import React from 'react';
import { Navigate , Outlet } from 'react-router-dom';
import Cookies from 'cookies-js';
import _ from 'lodash';

const ProtectedRoute = ({ ...props }) => {
	const isAuth = !_.isNil(Cookies.get('access_token'));
	if (!isAuth) {
		return <Navigate to={'/login'} />;
	}
	return <Outlet />;
};

export default ProtectedRoute;
