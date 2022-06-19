import React from 'react';
import {Link} from 'react-router-dom'
import ApplicationHelmet from '../components/ApplicationHelmet/ApplicationHelmet';
import { BsAppIndicator } from 'react-icons/bs';
import { FaRestroom } from 'react-icons/fa';
import { BiRestaurant } from 'react-icons/bi';
import { GiHealingShield } from 'react-icons/gi';

const Dashboard = () => {
	return (
		<div className="dashboard py-4">
			<ApplicationHelmet title="Insignia POS | Dashboard" description="" />
			<h2 className="display-5 mb-3">Sales Summary</h2>
			<div className="row">
				<div className="col-xl-10 col-xxl-12">
					<div className="row">
						<div className="col-xl-3 col-xxl-2 col-sm-6 mb-4">
							<Link to={'/'} className="dashboard-widget text-light text-decoration-none h-100 p-3 py-4 rounded bg-success bg-gradient d-flex gap-3 align-items-center">
								<div className="icon flex-shrink-0">
									<FaRestroom size={'3rem'} />
								</div>
								<div className="content flex-grow-1">
									<h3 className="fs-4 fw-semi-bold font-monospace mb-1">Room</h3>
									<h3 className="fs-4 font-monospace">200</h3>
								</div>
							</Link>
						</div>
						<div className="col-xl-3 col-xxl-2 col-sm-6 mb-4">
							<Link to={'/restaurant'} className="dashboard-widget text-light text-decoration-none h-100 p-3 py-4 rounded bg-dark bg-gradient d-flex gap-3 align-items-center">
								<div className="icon flex-shrink-0">
									<BiRestaurant size={'3rem'} />
								</div>
								<div className="content flex-grow-1">
									<h3 className="fs-4 fw-semi-bold font-monospace mb-1">Restaurant</h3>
									<h3 className="fs-4 font-monospace">64168</h3>
								</div>
							</Link>
						</div>
						<div className="col-xl-3 col-xxl-2 col-sm-6 mb-4">
							<Link to={'/'} className="dashboard-widget text-light text-decoration-none h-100 p-3 py-4 rounded bg-primary bg-gradient d-flex gap-3 align-items-center">
								<div className="icon flex-shrink-0">
									<GiHealingShield size={'3rem'} />
								</div>
								<div className="content flex-grow-1">
									<h3 className="fs-4 fw-semi-bold font-monospace mb-1">Health Care</h3>
									<h3 className="fs-4 font-monospace">64168</h3>
								</div>
							</Link>
						</div>
						<div className="col-xl-3 col-xxl-2 col-sm-6 mb-4">
							<Link to={'/'} className="dashboard-widget text-light text-decoration-none h-100 p-3 py-4 rounded bg-warning bg-gradient d-flex gap-3 align-items-center">
								<div className="icon flex-shrink-0">
									<BsAppIndicator size={'3rem'} />
								</div>
								<div className="content flex-grow-1">
									<h3 className="fs-4 fw-semi-bold font-monospace mb-1">Banquet</h3>
									<h3 className="fs-4 font-monospace">64168</h3>
								</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
