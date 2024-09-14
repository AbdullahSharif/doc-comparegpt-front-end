import { create } from "zustand";
const initialUser = localStorage.getItem("user") || null;

const userAuthStore = create((set) => ({
  user: initialUser,
  setUser: (user) => {
    set({ user });
    localStorage.setItem("user", user);
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem("user");
    localStorage.removeItem("access");
  },
  isLoggedIn: () => {
    return userAuthStore.getState().user !== null;
  },
}));

export default userAuthStore;
