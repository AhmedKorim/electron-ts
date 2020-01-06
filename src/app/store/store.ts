import initStore from "@shared/store/createStore";
import rootReducer from "@app/store/reducers";
import thunk from "redux-thunk";


const getStore = (preloadState = {}, extra = {}) => {
    const middleware = [thunk.withExtraArgument({...extra})];
    return initStore(rootReducer, middleware, preloadState)
}
export default getStore
