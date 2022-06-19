import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { GoHome } from 'react-icons/go';
import { AiOutlineLogout } from 'react-icons/ai';
import { BiRestaurant } from 'react-icons/bi';
import { BsAppIndicator } from 'react-icons/bs';
import { GiHealingShield } from 'react-icons/gi';
import user from '../../assets/img/user-2.jpg';
import insignia from '../../assets/img/insignia.png';

const Sidebar = () => {
	return (
		<>
			<div className={`sidebar bg-dark p-4 position-sticky top-0 vh-100`}>
				<div className="logo mb-3">
					<img src={insignia} alt="logo" className="img-fluid" style={{ maxWidth: '125px' }} />
				</div>
				<ul className="navbar-nav">
					<li className="nav-item my-1">
						<NavLink to="/" className="nav-link fs-5 d-flex align-items-center text-light">
							<GoHome className="me-2" size="1.2rem" /> Dashboard
						</NavLink>
					</li>
					<li className="nav-item my-1">
						<NavLink to="/restaurant" className="nav-link fs-5 d-flex align-items-center text-light">
							<BiRestaurant className="me-2" size="1.2rem" /> Restaurant
						</NavLink>
					</li>
					<li className="nav-item my-1">
						<NavLink to="/" className="nav-link fs-5 d-flex align-items-center text-light">
							<GiHealingShield className="me-2" size="1.2rem" /> Health Care
						</NavLink>
					</li>
					<li className="nav-item my-1">
						<NavLink to="/" className="nav-link fs-5 d-flex align-items-center text-light">
							<BsAppIndicator className="me-2" size="1.2rem" /> Banquet
						</NavLink>
					</li>
					<li className="nav-item my-1 pt-3 mt-3 border-top">
						<NavLink to="//" className="nav-link fs-6 mb-2 py-0 text-muted">
							<img
								src={user}
								alt="img"
								className="img-fluid rounded-circle border me-2"
								style={{ width: '28px', height: '28px', objectFit: 'cover', objectPosition: 'center' }}
							/>
							Kawsar Bin Siraj
						</NavLink>
					</li>
					<li className="nav-item my-0">
						<NavLink to="//" className="nav-link fs-6 py-0 text-muted">
							<AiOutlineLogout className="me-2" size="1.2rem" /> Log Out
						</NavLink>
					</li>
				</ul>
			</div>
		</>
	);
};

export default Sidebar;
