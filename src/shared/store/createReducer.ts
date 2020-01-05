import {Reducer} from "redux";

export type ReducerHandler = (state: any, action: ActionPayload) => any
export type ReducerConfigFactory = (state: any, action: ActionPayload) => ReducerConfig

export interface ReducerConfig {
    [key: string]: ReducerHandler
}

interface ActionPayload {
    type: string
    payload: any
}

const createReducer = (initState: any, factory: ReducerConfigFactory): Reducer =>
    (state = initState, {type, payload}: ActionPayload) => {
        const conf = factory(state, {type, payload});
        if (conf.hasOwnProperty(type)) {
            return {
                ...state,
                ...conf[type](state, {type, payload})
            }
        } else {
            return state;
        }
    }
export default createReducer



