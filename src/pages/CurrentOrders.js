import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationHelmet from '../components/ApplicationHelmet/ApplicationHelmet';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import companyLogo from '../assets/img/insignia.png';
import { storage } from 'redux-persist/lib/storage';
const axios = require('axios');
const _ = require('lodash');

const CurrentOrders = () => {
	const navigate = useNavigate();
	const [isPrintPreviewShow, setIsPrintPreviewShow] = useState(false);
	const [currentOrders, setCurrentOrders] = useState([]);
	const [printPreviewContent, setPrintPreviewContent] = useState({});
	const [isKitchenPrintContentShow, setIsKitchenPrintContentShow] = useState(false);
	const [kitchenPrintContent, setKitchenPrintContent] = useState({});

	/**
	 * @ref {printComponentRef}
	 * @method {handlePrint}
	 * return {}
	 */
	const printComponentRef = useRef();
	const handlePrint = useReactToPrint({
		content: () => printComponentRef.current,
	});
	const kitchenPrintComponentRef = useRef();
	const handleKitchenPrintToken = useReactToPrint({
		content: () => kitchenPrintComponentRef.current,
	});

	/**
	 * @method {getCurrentOrders}
	 * return {}
	 */
	const getCurrentOrders = async () => {
		try {
			let response = await axios.get(`/order-list`);
			let data = response?.data.reverse();
			!_.isUndefined(data) && setCurrentOrders(data);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * @method {getCurrentOrdersByFilter}
	 * return {}
	 */
	const getCurrentOrdersByFilter = async (status) => {
		try {
			let response = await axios.get(`/order-list/${status}`);
			let data = response?.data?.data.reverse();
			!_.isUndefined(data) && setCurrentOrders(data);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * @method {makePayment}
	 * return {}
	 */
	const makePayment = async (invoiceId) => {
		await axios({
			method: 'POST',
			url: '/order-then-payment',
			data: { invoiceId },
		})
			.then((response) => {
				const { status, message } = response?.data;
				if (status === true) {
					toast.success(message || 'Order & Payment Saved Successfully !', {
						position: 'bottom-right',
						theme: 'colored',
					});
					getCurrentOrders();
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
	 * @method {cancelOrder}
	 * return {}
	 */
	const cancelOrder = async (invoiceId) => {
		await axios({
			method: 'POST',
			url: '/cancel-order',
			data: { invoiceId },
		})
			.then((response) => {
				const { status, message } = response?.data;
				if (status === true) {
					toast.success(message || 'Order Canceled Successfully !', {
						position: 'bottom-right',
						theme: 'colored',
					});
					getCurrentOrders();
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	/**
	 * @method {makePrintPreview}
	 * To change the global redux store
	 */
	const makePrintPreview = (invoiceId) => {
		let previewedData = currentOrders.filter((co) => co?.invoice_id === invoiceId);
		setPrintPreviewContent(previewedData?.[0]);
		setIsPrintPreviewShow(true);
	};

	const makeKitchenPrintToken = (invoiceId) => {
		let previewedData = currentOrders.filter((co) => co?.invoice_id === invoiceId);
		console.log(previewedData);
		setKitchenPrintContent(previewedData?.[0]);
		setTimeout(() => {
			setIsKitchenPrintContentShow(true);
			handleKitchenPrintToken();
			setIsKitchenPrintContentShow(false);
			setKitchenPrintContent({});
		}, 100);
	};

	/**
	 * @method {useEffect}
	 * @method {component will unmount}
	 * To change the global redux store
	 */
	useEffect(() => {
		getCurrentOrders();
		return () => {
			toast.dismiss();
		};
	}, []);

	return (
		<div className="dashboard py-4">
			<ApplicationHelmet title="Insignia POS | Current Orders" description="" />
			<div className="row gx-xl-5">
				<div className="col-xl-8">
					<div className="row align-items-center">
						<div className="col-sm-6">
							<h2 className="display-5 mb-3 d-flex align-items-center">
								<button
									onClick={() => {
										navigate(-1);
									}}
									className="btn btn-sm btn-primary rounded-pill px-3 me-2"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left" viewBox="0 0 16 16">
										<path
											fillRule="evenodd"
											d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"
										/>
									</svg>
								</button>
								Current Orders
							</h2>
						</div>
						<div className="col-sm-6">
							<div className="block-element d-flex align-items-center justify-content-end gap-2">
								<h4 className="fs-5 mb-0">Filter By :</h4>
								<div className="btn-group" role="group">
									<button
										type="button"
										onClick={() => {
											getCurrentOrders();
										}}
										className="btn btn-sm rounded-0 btn-dark"
									>
										All
									</button>
									<button
										type="button"
										onClick={() => {
											getCurrentOrdersByFilter('order');
										}}
										className="btn btn-sm rounded-0 btn-primary"
									>
										Order
									</button>
									<button
										type="button"
										onClick={() => {
											getCurrentOrdersByFilter('payment');
										}}
										className="btn btn-sm rounded-0 btn-success"
									>
										Payment
									</button>
									<button
										type="button"
										onClick={() => {
											getCurrentOrdersByFilter('cancel');
										}}
										className="btn btn-sm rounded-0 btn-danger"
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					</div>
					{_.size(currentOrders) > 0 ? (
						<div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
							<table className="table table-sm">
								<thead className="position-sticky top-0 table-primary">
									<tr>
										<th className="text-nowrap ps-2">Invoice Id</th>
										<th className="text-nowrap">Table no</th>
										<th className="text-nowrap">Waiter Name</th>
										<th className="text-nowrap">Status</th>
										<th className="text-nowrap">Items</th>
										<th className="text-nowrap">Action</th>
									</tr>
								</thead>
								<tbody>
									{currentOrders.map((co) => {
										return (
											<tr key={co?.id}>
												<th className="ps-2">{co?.invoice_id}</th>
												<td>{co?.table_name}</td>
												<td>{`${co?.wf_name} ${co?.wl_name}`} </td>
												<td>
													<span
														className={`badge fw-normal ${
															co?.status === 'order'
																? 'bg-primary'
																: co?.status === 'payment'
																? 'bg-success'
																: co?.status === 'cancel'
																? 'bg-danger'
																: ''
														}`}
													>
														{co?.status}
													</span>
												</td>
												<td>
													{co?.products.map((p, i) => {
														return (
															<small style={{ fontSize: '10px' }} key={i} className="badge bg-dark m-1 fw-normal">
																{p.item_name}
															</small>
														);
													})}
												</td>
												<td>
													{co?.status === 'order' ? (
														<div className="btn-group" role="group">
															<button
																type="button"
																onClick={() => {
																	cancelOrder(co?.invoice_id);
																}}
																className="btn btn-sm btn-danger rounded-0"
															>
																Cancel
															</button>
															<button
																type="button"
																onClick={() => {
																	makePrintPreview(co?.invoice_id);
																}}
																className="btn btn-sm btn-warning rounded-0"
															>
																Payment
															</button>
															<button
																type="button"
																onClick={() => {
																	makeKitchenPrintToken(co?.invoice_id);
																}}
																className="btn btn-sm btn-info rounded-0"
															>
																Print Token
															</button>
														</div>
													) : co?.status === 'payment' ? (
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="26"
															height="26"
															fill="currentColor"
															className="bi bi-patch-check text-success"
															viewBox="0 0 16 16"
														>
															<path
																fillRule="evenodd"
																d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"
															/>
															<path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z" />
														</svg>
													) : co?.status === 'cancel' ? (
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="26"
															height="26"
															fill="currentColor"
															className="bi bi-x-octagon text-danger"
															viewBox="0 0 16 16"
														>
															<path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z" />
															<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
														</svg>
													) : null}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					) : (
						<h1 className="fs-3 fw-normal">There is no current order available right now</h1>
					)}
				</div>
				<div className="col-xl-4">
					{isPrintPreviewShow && (
						<div className="preview-area position-relative mt-4" style={{ width: '350px' }}>
							<div id="print-preview" className="border font-monospace rounded p-3" ref={printComponentRef}>
								<table className="w-100 mb-2">
									<tbody>
										<tr>
											<td className="pb-3 text-center">
												<img src={companyLogo} alt="logo" className="img-fluid mb-1" style={{ width: '80px' }} />
												<h5 className="fs-6 fw-normal">Insignia Hotels & Resorts</h5>
											</td>
										</tr>
										<tr>
											<td className="border-bottom">
												<h5 className="fs-6 fw-bold border-bottom mb-1">Order Info</h5>
												<p className="mb-0">Invoice Id : {printPreviewContent?.invoice_id}</p>
												<p className="mb-0">Table Name : {printPreviewContent?.table_name}</p>
												<p className="mb-0">
													Waiter Name : {printPreviewContent?.wf_name} {kitchenPrintContent?.wl_name}
												</p>
											</td>
										</tr>
										<tr>
											<td className="pt-2">
												<h5 className="fs-6 fw-bold border-bottom mb-1">Customer Info</h5>
												<p className="mb-0">
													Full Name : {printPreviewContent?.cf_name} {printPreviewContent?.cl_name}
												</p>
											</td>
										</tr>
										<tr>
											<td className="pt-2">
												<table className="table text-start table-sm">
													<thead>
														<tr>
															<th>
																<strong className="fw-bold text-nowrap">Item</strong>
															</th>
															<th>
																<strong className="fw-bold text-nowrap">Qty</strong>
															</th>
															<th>
																<strong className="fw-bold text-nowrap">Sub Total</strong>
															</th>
														</tr>
													</thead>
													<tbody>
														{printPreviewContent.products.map((p) => {
															return (
																<tr key={p.id}>
																	<td>
																		<span className="d-block fw-bold">{p.item_name}</span>
																		{p.addon.map((pa, i) => {
																			return (
																				<small key={i} className="d-block text-nowrap">
																					[{pa.addon.name}-{pa.addon.price}]
																				</small>
																			);
																		})}
																	</td>
																	<td>{p.quantity}</td>
																	<td>{p.subtotal_price}</td>
																</tr>
															);
														})}
													</tbody>
													<tfoot className="table-success">
														<tr>
															<td></td>
															<td>Tax</td>
															<td>{printPreviewContent?.trans_tax}</td>
														</tr>
														<tr>
															<td></td>
															<td>Service Charge</td>
															<td>{printPreviewContent?.trans_service}</td>
														</tr>
														<tr>
															<td></td>
															<td>Total</td>
															<td>{printPreviewContent?.trans_total}</td>
														</tr>
														<tr>
															<td></td>
															<td>Discount</td>
															<td>{printPreviewContent?.trans_discount}</td>
														</tr>
														<tr>
															<td></td>
															<td>
																<strong>Payable</strong>
															</td>
															<td>{printPreviewContent?.trans_payable}</td>
														</tr>
													</tfoot>
												</table>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div className="btn-group d-flex justify-content-center position-absolute end-0 top-0 me-3" style={{ marginTop: '-14px' }} role="group">
								<button
									type="button"
									style={{ width: '30px', height: '30px' }}
									onClick={() => {
										handlePrint();
										makePayment(printPreviewContent?.invoice_id);
										setIsPrintPreviewShow(false);
									}}
									className="btn btn-sm rounded-circle btn-primary flex-grow-0 p-0"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
										<path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
										<path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z" />
									</svg>
								</button>
								<button
									type="button"
									style={{ width: '30px', height: '30px' }}
									onClick={() => {
										setIsPrintPreviewShow(false);
										setPrintPreviewContent({});
									}}
									className="btn btn-sm rounded-circle btn-danger flex-grow-0 p-0"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
										<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
									</svg>
								</button>
							</div>
						</div>
					)}

					{isKitchenPrintContentShow && (
						<div className="kitchen-print-token-preview-area d-none mt-4" style={{ width: '350px' }}>
							<div id="kitchen-print-token-preview" ref={kitchenPrintComponentRef} className="border font-monospace rounded p-3">
								<table className="w-100 mb-2">
									<tbody>
										<tr>
											<td className="pb-3 text-center">
												<img src={companyLogo} alt="logo" className="img-fluid mb-1" style={{ width: '80px' }} />
												<h5 className="fs-6 fw-normal">Insignia Hotels & Resorts</h5>
											</td>
										</tr>
										<tr>
											<td className="border-bottom">
												<h5 className="fs-6 fw-bold border-bottom mb-1">Order Info</h5>
												<p className="mb-0">Invoice Id : {kitchenPrintContent?.invoice_id}</p>
												<p className="mb-0">Table Name : {kitchenPrintContent?.table_name}</p>
												<p className="mb-0">
													Waiter Name : {kitchenPrintContent?.wf_name} {kitchenPrintContent?.wl_name}
												</p>
											</td>
										</tr>
										<tr>
											<td className="pt-2">
												<h5 className="fs-6 fw-bold border-bottom mb-1">Customer Info</h5>
												<p className="mb-0">
													Full Name : {kitchenPrintContent?.cf_name} {kitchenPrintContent?.cl_name}
												</p>
											</td>
										</tr>
										<tr>
											<td className="pt-2">
												<table className="table text-start table-sm">
													<thead>
														<tr>
															<th>
																<strong className="fw-bold text-nowrap">Item</strong>
															</th>
															<th>
																<strong className="fw-bold text-nowrap">Quantity</strong>
															</th>
														</tr>
													</thead>
													<tbody>
														{kitchenPrintContent?.products.map((p) => {
															return (
																<tr key={p.id}>
																	<td>
																		<span className="d-block fw-bold">{p.item_name}</span>
																		{p.addon.map((pa, i) => {
																			return (
																				<small key={i} className="d-block text-nowrap">
																					[{pa.addon.name}]
																				</small>
																			);
																		})}
																	</td>
																	<td>{p.quantity}</td>
																</tr>
															);
														})}
													</tbody>
												</table>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CurrentOrders;
