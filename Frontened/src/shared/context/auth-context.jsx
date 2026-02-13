import { createContext } from "react";
const authContext = createContext({
  isLoggedIn: false,
  creatorId: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export default authContext;
