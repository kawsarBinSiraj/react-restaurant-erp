import React from 'react';
import ApplicationHelmet from '../components/ApplicationHelmet/ApplicationHelmet';

const Dashboard = () => {
	return (
		<div className="dashboard py-4">
			<ApplicationHelmet title="Insignia POS | Room" description="" />
			<h2 className="display-5 mb-3">Room</h2>
			<form action="#">
				<div className="row">
					<div className="col-lg-3">
						<div className="form-group mb-3">
							<label htmlFor="#" className="form-label fs-6">
								Room number
							</label>
							<select className="form-select" aria-label="Default select example">
								<option defaultValue>
									-- Select --
								</option>
								<option value="1">11111111111</option>
								<option value="2">22222222222</option>
								<option value="3">33333333333</option>
							</select>
						</div>
					</div>
					<div className="col-lg-3">
						<div className="form-group mb-3">
							<label htmlFor="#" className="form-label fs-6">
								Room Type
							</label>
							<select className="form-select" aria-label="Default select example">
								<option defaultValue>
									-- Select --
								</option>
								<option value="1">Econo</option>
								<option value="2">Business</option>
							</select>
						</div>
					</div>
					<div className="col-lg-3">
						<div className="form-group mb-3">
							<label htmlFor="#" className="form-label fs-6">
								Per Night Price
							</label>
							<input className="form-control" type="text" value={''} placeholder="NULL" disabled />
						</div>
					</div>
					<div className="col-lg-3">
						<div className="form-group mb-3">
							<label htmlFor="#" className="form-label fs-6">
								Date Arrival
							</label>
							<input className="form-control" type="text" placeholder="Select Date" />
						</div>
					</div>
					<div className="col-lg-3">
						<div className="form-group mb-3">
							<label htmlFor="#" className="form-label fs-6">
								Book Night
							</label>
							<input className="form-control" type="number" placeholder="Book Night" />
						</div>
					</div>
					<div className="col-lg-3">
						<div className="form-group mb-3">
							<label htmlFor="#" className="form-label fs-6">
								Departure
							</label>
							<input className="form-control" type="text" placeholder="Departure Date" disabled />
						</div>
					</div>
					<div className="col-lg-3">
						<div className="form-group mb-3">
							<label htmlFor="#" className="form-label fs-6">
								Total
							</label>
							<input className="form-control" type="text" placeholder="Total" />
						</div>
					</div>
					<div className="col-lg-3">
						<div className="form-group mb-3">
							<label htmlFor="#" className="form-label fs-6">
								Discount
							</label>
							<input className="form-control" type="number" placeholder="Discount" />
						</div>
					</div>
					<div className="col-lg-3">
						<div className="form-group mb-3">
							<label htmlFor="#" className="form-label fs-6">
								Advance
							</label>
							<input className="form-control" type="number" placeholder="Advance" />
						</div>
					</div>
					<div className="col-lg-3">
						<div className="form-group mb-3">
							<label htmlFor="#" className="form-label fs-6">
								Out Standings
							</label>
							<input className="form-control" type="number" placeholder="Out Standings" disabled />
						</div>
					</div>
					<div className="col-lg-3">
						<div className="form-group mb-3">
							<label htmlFor="#" className="form-label fs-6">
								Paid
							</label>
							<input className="form-control" type="number" placeholder="Amount" />
						</div>
					</div>
				</div>
				<div className="form-group">
					<button type="submit" className="btn btn-primary px-3 bg-gradient">
						Submit
					</button>
				</div>
			</form>
		</div>
	);
};

export default Dashboard;
