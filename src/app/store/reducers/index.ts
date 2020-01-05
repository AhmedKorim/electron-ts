import {combineReducers} from "redux";
import messageReducer from "@app/store/reducers/message-reducer";


const rootReducer = combineReducers({
    message: messageReducer
})
export default rootReducer;
