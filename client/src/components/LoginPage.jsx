import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../context/UserContext";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmaiField] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");

  const navigate = useNavigate();

  const { setId, setName, setRole } = useContext(UserContext);

  const loginUser = async (e) => {
    e.preventDefault();

    const link = "http://localhost:4567/login";

    await axios
      .post(link, { email, password })
      .then(async (res) => {
        console.log(res);
        setId(res.data.user.id);
        setName(res.data.user.name);
        setRole(res.data.user.role);
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
    <div className="flex h-[calc(100vh-64px)] justify-center xl:gap-28 lg:gap-20 gap-14">
      <div className="w-[350px]">
        <div className="flex flex-col w-[350px] gap-5 m-auto my-[160px]">
          <h3 className="text-4xl login-text text-primary">Log In</h3>
          <p className="text-md">
            Welcome to Volunteero! Please fill in your credentials.
          </p>
          <form onSubmit={(e) => loginUser(e)} className="flex flex-col gap-6">
            <input
              type="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmaiField(e.target.value)}
              className="border-b-2 border-black py-2"
              required
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-b-2 border-black py-2"
              required
            />
            {alert && <div>{alert}</div>}
            <button className="bg-primary hover:opacity-80 text-white py-2 mt-2">
              Log In
            </button>
          </form>
          <div>
            <span>Don't have an account yet? </span>
            <button
              className="text-primary hover:opacity-80"
              onClick={() => navigate("/auth/register")}
            >
              Register
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-fit h-[calc(100vh-64px)]">
        <div className="login-text text-7xl text-primary w-fit">
          <p className="mt-[180px] my-shadow w-fit">Connect.</p>
          <p className="w-fit">Volunteer.</p>
          <p className="w-fit">
            Make an <span className="my-shadow w-fit">impact</span>.
          </p>
          <p className="text-4xl logo text-secondary mt-8 w-fit">Volunteero</p>
        </div>
      </div>
    </div>
  );
}
