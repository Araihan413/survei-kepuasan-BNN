import { useState, useEffect, createContext } from "react"

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin))
    }
  }, []);

  const login = (id, role, name, email) => {
    const dataAdmin = { id: id, role: role, name: name, email: email }
    localStorage.setItem("admin", JSON.stringify(dataAdmin))
    setAdmin(dataAdmin)
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem("admin")
  }
  const updateAdmin = (newData) => {
    setAdmin(newData);
    localStorage.setItem("admin", JSON.stringify(newData));
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, updateAdmin }}>
      {children}
    </AuthContext.Provider>
  )

}