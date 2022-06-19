import React, { useState, useEffect } from 'react';
import scannerBeepsSound from '../../assets/audio/shop-scanner-beeps.wav';
import useSound from 'use-sound';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
const _ = require('lodash');
const axios = require('axios');

const GrandTotal = ({ invoiceData, totalDiscount, totalAmount, customerType, customerName, waiterName, tableName }) => {
	const [scannerBeepsSoundPlay] = useSound(scannerBeepsSound);
	const [grandTotalAmount, setGrandTotalAmount] = useState(0);
	const [taxByPercent] = useState(2);
	const [taxChargeAmount, setTaxChargeAmount] = useState();
	const [serviceChargeByPercent, setServiceChargeByPercent] = useState(0);
	const [serviceChargeAmount, setServiceChargeAmount] = useState();
	const [isButtonsDisable, setIsButtonsDisable] = useState(true);
	const [isCancelButtonDisable, setIsCancelButtonDisable] = useState(true);
	/**
	 * @method {useDispatch}
	 * To change the global redux store
	 */
	const dispatch = useDispatch();

	/**
	 * @method {calcGrandTotal}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const calcGrandTotal = () => {
		let calcTaxChargeAmount = (totalAmount / 100) * taxByPercent;
		let calcServiceChargeAmount = (totalAmount / 100) * serviceChargeByPercent;
		setTaxChargeAmount(calcTaxChargeAmount);
		setServiceChargeAmount(calcServiceChargeAmount);
		setGrandTotalAmount(() => {
			return (totalAmount + calcTaxChargeAmount + calcServiceChargeAmount).toFixed(2);
		});
	};

	/**
	 * @method {sendInvoiceDetailsToOrder}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const sendInvoiceDetailsToOrder = async (ordersData) => {
		await axios({
			method: 'POST',
			url: '/create-orders',
			data: ordersData,
		})
			.then((response) => {
				const { status, message } = response?.data;
				if (status === true) {
					toast.success(message || 'Order Saved Successfully !', {
						position: 'bottom-right',
						theme: 'colored',
					});
					dispatch({ type: 'REMOVE_ALL_INVOICE_DATA' });
				} else if (status === false) {
					toast.error(message || 'Something went wrong !', {
						position: 'bottom-right',
						theme: 'colored',
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	/**
	 * @method {sendInvoiceDetailsToOrder}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const makePayment = async (ordersData) => {
		await axios({
			method: 'POST',
			url: '/order-payment',
			data: ordersData,
		})
			.then((response) => {
				console.log(response);
				const { status, message } = response?.data;
				if (status === true) {
					toast.success(message || 'Order & Payment Saved Successfully !', {
						position: 'bottom-right',
						theme: 'colored',
					});
					dispatch({ type: 'REMOVE_ALL_INVOICE_DATA' });
				} else if (status === false) {
					toast.error(message || 'Something went wrong !', {
						position: 'bottom-right',
						theme: 'colored',
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	/**
	 * @method {makeOrder}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const makeOrder = (status) => {
		if (_.size(invoiceData) > 0) {
			let grandTotalObj = {};
			let orderNumber = parseInt((Math.random() * 9 + 1) * Math.pow(10, 10 - 1), 10);
			let tChargeAmount = Number(taxChargeAmount);
			let sChargeAmount = Number(serviceChargeAmount);
			let total = Number(totalAmount + taxChargeAmount + serviceChargeAmount + totalDiscount);
			let tDiscount = Number(totalDiscount);
			let payable = Number(grandTotalAmount);

			let transDetails = { taxChargeAmount: tChargeAmount, serviceChargeAmount: sChargeAmount, total, totalDiscount: tDiscount, payable };
			grandTotalObj['resortsInfo'] = { customerType, customerName, waiterName, tableName, orderNumber, transactionDetails: transDetails };
			grandTotalObj['invoiceDetails'] = invoiceData;
			grandTotalObj['transactionDetails'] = transDetails;

			if (status === 'order') {
				sendInvoiceDetailsToOrder(grandTotalObj);
			} else if (status === 'payment') {
				makePayment(grandTotalObj);
			}
		} else {
			toast.error('No invoice data to order', {
				position: 'bottom-right',
				theme: 'colored',
			});
		}
	};

	/**
	 * @method {component did update}
	 * @set {}
	 * type {}
	 * return {}
	 */
	useEffect(() => {
		setIsCancelButtonDisable((state) => {
			return _.size(invoiceData) < 1 ? true : false;
		});
		if (!_.isNull(totalAmount) && !_.isUndefined(totalAmount)) {
			calcGrandTotal();
		}
	}, [invoiceData, taxByPercent, serviceChargeByPercent, calcGrandTotal, totalAmount]);

	/**
	 * @method {component did update}
	 * @set {}
	 * type {}
	 * return {}
	 */
	useEffect(() => {
		if (_.size(invoiceData) < 1 || _.isNil(customerType) || _.isNil(customerName) || _.isNil(waiterName) || _.isNil(tableName)) {
			setIsButtonsDisable(true);
		} else {
			setIsButtonsDisable(false);
		}
	}, [invoiceData, customerType, customerName, waiterName, tableName]);

	/**
	 * @method {component will unmount}
	 * type {}
	 * return {}
	 */
	useEffect(() => {
		return () => {
			toast.dismiss();
		};
	}, []);

	return (
		<>
			<div className="total-sticky-overview position-fixed bottom-0 w-100 end-0 p-2 px-4 bg-light border-top">
				<div className="row align-items-center justify-content-between">
					<div className="col-xl-7">
						<div className="row align-items-center">
							<div className="col-sm-6 col-xl-4 mb-2 mb-md-0">
								<div className="overview-widget d-flex align-items-center justify-content-md-end gap-3 mb-1">
									<p className="mb-0 flex-shrink-0">Vat/Tax({taxByPercent}%) :</p>
									<input
										type="number"
										readOnly
										disabled
										className="form-control form-control-sm"
										style={{ width: '100px' }}
										placeholder={`$${taxChargeAmount}`}
									/>
								</div>
								<div className="overview-widget d-flex align-items-center justify-content-md-end gap-3">
									<p className="mb-0 flex-shrink-0">Service Charge(%) :</p>
									<input
										type="number"
										className="form-control form-control-sm"
										style={{ width: '100px' }}
										value={serviceChargeByPercent}
										onChange={(e) => {
											setServiceChargeByPercent(e.target.value);
											scannerBeepsSoundPlay();
										}}
									/>
								</div>
							</div>
							<div className="col-sm-6 col-xl-3">
								<div className="overview-widget d-flex align-items-center justify-content-sm-end gap-3 mb-1">
									<p className="mb-0 fw-bold flex-shrink-0">Total :</p>
									<span className="badge fs-6 text-start bg-primary text-dark bg-opacity-50 rounded-0" style={{ minWidth: '75px' }}>
										${(totalAmount + taxChargeAmount + serviceChargeAmount + totalDiscount).toFixed(2)}
									</span>
								</div>
								<div className="overview-widget d-flex align-items-center justify-content-sm-end gap-3 mb-1">
									<p className="mb-0 fw-bold flex-shrink-0">Discount :</p>
									<span className="badge fs-6 text-start bg-danger text-dark bg-opacity-50 rounded-0" style={{ minWidth: '75px' }}>
										${totalDiscount}
									</span>
								</div>
							</div>
							<div className="col-sm-12 col-xl-5 col-xxl-3">
								<div className="overview-widget d-flex align-items-center justify-content-sm-end gap-3 mb-1">
									<p className="mb-0 fw-bold flex-shrink-0">Service Charge :</p>
									<span className="badge fs-6 text-start bg-info text-dark bg-opacity-50 rounded-0" style={{ minWidth: '75px' }}>
										${serviceChargeAmount}
									</span>
								</div>
								<div className="overview-widget d-flex align-items-center justify-content-sm-end gap-3 mb-1">
									<p className="mb-0 fw-bold flex-shrink-0">Payable :</p>
									<span className="badge fs-6 text-start bg-success rounded-0" style={{ minWidth: '75px' }}>
										${grandTotalAmount}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-5 text-xl-end mt-1 mt-xl-0">
						<div className="btn-group mt-2 mt-xl-0" role="group">
							<button
								type="button"
								disabled={isCancelButtonDisable}
								onClick={() => {
									dispatch({ type: 'REMOVE_ALL_INVOICE_DATA' });
									scannerBeepsSoundPlay();
								}}
								className="btn btn-sm btn-danger rounded-0"
							>
								Cancel
							</button>
							<button
								type="button"
								disabled={isButtonsDisable}
								onClick={() => {
									makeOrder('order');
								}}
								className="btn btn-sm btn-warning rounded-0"
							>
								Order
							</button>
							<button
								type="button"
								disabled={isButtonsDisable}
								onClick={() => {
									makeOrder('payment');
								}}
								className="btn btn-sm btn-success rounded-0"
							>
								Payment
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default GrandTotal;
