import {combineReducers} from 'redux';
import trainReducer from './trainerReducer';
const rootReducer = combineReducers({
  trainers: trainReducer
});

export default rootReducer;
