import * as React from 'react';
import * as ReactDom from 'react-dom';
import App from "@app/containers/App";
import apiFactory from "@shared/client/http/api";
import getStore from "@app/store/store";
import {getStoreRef} from "@shared/store/createStore";
import {Provider} from "react-redux";

declare const module: NodeModule & { hot: any };
console.log(process.env);
const api = apiFactory({baseURL: "/doc"});
const store = getStore({}, {api});
if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => {
        console.log('re render the app now');
        const api = require('@shared/client/http/api').default({baseURL: "/doc"})
        const oldStore = getStoreRef()
        const store = require('@app/store/store').default({preloadState: {...oldStore.getState()}}, {api})
        // @ts-ignore
        window.updateStore && window.updateStore(store);
    })
}
ReactDom.render(
    <Provider store={store}>
        <App/>
    </Provider>
    , document.getElementById('root'))
