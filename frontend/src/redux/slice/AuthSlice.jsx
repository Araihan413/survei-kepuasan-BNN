import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
  status: 'idle', // 'idle' | 'loading' | 'failed'
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },

    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

// Export actions
export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;

// Export selector
export const selectCount = (state) => state.counter.value;
export const selectStatus = (state) => state.counter.status;

// Export reducer
export default counterSlice.reducer;










// import { createContext, useContext, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     isAuthenticated: false,
//     user: null, // { username: "", role: "" }
//     token: null
//   });

//   const login = (userData, token) => {
//     setAuth({
//       isAuthenticated: true,
//       user: userData,
//       token: token
//     });
//   };

//   const logout = () => {
//     setAuth({
//       isAuthenticated: false,
//       user: null,
//       token: null
//     });
//   };

//   return (
//     <AuthContext.Provider value={{ ...auth, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);