import * as React from 'react';
import {useState} from 'react';
import {hot} from "react-hot-loader";
import {Provider} from "react-redux";

export const HMRProvider = hot(module)(({store, children}) => {
    const [_store, setStore] = useState(store);
    // @ts-ignore
    window.updateStore = setStore
    return <Provider store={_store}>{children}</Provider>
})
