import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { BiRestaurant } from 'react-icons/bi';
import { FaRegKeyboard } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import AuthLibrary from '../../libraries/AuthLibrary';
import insignia from '../../assets/img/insignia-text.png';
const _ = require('lodash');



const popover = (
	<Popover style={{ maxWidth: '400px', width: '100%' }} id="popover-basic">
		<Popover.Header as="h3">Keyboard Shortcut</Popover.Header>
		<Popover.Body className="pt-2 pb-0 px-2">
			<table className="table table-sm">
				<thead>
					<tr>
						<th className="bg-light text-dark" scope="col">
							Operations
						</th>
						<th className="bg-light text-dark" scope="col">
							Shortcut
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Category Search</td>
						<td>Shift+c</td>
					</tr>
					<tr>
						<td>Product Search</td>
						<td>Shift+p</td>
					</tr>
				</tbody>
			</table>
		</Popover.Body>
	</Popover>
);

const Header = () => {
	/**
	 * @method {useDispatch}
	 * To change the global redux store
	 */
	const dispatch = useDispatch();

	/**
	 * @method {useSelector}
	 * @param  {} => reduxStore
	 * To get the global redux store
	 */
	const loggedUser = useSelector((reduxStore) => reduxStore?.userReducer?.user);

	console.log(loggedUser);

	return (
		<div id="header" className="border-bottom d-flex flex-wrap align-items-center justify-content-between gap-2 py-2">
			<Link to={'/'} className="logo">
				<img src={insignia} alt="logo" className="img-fluid" style={{ maxWidth: '150px' }} />
			</Link>
			<div className="header-right d-flex flex-wrap align-items-center">
				<OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
					<Button className="btn btn-light text-dark bg-transparent p-1 btn-sm px-2 me-2 me-sm-2">
						<FaRegKeyboard size={'2rem'} />
					</Button>
				</OverlayTrigger>
				<Link to={'/current-orders'} className="btn btn-info text-light bg-gradient btn-sm px-2 me-2 me-sm-4">
					<BiRestaurant size={'1.2rem'} />
					<span className="ps-2">Current Orders</span>
				</Link>
				<Dropdown>
					<Dropdown.Toggle className="btn bg-transparent text-dark border-0 p-0">
						{!_.isNull(loggedUser?.avatar) && (
							<img
								src={loggedUser?.avatar}
								alt="img"
								className="img-fluid rounded-circle border me-2"
								style={{ width: '28px', height: '28px', objectFit: 'cover', objectPosition: 'center' }}
							/>
						)}

						{loggedUser?.name}
					</Dropdown.Toggle>
					<Dropdown.Menu className="w-100">
						<Dropdown.Item
							as={Button}
							onClick={() => {
								AuthLibrary.logout();
								dispatch({ type: 'REMOVE_ALL_INVOICE_DATA' });
							}}
						>
							Logout
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
		</div>
	);
};

export default Header;
