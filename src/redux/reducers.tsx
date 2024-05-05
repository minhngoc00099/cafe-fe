import AuthReducer from "./auth/reducer";
import StateReducer from "./state/reducer";
import ProductReducer from "./product/reducer";
import CategoryReducer from "./category/reducer";
import ComboReducer from "./combo/reducer";
import OrderReducer from "./order/reducers"
import TableReducer from "./table_food/reducers"
import invoiceReducer from "./invoice/reducer";
const rootReducer = {
    auth: AuthReducer,
    state: StateReducer,
    product: ProductReducer,
    category: CategoryReducer,
    combo: ComboReducer,
    order: OrderReducer,
    table: TableReducer,
    invoice: invoiceReducer
};

export default rootReducer;