import { createContext, useReducer, Dispatch, ReactNode } from "react";

type Checklist = Map<string, Map<string, boolean>> | {};

interface PlaidState {
  lightMode: boolean;
  userToken: string;
  email: string;
  firstName: string;
  lastName: string;
  checklist: Checklist;
  linkSuccess: boolean;
  isItemAccess: boolean;
  linkToken: string | null;
  currentAccountType: string | null;
  accessToken: string | null;
  items: any[];
  networthHistory: any[]
  accounts: any[];
  accountsArray: any[];
  cashAccountsArray: any[];
  creditAccountsArray: any[];
  loanAccountsArray: any[];
  investmentAccountsArray: any[];
  transactions: any[];
  monthlySpending: any[];
  itemId: string | null;
  isError: boolean;
  backend: boolean;
  products: string[];
  linkTokenError: {
    error_message: string;
    error_code: string;
    error_type: string;
  };
}
  
// TODO: LOOK AT HOW TO STORE MULIPLE ITEMS!
const initialState: PlaidState = {
  lightMode: false,  
  userToken: "",
  email: "",
  firstName: "",
  lastName: "",
  checklist: {},
  linkSuccess: false,
  isItemAccess: true,
  linkToken: "", // Don't set to null or error message will show up briefly when site loads
  currentAccountType: null,
  accessToken: null,
  itemId: null,
  items: [],
  networthHistory: [],
  accounts: [],
  accountsArray: [],
  cashAccountsArray: [],
  creditAccountsArray: [],
  loanAccountsArray: [],
  investmentAccountsArray: [],
  transactions: [], 
  monthlySpending: [], 
  isError: false,
  backend: true,
  products: ["transactions"],
  linkTokenError: {
    error_type: "",
    error_code: "",
    error_message: "",
  },
};

type PlaidAction = {
  type: "SET_STATE" | "RESET_STATE";
  state: Partial<PlaidState>;
};

interface PlaidContext extends PlaidState {
  dispatch: Dispatch<PlaidAction>;
}

const Context = createContext<PlaidContext>(
  initialState as PlaidContext
);

const { Provider } = Context;

export const ContextProvider: React.FC<{ children: ReactNode }> = (
  props
) => {
  const reducer = (
    state: PlaidState,
    action: PlaidAction
  ): PlaidState => {
    switch (action.type) {
      case "SET_STATE":
        return { ...state, ...action.state };
      case "RESET_STATE":
        return { ...state, ...initialState};
      default:
        return { ...state };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Provider value={{ ...state, dispatch }}>{props.children}</Provider>;
};

export default Context;