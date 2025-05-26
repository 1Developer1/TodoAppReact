const initialAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Auth Action Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const LOGOUT = 'LOGOUT';
export const CLEAR_AUTH_ERROR = 'CLEAR_AUTH_ERROR';

// Auth Reducer
export const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Auth Action Creators
export const loginRequest = () => ({
  type: LOGIN_REQUEST
});

export const loginSuccess = (user, token) => ({
  type: LOGIN_SUCCESS,
  payload: { user, token }
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error
});

export const registerRequest = () => ({
  type: REGISTER_REQUEST
});

export const registerSuccess = (user, token) => ({
  type: REGISTER_SUCCESS,
  payload: { user, token }
});

export const registerFailure = (error) => ({
  type: REGISTER_FAILURE,
  payload: error
});

export const logout = () => ({
  type: LOGOUT
});

export const clearAuthError = () => ({
  type: CLEAR_AUTH_ERROR
});