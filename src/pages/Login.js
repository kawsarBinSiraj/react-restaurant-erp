import React, { useEffect } from 'react';
import logo from '../assets/img/insignia.png';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import AuthLibrary from '../libraries/AuthLibrary';
import Cookies from 'cookies-js';
import _ from 'lodash';
import { Navigate } from 'react-router-dom';
const axios = require('axios');

const schema = yup
	.object({
		email: yup.string().required(),
		password: yup.string().required(),
	})
	.required();

const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	/**
	 * @method {useDispatch}
	 * To change the global redux store
	 */
	const dispatch = useDispatch();

	/**
	 * @method {onSubmit}
	 * desc {}
	 */
	const onSubmit = async (data) => {
		try {
			let response = await axios.post(`/user-login`, data);
			let { isUserAuthenticated } = response?.data?.data;
			if (isUserAuthenticated === true) {
				let {
					user,
					user: { remember_token },
					message,
				} = response?.data?.data;

				dispatch({ type: 'USER_LOGGED', payload: user });
				toast.success(message || 'Login Successfully ', {
					position: 'bottom-right',
					theme: 'colored',
				});
				setTimeout(() => {
					AuthLibrary.login(() => {
						AuthLibrary.setTokenToCookie(remember_token);
					});
				}, 1400);
			} else {
				let { message } = response?.data?.data;
				toast.error(message || 'Authentication Failed', {
					position: 'bottom-right',
					theme: 'colored',
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * @method {component will unmount}
	 * desc {}
	 */
	useEffect(() => {
		return () => toast.dismiss();
	}, []);

	/**
	 * @check {Redirect}
	 * desc {}
	 */
	if (!_.isNil(Cookies.get('access_token'))) {
		return <Navigate to={'/'} />;
	}

	return (
		<div className="login position-fixed top-0 start-0 w-100 h-100 bg-light d-flex align-items-center justify-content-center">
			<div className="form-sign-in text-center">
				<form onSubmit={handleSubmit(onSubmit)}>
					<img className="mb-4" src={logo} alt="" width="100" />
					<h1 className="h3 mb-3 fw-normal">Please sign in</h1>

					<div className="form-floating">
						<input type="email" {...register('email')} className="form-control" id="floatingInput" placeholder="name@example.com" />
						<label htmlFor="floatingInput">Email address</label>
					</div>
					<div className="form-floating">
						<input type="password" {...register('password')} className="form-control" id="floatingPassword" placeholder="Password" />
						<label htmlFor="floatingPassword">Password</label>
					</div>
					<div className="form-group mb-2">
						<p className="text-danger mb-0"> {errors.email?.message}</p>
						<p className="text-danger mb-0"> {errors.password?.message}</p>
					</div>
					<button className="w-100 btn btn-lg btn-primary" type="submit">
						Sign in
					</button>
					<p className="mt-5 mb-3 text-muted"> &copy; 2000 - {new Date().getFullYear()}</p>
				</form>
			</div>
		</div>
	);
};

export default Login;
