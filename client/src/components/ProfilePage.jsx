import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router";

export default function ProfilePage() {
  const [alert, setAlert] = useState(null);

  const { name, role, setName, setId, setRole } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = async (e) => {
    e.preventDefault();

    const link = "http://localhost:4567/logout";

    await axios
      .post(link)
      .then(async (res) => {
        console.log(res);
        setId(null);
        setName(null);
        setRole(null);
        navigate("/");
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setAlert(err.response.data.error);
        } else {
          setAlert("Помилка з підключенням до сервера");
        }
        console.log(err);
      });
  };

  return (
    <div className="flex gap-12 m-auto justify-center mt-8">
      <div className="w-1/4 shadow-lg min-h-60 p-10 flex flex-col items-center">
        <img
          src="https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
          width="120px"
          className="border-3 rounded-full p-2 border-primary"
        />
        <p className="font-semibold text-xl mt-3">{name}</p>
        <p className="text-primary mt-2">{role}</p>
        {alert && <p className="mt-2 text-red-700">{alert}</p>}
        <button
          className="text-white bg-primary px-8 py-2 mt-3 hover:opacity-80"
          onClick={logout}
        >
          Logout
        </button>
      </div>
      <div className="w-3/5 min-h-60"></div>
    </div>
  );
}
