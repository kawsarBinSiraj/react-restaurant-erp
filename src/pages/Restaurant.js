import React, { useState, useRef, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { VscClose } from 'react-icons/vsc';
import Select from 'react-select';
import InvoiceInfo from '../components/InvoiceInfo/InvoiceInfo';
import GrandTotal from '../components/GrandTotal/GrandTotal';
import useHotkeys from '@reecelucas/react-use-hotkeys';
import scannerBeepsSound from '../assets/audio/shop-scanner-beeps.wav';
import ApplicationHelmet from '../components/ApplicationHelmet/ApplicationHelmet';
import useSound from 'use-sound';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
const axios = require('axios');

const Restaurant = () => {
	const { register, handleSubmit, reset } = useForm();
	const [scannerBeepsSoundPlay] = useSound(scannerBeepsSound);
	const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
	const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);
	const [totalDiscount, setTotalDiscount] = useState();
	const [totalAmount, setTotalAmount] = useState();
	const [invoiceData, setInvoiceData] = useState();
	const [allCategoryAndSubCategory, setAllCategoryAndSubCategory] = useState([]);
	const [productsByCategory, setProductsByCategory] = useState([]);
	const [singleProductInfo, setSingleProductInfo] = useState({});
	const [selectedProductAddOns, setSelectedProductAddOns] = useState([]);
	const [categorySearchValue, setCategorySearchValue] = useState('');
	const [productSearchValue, setProductSearchValue] = useState('');
	const [totalAddonsPrice, setTotalAddonsPrice] = useState(0);

	const [customerType, setCustomerType] = useState();
	const [customerName, setCustomerName] = useState();
	const [waiterName, setWaiterName] = useState();
	const [tableName, setTableName] = useState();
	const [foodNames, setFoodNames] = useState([]);
	const [quickSearchValue, setQuickSearchValue] = useState('');
	const [foodNamesFiltered, setFoodNamesFiltered] = useState([]);

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
	 * @method {created htmlDOM Ref}
	 * type {}
	 * return {}
	 */
	const categorySearchByShortcutRef = useRef();
	const productSearchByShortcutRef = useRef();

	/**
	 * @method {created shortcut key}
	 * type {}
	 * return {}
	 */
	useHotkeys('shift+p', () => {
		setTimeout(() => {
			productSearchByShortcutRef.current.focus();
			productSearchByShortcutRef.current.onMenuOpen();
		}, 100);
	});
	useHotkeys('shift+c', () => {
		setTimeout(() => {
			categorySearchByShortcutRef.current.focus();
			categorySearchByShortcutRef.current.onMenuOpen();
		}, 100);
	});

	/**
	 * @method {categoryWidgetOpen}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const categoryWidgetOpen = async (e, menuName) => {
		if (e.target.closest(`.category`)) {
			let t = e.target.closest(`.category`).querySelector(`.category-title`).textContent;
			document.querySelector('.subCategory-title').textContent = t;
		}
		try {
			let response = await axios.get(`/menus/${menuName}`);
			let data = response?.data;
			setFoodNamesFiltered([]);
			setQuickSearchValue('');
			!_.isUndefined(data) && setFoodNames(data);
		} catch (error) {
			console.log(error);
		}
		setIsSubCategoryOpen(true);
	};

	/**
	 * @method {submissionFormOpen}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const submissionFormOpen = (product, e) => {
		searchSubCategoryOnChangeHandler(product);
		setIsSubmissionFormOpen(true);
		setTimeout(() => {
			document.getElementById('form-widget-title').querySelector(`.form-widget-title`).textContent = e.target.textContent;
		}, 300);
	};

	/**
	 * @method {searchCategoryOnChangeHandler}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const searchCategoryOnChangeHandler = async (searchValue) => {
		let id = searchValue?.value?.id;
		if (!_.isUndefined(id)) {
			try {
				let response = await axios.get(`/categories/${id}`);
				let data = response?.data;
				let reArrangeData =
					!_.isUndefined(data) &&
					data.map((c) => {
						return {
							label: c?.product_name,
							value: c?.product_name,
							...c,
						};
					});
				setProductsByCategory(reArrangeData);
				setProductSearchValue('');
			} catch (error) {
				console.log(error);
			}
		}
	};

	/**
	 * @method {searchSubCategoryOnChangeHandler}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const searchSubCategoryOnChangeHandler = async (product) => {
		if (!_.isUndefined(product?.id)) {
			try {
				let response = await axios.get(`/products/${product?.id}`);
				let p_info = response?.data?.[0];
				console.log(p_info);
				setSingleProductInfo(() => {
					setIsSubmissionFormOpen(true);
					return {
						...p_info,
						discount: p_info?.discounts?.price || 0,
						totalDiscount: p_info?.discounts?.price || 0,
						orderedQuantity: p_info?.orderedQuantity || 1,
						subTotal: p_info?.price,
						total: p_info?.price,
					};
				});
			} catch (error) {
				console.log(error);
			}
		}
	};

	/**
	 * @method {getAllCategoryAndSubCategory}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const getAllCategoryAndSubCategory = async () => {
		try {
			let response = await axios.get('/categories');
			let data = response?.data?.categories;
			let reArrangeData =
				!_.isUndefined(data) &&
				data.map((category) => {
					if (category?.subcategories.length > 0) {
						return {
							label: category?.name,
							options: category?.subcategories.map((sc) => {
								return { label: sc.name, value: { ...sc } };
							}),
						};
					} else {
						return {
							label: category?.name,
							value: { ...category },
						};
					}
				});
			setAllCategoryAndSubCategory(reArrangeData);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * @method {productOnChangeHandler}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const productOnChangeHandler = (e) => {
		let ordered_quantity = e?.target?.value;
		setSingleProductInfo((state) => {
			return {
				...state,
				orderedQuantity: Number.parseInt(ordered_quantity),
				totalDiscount: Number.parseInt(state?.discount * ordered_quantity),
				subTotal: Number.parseInt(state?.price * ordered_quantity),
				total: Number.parseInt(state?.price * ordered_quantity - state?.discount * ordered_quantity),
			};
		});
		scannerBeepsSoundPlay();
	};

	/**
	 * @method {adOnsOnChangeHandler}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const adOnsOnChangeHandler = (addonId, price, e) => {
		const { checked } = e.target;
		if (checked === true) {
			let checkedAddons = selectedProductAddOns;
			singleProductInfo?.addons.forEach((addon) => {
				if (addon?.addon_id === addonId) {
					checkedAddons.push(addon);
				}
			});
			setSingleProductInfo((state) => {
				setSelectedProductAddOns(checkedAddons);
				setTotalAddonsPrice((state) => {
					return state + price;
				});
				return {
					...state,
					subTotal: state?.subTotal + price,
					total: state?.total + price,
				};
			});
		} else {
			let uncheckedAddons = selectedProductAddOns.filter((addon) => addon?.addon_id !== addonId);
			setSingleProductInfo((state) => {
				setSelectedProductAddOns(uncheckedAddons);
				setTotalAddonsPrice((state) => {
					return state - price;
				});
				return {
					...state,
					subTotal: state?.subTotal - price,
					total: state?.total - price,
				};
			});
		}
		scannerBeepsSoundPlay();
	};

	/**
	 * @method {onSubmit}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const onSubmit = (e) => {
		e.preventDefault();
		let productOrderFormDataObj = {};
		const formData = new FormData(e.currentTarget);
		for (let [key, value] of formData.entries()) {
			if (['product_id', 'product_price', 'product_discount', 'total_discount', 'ordered_quantity', 'sub_total', 'total_amount'].includes(key)) {
				productOrderFormDataObj[key] = Number.parseInt(value);
			} else {
				productOrderFormDataObj[key] = value;
			}
		}
		let productSelectBundle = { ...productOrderFormDataObj, selectedProductAddOns, totalAddonsPrice };
		console.log(productSelectBundle);
		dispatch({ type: 'ADD_INVOICE_DATA', payload: productSelectBundle });
		onProductInfoModalClose();
		scannerBeepsSoundPlay();
	};

	const quickSearchByFoodName = (e) => {
		let { value } = e?.target;
		setQuickSearchValue(value);
		if (value !== '') {
			const filteredData = foodNames.filter((item) => {
				if (item.food_name.toLowerCase().includes(value.toLowerCase())) {
					return item;
				}
			});
			setFoodNamesFiltered(filteredData);
		} else {
			setFoodNamesFiltered(foodNames);
		}
	};

	/**
	 * @method {onProductInfoModalClose}
	 * @set {}
	 * type {}
	 * return {}
	 */
	const onProductInfoModalClose = () => {
		setSingleProductInfo({});
		setProductsByCategory([]);
		setSelectedProductAddOns([]);
		setCategorySearchValue('');
		setProductSearchValue('');
		setIsSubmissionFormOpen(false);
	};

	/**
	 * @method {component did mount}
	 * @set {}
	 * type {}
	 * return {}
	 */
	useEffect(() => {
		getAllCategoryAndSubCategory();
	}, []);

	return (
		<>
			<ApplicationHelmet title="Insignia POS | Dashboard" description="" />
			<div className="restaurant position-relative py-4 pb-5">
				<div className="row gx-xl-5">
					<div className="col-xl-5 col-xxl-5">
						<div className="row gx-3">
							<div className="col-md-6">
								<div className="form-group">
									<label htmlFor="#">Search Category</label>
									<div className="search-category mb-3 border rounded p-1 position-relative" style={{ zIndex: '100' }}>
										<Select
											ref={categorySearchByShortcutRef}
											placeholder="Search Category ..."
											className="react-select react-select-group"
											classNamePrefix="Search"
											isDisabled={false}
											isLoading={false}
											isClearable={true}
											isRtl={false}
											isSearchable={true}
											value={categorySearchValue}
											onChange={(value) => {
												searchCategoryOnChangeHandler(value);
												setCategorySearchValue(value);
											}}
											name="search-category"
											options={allCategoryAndSubCategory}
										/>
									</div>
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label htmlFor="#">Search Product</label>
									<div className="search-product mb-3 border rounded p-1 position-relative" style={{ zIndex: '100' }}>
										<Select
											ref={productSearchByShortcutRef}
											placeholder="Search Product ..."
											className="react-select"
											classNamePrefix="Search"
											isDisabled={false}
											isLoading={false}
											isClearable={true}
											isRtl={false}
											isSearchable={true}
											name="search-product"
											value={productSearchValue}
											onChange={(value) => {
												searchSubCategoryOnChangeHandler(value);
												setProductSearchValue(value);
											}}
											options={productsByCategory}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="main-category">
							<div className="row gx-3 main-category-inner">
								<div className="col-md-3 col-xl-4 col-6 mb-3">
									<div
										className="category rounded py-3 px-3 h-100 bg-primary bg-gradient bg-opacity-25"
										onClick={(e) => {
											categoryWidgetOpen(e, 'launch');
										}}
									>
										<h3 className="fs-4 text-dark fw-normal mb-0 category-title">Lunch</h3>
									</div>
								</div>
								<div className="col-md-3 col-xl-4 col-6 mb-3">
									<div
										className="category rounded py-3 px-3 h-100 bg-warning bg-gradient bg-opacity-25"
										onClick={(e) => {
											categoryWidgetOpen(e, 'breakfast');
										}}
									>
										<h3 className="fs-4  text-dark fw-normal mb-0 category-title">Breakfast</h3>
									</div>
								</div>
								<div className="col-md-3 col-xl-4 col-6 mb-3">
									<div
										className="category rounded py-3 px-3 h-100 bg-success bg-gradient bg-opacity-25"
										onClick={(e) => {
											categoryWidgetOpen(e, 'dinner');
										}}
									>
										<h3 className="fs-4  text-dark fw-normal mb-0 category-title">Dinner</h3>
									</div>
								</div>
							</div>
						</div>
						<div className={`sub-category p-4 pt-2 pb-4 rounded bg-light ${isSubCategoryOpen ? 'd-block' : 'd-none'}`}>
							<h5 className="mb-1 fs-5 fw-bold font-monospace d-flex justify-content-between align-items-center">
								<span className="subCategory-title">Sub Category</span>
								<button
									type="button"
									className="btn btn-sm btn-danger rounded-circle"
									style={{ width: '30px', height: '30px' }}
									onClick={() => {
										setIsSubCategoryOpen(false);
									}}
								>
									<VscClose />
								</button>
							</h5>
							<div className="form-group my-2 mb-3">
								<input
									value={quickSearchValue}
									onChange={(e) => {
										quickSearchByFoodName(e);
									}}
									type="search"
									className="form-control form-control-sm"
									placeholder="Search"
								/>
							</div>
							<ul className="nav gap-2" style={{ maxHeight: '175px', overflowX: 'hidden' }}>
								{_.size(foodNamesFiltered) > 0
									? foodNamesFiltered.map((f) => {
											return (
												<li key={f?.id} className="nav-item">
													<button
														type="button"
														className="nav-link px-4 py-1 btn-info btn text-light fs-6"
														onClick={(e) => submissionFormOpen(f, e)}
													>
														{f?.food_name}
													</button>
												</li>
											);
									  })
									: foodNames.map((f) => {
											return (
												<li key={f?.id} className="nav-item">
													<button
														type="button"
														className="nav-link px-4 py-1 btn-info btn text-light fs-6"
														onClick={(e) => submissionFormOpen(f, e)}
													>
														{f?.food_name}
													</button>
												</li>
											);
									  })}
							</ul>
						</div>
					</div>
					<div className="col-xl-7 col-xxl-7">
						<InvoiceInfo
							getTotalInfo={(invoiceData, discount, amount, cType, cName, wName, tName) => {
								setTotalDiscount(discount);
								setTotalAmount(amount);
								setInvoiceData(invoiceData);
								setCustomerType(cType);
								setCustomerName(cName);
								setWaiterName(wName);
								setTableName(tName);
							}}
						/>
					</div>
				</div>
				<GrandTotal
					invoiceData={invoiceData}
					totalDiscount={totalDiscount}
					totalAmount={totalAmount}
					customerType={customerType}
					customerName={customerName}
					waiterName={waiterName}
					tableName={tableName}
				/>
				<Modal
					size="lg"
					show={isSubmissionFormOpen}
					centered
					onHide={() => {
						onProductInfoModalClose();
					}}
				>
					<Modal.Header className="px-4" closeButton>
						<Modal.Title id="form-widget-title">
							<span className="form-widget-title">Product Information</span>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body className="p-4">
						<div className={`featured-product mb-2`}>
							{productsByCategory.some((product) => product?.featured === 'Featured') === true && (
								<h5 className="mb-2 fs-6 fw-bold font-monospace">
									<span className="featured-product-title">Featured Product</span>
								</h5>
							)}
							<div className="row text-center gx-3">
								{productsByCategory.map((product) => {
									if (product?.featured === 'Featured') {
										return (
											<div className="col-xl-2 col-sm-4" key={product?.id}>
												<div
													onClick={() => {
														searchSubCategoryOnChangeHandler(product);
													}}
													className="featured-sub-category p-2 border rounded mb-2"
												>
													<img src={`${product?.item_image}`} alt="logo" className="img-fluid d-inline-block mb-1" style={{ height: '30px' }} />
													<strong className="d-block">Price : {product?.price}</strong>
													<p className="mb-0">
														<small> {product?.product_name}</small>
													</p>
												</div>
											</div>
										);
									}
								})}
							</div>
						</div>
						<form onSubmit={(e) => onSubmit(e)} className="form-body">
							<div className="row gx-3">
								<div className="col-xl-3 d-none">
									<div className="form-group mb-2">
										<label htmlFor="#" className="mb-1 form-label">
											Product Id
										</label>
										<div className="form-input-group position-relative">
											<input
												type="text"
												name="product_id"
												className="form-control form-control-sm"
												value={singleProductInfo?.id}
												readOnly
												autoComplete="off"
												placeholder="Product Id"
											/>
										</div>
									</div>
								</div>
								<div className="col-xl-3">
									<div className="form-group mb-2">
										<label htmlFor="#" className="mb-1 form-label">
											Item Name
										</label>
										<div className="form-input-group position-relative">
											<input
												type="text"
												name="product_name"
												className="form-control form-control-sm"
												value={singleProductInfo?.item_name}
												readOnly
												autoComplete="off"
												placeholder="Item Name"
											/>
										</div>
									</div>
								</div>
								{_.size(singleProductInfo?.variants) > 0 ? (
									<div className="col-xl-3">
										<div className="form-group mb-2">
											<label htmlFor="#" className="mb-1 form-label">
												Variants
											</label>
											<select className="form-control form-select form-select-sm" name="selected_variant">
												{singleProductInfo?.variants.map((s, i) => {
													return (
														<option key={s?.id} value={s.name}>
															{s?.name}
														</option>
													);
												})}
											</select>
										</div>
									</div>
								) : (
									<div className="col-xl-3 d-none">
										<label htmlFor="#" className="mb-1 form-label">
											Variants
										</label>
										<div className="form-input-group position-relative">
											<input
												type="text"
												name="selected_variant"
												className="form-control form-control-sm"
												value=""
												readOnly
												autoComplete="off"
												placeholder="Variant"
											/>
										</div>
									</div>
								)}
								<div className="col-xl-3">
									<div className="form-group mb-2">
										<label htmlFor="#" className="mb-1 form-label">
											Quantity
										</label>
										<input
											type="number"
											min={1}
											defaultValue={1}
											name="ordered_quantity"
											className="form-control form-control-sm"
											placeholder="Quantity"
											onChange={(e) => productOnChangeHandler(e)}
										/>
									</div>
								</div>
								<div className="col-xl-3">
									<div className="form-group mb-2">
										<label htmlFor="#" className="mb-1 form-label">
											Price
										</label>
										<input
											type="number"
											readOnly
											name="product_price"
											value={singleProductInfo?.price}
											className="form-control form-control-sm"
											placeholder="Price"
										/>
									</div>
								</div>
								<div className="col-xl-3">
									<div className="form-group mb-2">
										<label htmlFor="#" className="mb-1 form-label">
											Product Discount
										</label>
										<input
											type="number"
											className="form-control form-control-sm"
											name="product_discount"
											value={singleProductInfo?.discount}
											readOnly
											placeholder="Discount"
										/>
									</div>
								</div>
								<div className="col-xl-3">
									<div className="form-group mb-2">
										<label htmlFor="#" className="mb-1 form-label">
											Total Discount
										</label>
										<input
											type="number"
											className="form-control form-control-sm"
											name="total_discount"
											value={singleProductInfo?.totalDiscount}
											readOnly
											placeholder="Discount"
										/>
									</div>
								</div>
								<div className="col-xl-3">
									<div className="form-group mb-2">
										<label htmlFor="#" className="mb-1 form-label">
											Sub Total
										</label>
										<input
											type="text"
											readOnly
											className="form-control form-control-sm"
											name="sub_total"
											value={singleProductInfo?.subTotal}
											placeholder="Total"
										/>
									</div>
								</div>
								<div className="col-xl-3">
									<div className="form-group mb-2">
										<label htmlFor="#" className="mb-1 form-label">
											Total
										</label>
										<input
											type="text"
											readOnly
											className="form-control form-control-sm"
											name="total_amount"
											value={singleProductInfo?.total}
											placeholder="Total"
										/>
									</div>
								</div>

								{_.size(singleProductInfo?.addons) > 0 && (
									<div className="col-12">
										<div className="table-responsive mt-2">
											<table className="table table-sm">
												<thead className="bg-primary bg-opacity-25">
													<tr>
														<th className="px-2">Add-ons Name</th>
														<th className="px-2">Price</th>
														<th className="px-2"> Take Up </th>
													</tr>
												</thead>
												<tbody>
													{singleProductInfo?.addons.map((singleAddon, i) => {
														let {
															id,
															addon_id,
															addon: { name, price },
														} = singleAddon;
														return (
															<tr key={id}>
																<td className="px-2">{name}</td>
																<td className="px-2">{price}</td>
																<td className="px-2">
																	<input
																		type="checkbox"
																		name="ad-ons"
																		value={addon_id}
																		onChange={(e) => {
																			adOnsOnChangeHandler(addon_id, price, e);
																		}}
																		className="form-check-input"
																	/>
																</td>
															</tr>
														);
													})}
												</tbody>
											</table>
										</div>
									</div>
								)}

								<div className="col-xl-12">
									<div className="form-group mt-2">
										<button type="submit" className="btn btn-sm btn-primary bg-gradient px-3">
											Add
										</button>
									</div>
								</div>
							</div>
						</form>
					</Modal.Body>
				</Modal>
			</div>
		</>
	);
};

export default Restaurant;
