import React, { useState, useEffect } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import { BiEditAlt } from 'react-icons/bi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import scannerBeepsSound from '../../assets/audio/shop-scanner-beeps.wav';
import useSound from 'use-sound';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import * as yup from 'yup';
const _ = require('lodash');
const axios = require('axios');

const schema = yup
	.object({
		first_name: yup.string().required(),
		last_name: yup.string().required(),
		email: yup.string().email('Must be a valid email').max(255).required(),
		cust_phone: yup.number().required(),
	})
	.required();

const InvoiceInfo = ({ getTotalInfo }) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});
	const [scannerBeepsSoundPlay] = useSound(scannerBeepsSound);
	const [isNewCustomerModalShow, setIsNewCustomerModalShow] = useState(false);
	const [customersByCustomerType, setCustomersByCustomerType] = useState([]);
	const [allTables, setAllTables] = useState([]);
	const [allWaiter, setAllWaiter] = useState([]);
	const [selectedCustomerType, setSelectedCustomerType] = useState();
	const [selectedCustomerName, setSelectedCustomerName] = useState();
	const [selectedTable, setSelectedTable] = useState();
	const [selectedWaiter, setSelectedWaiter] = useState();
	const [invoiceData, setInvoiceData] = useState([]);

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
	const invoiceInfoTableData = useSelector((reduxStore) => reduxStore?.InvoiceInfoTableReducer?.invoiceTableData);

	/**
	 * @method {componentDidUpdate by reduxStore}
	 * @param  {} => invoiceInfoTableData
	 * To get the invoiceInfoTableData
	 */
	useEffect(() => {
		setInvoiceData(invoiceInfoTableData);
	}, [invoiceInfoTableData]);

	/**
	 * @method {newCustomerFormOnSubmit}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const newCustomerFormOnSubmit = async (data) => {
		const formData = new FormData();
		Object.keys(data).forEach((key) => {
			formData.append(key, data[key]);
		});
		await axios({
			method: 'POST',
			url: '/employee/create',
			data: formData,
			headers: { 'Content-Type': 'multipart/form-data' },
		})
			.then((response) => {
				if (response) {
					setIsNewCustomerModalShow(() => {
						reset();
						setSelectedCustomerType('');
						setSelectedCustomerName('');
						toast.success('Successfully Walking Customer Created !', {
							position: 'bottom-right',
							theme: 'colored',
						});
						return false;
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	/**
	 * @method {onQuantityChange}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const onQuantityChange = (key, e) => {
		let qty = e?.target?.value;
		if (qty === '' || Number.parseInt(qty) === 0) return;
		let updateData = invoiceData.map((data) => {
			if (data.key === key) {
				return {
					...data,
					quantity: Number.parseInt(qty),
					totalDiscount: Number.parseInt(data?.perProductDiscount * qty),
					subTotalPrice: Number.parseInt(data?.price * qty + data?.totalAddonsPrice),
					amount: Number.parseInt(data?.totalAddonsPrice + (data?.price * qty - Number.parseInt(data?.perProductDiscount * qty))),
				};
			} else {
				return {
					...data,
				};
			}
		});
		dispatch({ type: 'UPGRADE_INVOICE_DATA', payload: updateData });
		scannerBeepsSoundPlay();
	};

	/**
	 * @method {calcTotalDiscount}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const calcTotalDiscount = () => {
		let totalDiscount = 0;
		invoiceData.forEach((data) => {
			totalDiscount += data.totalDiscount;
		});
		return totalDiscount;
	};

	/**
	 * @method {calcTotalAmount}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const calcTotalAmount = () => {
		let totalAmount = 0;
		invoiceData.forEach((data) => {
			totalAmount += data.amount;
		});
		const td = calcTotalDiscount();
		getTotalInfo(invoiceData, Number.parseInt(td), Number.parseInt(totalAmount), selectedCustomerType, selectedCustomerName, selectedWaiter, selectedTable);
	};

	/**
	 * @method {customerTypeOnChangeHandler}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const customerTypeOnChangeHandler = async (value) => {
		if (!_.isUndefined(value?.id) && !_.isUndefined(value?.apiKeyWord)) {
			let { id, apiKeyWord } = value;
			try {
				let response = await axios.get(`/employees/${apiKeyWord}/${id}`);
				let data = response?.data;
				if (!_.isUndefined(data)) {
					if (_.size(data) > 0) {
						let d = data.map((d) => {
							const { first_name, last_name } = d;
							return {
								...d,
								value: `${first_name} ${last_name}`,
								label: `${first_name} ${last_name}`,
							};
						});
						setCustomersByCustomerType(d);
					}
				}
			} catch (error) {
				console.log(error);
			}
		}
		setSelectedCustomerType(value);
		setSelectedCustomerName('');
	};

	/**
	 * @method {customerNameOnChangeHandler}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const customerNameOnChangeHandler = (value) => {
		!_.isUndefined(value) && setSelectedCustomerName(value);
	};

	/**
	 * @method {getAllTables}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const getAllTables = async () => {
		try {
			let response = await axios.get(`/tables`);
			let data = response?.data.map((d) => {
				return {
					...d,
					value: d.table_name,
					label: d.table_name,
				};
			});
			!_.isUndefined(data) && setAllTables(data);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * @method {getAllWaiter}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const getAllWaiter = async () => {
		try {
			let response = await axios.get(`/employee`);
			let data = response?.data.map((d) => {
				const { first_name, middle_name, last_name } = d;
				return {
					...d,
					value: `${first_name} ${middle_name} ${last_name}`,
					label: `${first_name} ${middle_name} ${last_name}`,
				};
			});
			!_.isUndefined(data) && setAllWaiter(data);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * @method - Remove Invoice Data
	 *
	 * @param {}
	 * @return {}
	 */
	const removeInvoiceData = (key) => {
		if (key) {
			dispatch({ type: 'REMOVE_INVOICE_DATA', payload: key });
			scannerBeepsSoundPlay();
		}
	};

	/**
	 * @method - {Making didUpdate depending invoiceData string}
	 *
	 * @param {}
	 * @return {}
	 */
	useEffect(() => {
		calcTotalAmount();
	}, [invoiceData, calcTotalAmount, selectedCustomerType]);

	/**
	 * @method  - {Making didMount}
	 *
	 * @param {}
	 * @return {}
	 */
	useEffect(() => {
		getAllTables();
		getAllWaiter();
	}, []);

	return (
		<>
			<div className="invoice-info">
				<div className="table-header d-flex align-items-center gap-2 mb-3">
					<div className="table-header-left flex-grow-1">
						<h5 className="mb-0 fs-5">Insignia Hotels and Resorts</h5>
					</div>
				</div>
				<div className="mb-4">
					<div className="row mb-2">
						<div className="col-xl-6">
							<div className="form-group mb-2">
								<label htmlFor="#" className="mb-1 form-label">
									Customer Type
								</label>
								<Select
									placeholder="Customer Type ..."
									className="react-select-customer-type"
									classNamePrefix="Search"
									isDisabled={false}
									isLoading={false}
									isClearable={true}
									isRtl={false}
									isSearchable={true}
									name="customer-type"
									value={selectedCustomerType}
									onChange={(v) => customerTypeOnChangeHandler(v)}
									options={[
										{ id: 7, value: 'walk', apiKeyWord: 'walk', label: 'Walk In Customer' },
										{ id: 6, value: 'reservation', apiKeyWord: 'reservation', label: 'Reservation Customer' },
										{ id: 4, value: 'hotel', apiKeyWord: 'hotel', label: 'Hotel Customer' },
									]}
								/>
							</div>
						</div>
						<div className="col-xl-6">
							<div className="form-group mb-2">
								<label htmlFor="#" className="mb-1 form-label">
									Customer Name
								</label>
								<div className="form-group d-flex gap-1 align-items-center">
									<Select
										placeholder="Customer Name ..."
										className="react-select-customer-name flex-grow-1"
										classNamePrefix="Search"
										isDisabled={false}
										isLoading={false}
										isClearable={true}
										isRtl={false}
										isSearchable={true}
										name="customer-name"
										value={selectedCustomerName}
										onChange={(v) => customerNameOnChangeHandler(v)}
										options={customersByCustomerType}
									/>
									<button
										type="button"
										onClick={() => {
											setIsNewCustomerModalShow(true);
										}}
										className="btn btn-primary bg-gradient border border-2 border-primary flex-shrink-0"
									>
										+
									</button>
								</div>
								<Modal
									show={isNewCustomerModalShow}
									size={'md'}
									onHide={() => {
										setIsNewCustomerModalShow(false);
									}}
								>
									<Modal.Header closeButton>
										<Modal.Title>Add Customer</Modal.Title>
									</Modal.Header>
									<Modal.Body>
										<form action="#" onSubmit={handleSubmit(newCustomerFormOnSubmit)}>
											<div className="mb-1 row gx-2">
												<label htmlFor="#" className="col-sm-3 text-end col-form-label">
													First Name
												</label>
												<div className="col-sm-9">
													<input
														type="text"
														{...register('first_name')}
														name="first_name"
														className={`form-control form-control-sm ${errors?.first_name && 'border-danger is-invalid'}`}
														id="#"
														placeholder="First Name"
													/>
													<p className="mb-0 text-start text-danger">
														<small>{errors?.first_name?.message}</small>
													</p>
												</div>
											</div>
											<div className="mb-1 row gx-2">
												<label htmlFor="#" className="col-sm-3 text-end col-form-label">
													Last Name
												</label>
												<div className="col-sm-9">
													<input
														type="text"
														{...register('last_name')}
														name="last_name"
														className={`form-control form-control-sm ${errors?.first_name && 'border-danger is-invalid'}`}
														id="#"
														placeholder="Last Name"
													/>
													<p className="mb-0 text-start text-danger">
														<small>{errors?.last_name?.message}</small>
													</p>
												</div>
											</div>
											<div className="mb-1 row gx-2">
												<label htmlFor="#" className="col-sm-3 text-end col-form-label">
													Mobile
												</label>
												<div className="col-sm-9">
													<input
														type="number"
														{...register('cust_phone')}
														name="cust_phone"
														className={`form-control form-control-sm ${errors?.first_name && 'border-danger is-invalid'}`}
														id="#"
														placeholder="Mobile"
													/>
													<p className="mb-0 text-start text-danger">
														<small>{errors?.mobile?.message}</small>
													</p>
												</div>
											</div>
											<div className="mb-1 row gx-2">
												<label htmlFor="#" className="col-sm-3 text-end col-form-label">
													Email
												</label>
												<div className="col-sm-9">
													<input
														type="email"
														{...register('email')}
														name="email"
														className={`form-control form-control-sm ${errors?.first_name && 'border-danger is-invalid'}`}
														id="#"
														placeholder="Email"
													/>
													<p className="mb-0 text-start text-danger">
														<small>{errors?.email?.message}</small>
													</p>
												</div>
											</div>
											<div className="mb-1 row gx-2">
												<div className="col-sm-8 offset-sm-4">
													<button type="submit" className="btn btn-primary bg-gradient btn-sm">
														Add
													</button>
												</div>
											</div>
										</form>
									</Modal.Body>
								</Modal>
							</div>
						</div>
						<div className="col-xl-6">
							<div className="form-group mb-2">
								<label htmlFor="#" className="mb-1 form-label">
									Waiter
								</label>
								<Select
									placeholder="Waiter ..."
									className="react-select-waiter"
									classNamePrefix="Search"
									isDisabled={false}
									isLoading={false}
									isClearable={true}
									isRtl={false}
									isSearchable={true}
									name="waiter"
									value={selectedWaiter}
									onChange={(v) => setSelectedWaiter(v)}
									options={allWaiter}
								/>
							</div>
						</div>
						<div className="col-xl-6">
							<div className="form-group mb-2">
								<label htmlFor="#" className="mb-1 form-label">
									Table No.
								</label>
								<Select
									placeholder="Table ..."
									className="react-select-table"
									classNamePrefix="Search"
									isDisabled={false}
									isLoading={false}
									isClearable={true}
									isRtl={false}
									isSearchable={true}
									name="table"
									value={selectedTable}
									onChange={(v) => setSelectedTable(v)}
									options={allTables}
								/>
							</div>
						</div>
					</div>
					<p className="mb-0 d-flex flex-wrap gap-2 pb-1">
						{!_.isUndefined(selectedCustomerName?.room_no) && (
							<>
								<small>
									<strong>Room Number</strong> : {`${selectedCustomerName?.room_no}`}
								</small>
							</>
						)}
						{!_.isUndefined(selectedCustomerName?.first_name) && (
							<>
								<small>
									<strong>Customer Name</strong> : {`${selectedCustomerName?.first_name} ${selectedCustomerName?.last_name}`}
								</small>
							</>
						)}
						{!_.isUndefined(selectedCustomerName?.cust_phone) && (
							<>
								<small>
									<strong>Phone</strong> : {`${selectedCustomerName?.cust_phone}`}
								</small>
							</>
						)}
						{!_.isUndefined(selectedCustomerName?.email) && (
							<>
								<small>
									<strong>Email</strong> : {`${selectedCustomerName?.email}`}
								</small>
							</>
						)}
						{!_.isUndefined(selectedTable?.table_name) && (
							<>
								<small>
									<strong>Table Name</strong> : {`${selectedTable?.table_name}`}
								</small>
							</>
						)}
						{!_.isUndefined(selectedWaiter?.employee_id) && (
							<>
								<small>
									<strong>Waiter Name</strong> : {`${selectedWaiter?.first_name} ${selectedWaiter?.middle_name} ${selectedWaiter?.last_name}`}
								</small>
							</>
						)}
					</p>
				</div>
				{_.size(invoiceData) > 0 && (
					<div className="table-responsive">
						<table className="table">
							<thead className="border-0">
								<tr>
									<th className="text-nowrap">Action</th>
									<th className="text-nowrap">Product Id</th>
									<th className="text-nowrap">Item</th>
									<th className="text-nowrap">Variants</th>
									<th className="text-nowrap">Qty</th>
									<th className="text-nowrap">Price</th>
									<th className="text-nowrap">Sub Total Price</th>
									<th className="text-nowrap">Discount</th>
									<th className="text-nowrap">Amount</th>
								</tr>
							</thead>
							<tbody>
								{invoiceData.map(
									({
										key,
										id,
										itemCode: productId,
										item,
										quantity,
										price,
										selected_variant,
										selectedProductAddOns,
										perProductDiscount,
										subTotalPrice,
										totalDiscount,
										amount,
									}) => {
										return (
											<tr key={key}>
												<td>
													<div className="btn-group" role="group">
														<button
															type="button"
															className="btn btn-sm btn-danger rounded-0"
															onClick={() => {
																removeInvoiceData(key);
															}}
														>
															<RiDeleteBin5Line />
														</button>
													</div>
												</td>
												<td>{productId}</td>
												<td className="text-nowrap" style={{ minWidth: '200px' }}>
													<strong>{item}</strong>
													{selectedProductAddOns.map((addon, index) => {
														return (
															<small key={index} className="d-block">
																[ {addon?.addon?.name} -{addon?.addon?.price} ]
															</small>
														);
													})}
												</td>
												<td>{selected_variant}</td>
												<td>
													<input
														type="number"
														min={'1'}
														className="form-control form-control-sm"
														value={quantity}
														onChange={(e) => onQuantityChange(key, e)}
														style={{ width: '60px' }}
													/>
												</td>
												<td>${price}</td>
												<td>${subTotalPrice}</td>
												<td>${totalDiscount}</td>
												<td>${amount}</td>
											</tr>
										);
									}
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</>
	);
};

export default InvoiceInfo;
