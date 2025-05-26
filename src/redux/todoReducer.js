const initialState = {
  todos: [],
  loading: false,
  error: null
};

// Action Types
export const ADD_TODO = 'ADD_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const EDIT_TODO = 'EDIT_TODO';
export const FETCH_TODOS = 'FETCH_TODOS';
export const SET_ERROR = 'SET_ERROR';
export const SET_LOADING = 'SET_LOADING';

// Reducer
export const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TODOS:
      return {
        ...state,
        todos: action.payload,
        loading: false
      };
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload],
        loading: false
      };
    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => 
          todo.id === action.payload.id ? action.payload : todo
        )
      };
    case EDIT_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => 
          todo.id === action.payload.id ? action.payload : todo
        )
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

// Action Creators
export const fetchTodosAction = (todos) => {
  return {
    type: FETCH_TODOS,
    payload: todos
  };
};

export const addTodoAction = (todo) => {
  return {
    type: ADD_TODO,
    payload: todo
  };
};

export const deleteTodoAction = (id) => {
  return {
    type: DELETE_TODO,
    payload: id
  };
};

export const toggleTodoAction = (todo) => {
  return {
    type: TOGGLE_TODO,
    payload: todo
  };
};

export const editTodoAction = (todo) => {
  return {
    type: EDIT_TODO,
    payload: todo
  };
};

export const setLoadingAction = (isLoading) => {
  return {
    type: SET_LOADING,
    payload: isLoading
  };
};

export const setErrorAction = (error) => {
  return {
    type: SET_ERROR,
    payload: error
  };
};