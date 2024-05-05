import { AuthActions } from "./auth/actions";
import { StateAction } from "./state/actions";
import { ProductActions } from "./product/actions";
import { categoryAction } from "./category/actions"
import { comboAction } from "./combo/actions";
import { OrderActions } from "./order/actions";
import { TableFoodActions } from "./table_food/actions";
import { InvoiceActions } from "./invoice/actions";
const useAction = () => {
  const actions = {
    AuthActions,
    StateAction,
    ProductActions,
    categoryAction,
    comboAction,
    OrderActions,
    TableFoodActions,
    InvoiceActions
  };
  return actions
}
export default useAction;