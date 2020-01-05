import createReducer from "@shared/store/createReducer";
import {APPEND_MESSAGE, LOAD_MESSAGES} from "@app/store/actionTypes";

export interface Message {
    acknowledgement: boolean
    createdAt: string
    body?: string
    media?: string
    audio?: string
    font?: number
    urlPreview?: {
        header: string
        description: string
        image?: string
    }
}

const initState = {
    messages: [] as Array<Message>,
}
const messageReducer = createReducer(initState, (state, {payload}) => ({
    [LOAD_MESSAGES]() {
        return {
            messages: payload
        }
    },
    [APPEND_MESSAGE]() {
        return {
            messages: [...state.messages, payload]
        }
    }

}))

export default messageReducer;


