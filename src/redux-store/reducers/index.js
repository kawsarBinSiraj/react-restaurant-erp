import { combineReducers } from 'redux';
import InvoiceInfoTableReducer from './InvoiceInfoTableReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    InvoiceInfoTableReducer: InvoiceInfoTableReducer,
    userReducer : userReducer
});

export default rootReducer;