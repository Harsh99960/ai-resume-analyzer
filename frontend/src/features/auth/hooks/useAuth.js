import { useContext , useEffect} from "react";
import { AuthContext } from "../auth.context";
import {
  login,
  register,
  logout,
  getMe,
} from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
      const data = await login({ email, password });

      setUser(data.user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);

    try {
      const data = await register({
        username,
        email,
        password,
      });

      setUser(data.user);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();

      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();

        setUser(data.user);
      } catch (error) {
        console.error("Failed to get user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getAndSetUser();
  }, []);

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleLogout,
  };
};

// import { useContext } from "react";
// import { AuthContext } from "../auth.context";
// import { login, register, logout, getMe } from "../services/auth.api";

// export const useAuth = ()=>{
//     const context = useContext(AuthContext)
//     const { user, setUser, loading, setLoading } = context

//     const handleLogin= async ({email , password})=>{
//         setLoading(true)
//         const data= await login({email, password})
//         setUser(data.user)
//         setLoading(false)
//     }
    
//     const handleRegister= async ({username, email, password})=>{
//         setLoading(true)
//         const data= await Register({username, email, password})
//         setUser(data.user)
//         setLoading(false)
//     }

//     const handleLogout= async ()=>{
//         setLoading(true)
//         const data= await Logout()
//         setUser(null)
//         setLoading(false)
//     }

//     return {user, loading, handleRegister, handleLogin, handleLogout}
// }