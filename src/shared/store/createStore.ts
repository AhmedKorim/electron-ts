import {applyMiddleware, compose, createStore, Store} from "redux";

let $store;
const initStore = (rootReducer, middleware, preloadState = {}): Store => {
    let store;
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' && process.env.NODE_ENV === 'development') {
        // @ts-ignore
        const redDevTools = (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

        store = createStore(
            rootReducer,
            preloadState,
            compose(applyMiddleware(...middleware), redDevTools),
        );
    } else {
        store = createStore(
            rootReducer,
            preloadState,
            // applyMiddleware( thunk )
            compose(applyMiddleware(...middleware)),
        )
    }
    $store = store
    return store;
}
export default initStore;
export const getStoreRef = () => $store
