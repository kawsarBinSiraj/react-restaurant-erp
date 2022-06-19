import { v4 as uuid_v4 } from 'uuid';

// initialState
const initialState = {
	invoiceTableData: [],
};

// Use the initialState as a default value
function InvoiceInfoTableReducer(state = initialState, action) {
	// The reducer normally looks at the action type field to decide what happens
	switch (action.type) {
		case 'ADD_INVOICE_DATA':
			let itdInstance = state?.invoiceTableData;
			const {
				product_id: itemCode,
				product_name: item,
				ordered_quantity: quantity,
				product_price: price,
				selected_variant,
				product_discount: perProductDiscount,
				total_discount: totalDiscount,
				sub_total: subTotalPrice,
				total_amount: amount,
				...rest
			} = action?.payload;
			itdInstance.push({
				key: uuid_v4(),
				id: itemCode,
				itemCode,
				item,
				quantity,
				price,
				selected_variant,
				perProductDiscount,
				totalDiscount,
				subTotalPrice,
				amount,
				...rest,
			});
			return {
				...state,
				invoiceTableData: itdInstance,
			};
		case 'REMOVE_INVOICE_DATA':
			let itdFilteredInstance = state?.invoiceTableData.filter((itd) => itd.key !== action?.payload);
			return {
				...state,
				invoiceTableData: itdFilteredInstance,
			};
		case 'UPGRADE_INVOICE_DATA':
			return {
				...state,
				invoiceTableData: action?.payload,
			};
		case 'REMOVE_ALL_INVOICE_DATA':
			return {
				...state,
				invoiceTableData: [],
			};
		default:
			// If this reducer doesn't recognize the action type, or doesn't
			// care about this specific action, return the existing state unchanged
			return state;
	}
}

export default InvoiceInfoTableReducer;
