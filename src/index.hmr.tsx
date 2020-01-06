import * as React from 'react';
import * as ReactDom from 'react-dom';
import App from "@app/containers/App";
import {HMRProvider} from "@shared/store/HotProvider";
import {AppContainer as ReactHotAppContainer} from 'react-hot-loader';

import apiFactory from "@shared/client/http/api";
import getStore from "@app/store/store";
import {getStoreRef} from "@shared/store/createStore";

declare const module: NodeModule & { hot: any };
const api = apiFactory({baseURL: "/doc"});
const store = getStore({}, {api});
console.log(process.env);
if (module.hot) {
    module.hot.accept()
    console.log('index.hrm');
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
    <ReactHotAppContainer>
        <HMRProvider store={store}>
            <App/>
        </HMRProvider>
    </ReactHotAppContainer>

    , document.getElementById('root'))
