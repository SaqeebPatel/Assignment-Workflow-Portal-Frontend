import { configureStore, createSlice } from "@reduxjs/toolkit";
import { baseQueryApi } from "../services/baseQueryApiSlice";

const decodeJwtToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const uiSlice = createSlice({
  name: "ui",
  initialState: { loading: false },
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload },
  },
});

const authSlice = createSlice({
  name: "auth",
  initialState: { token: null, user: null },
  reducers: {
    login: (state, action) => {
      const token = action.payload;
      const decoded = decodeJwtToken(token);
      
      if (decoded && decoded.role && (!decoded.exp || decoded.exp * 1000 > Date.now())) {
        state.token = token;
        state.user = decoded;
        localStorage.setItem("token", token);
      } else {
        state.token = null;
        state.user = null;
        localStorage.removeItem("token");
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
    restoreAuth: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    }
  },
});

export const initAuth = () => (dispatch) => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = decodeJwtToken(token);
    if (decoded && decoded.role && (!decoded.exp || decoded.exp * 1000 > Date.now())) {
      dispatch(authSlice.actions.restoreAuth({ token, user: decoded }));
    } else {
      localStorage.removeItem('token');
    }
  }
};

export const { setLoading } = uiSlice.actions;
export const { login, logout, restoreAuth } = authSlice.actions;

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    auth: authSlice.reducer,
    [baseQueryApi.reducerPath]: baseQueryApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseQueryApi.middleware),
});

export default store;
