// Updated redux/store.js
import { createStore, combineReducers } from 'redux';
import { todoReducer } from './todoReducer';
import { authReducer } from './authReducer';

const rootReducer = combineReducers({
  todos: todoReducer,
  auth: authReducer
});

export const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);