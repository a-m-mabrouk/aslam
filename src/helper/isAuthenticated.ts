import Cookies from "js-cookie";

export const isAuthenticated = () => {
  // Check for a specific cookie to determine if the user is logged in
  return Cookies.get("authToken") !== undefined;
};

export const getUserRole = () => {
  return Cookies.get("userRole") === "student";
};
