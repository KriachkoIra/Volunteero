import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [id, setId] = useState(null);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    axios
      .get("/auth/verify", { withCredentials: true })
      .then((res) => {
        setId(res.data.id);
        setEmail(res.data.email);
        setName(res.data.name);
      })
      .catch((err) => {
        setId(null);
        setName(null);
        console.error(err);
      });
  }, []);

  return (
    <UserContext.Provider
      value={{
        id,
        setId,
        email,
        setEmail,
        name,
        setName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
