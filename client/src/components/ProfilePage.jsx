import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router";
import { MapPin, Calendar, Building2 } from "lucide-react";

export default function ProfilePage() {
  const [alert, setAlert] = useState(null);
  const [tasks, setTasks] = useState([]);

  const { name, role, setName, setId, setRole } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    let link = `http://localhost:4567/my_tasks`;

    axios
      .get(link)
      .then((res) => {
        setTasks(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = async (id) => {
    const link = `http://localhost:4567/tasks/${id}`;

    await axios
      .delete(link)
      .then(async (res) => {
        console.log(res);
        setTasks(tasks.filter((task) => task.id != id));
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
      <div className="w-1/5 shadow-lg min-h-60 p-10 flex flex-col items-center">
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
      <div className="w-2/3 min-h-60">
        <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-7">
          {tasks.map((task) => (
            <Task key={task.id} item={task} handleDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Task({ item, handleDelete }) {
  const { id, title, description, location, date, organizer } = item;

  const navigate = useNavigate();

  function formatDate(dateStr) {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(dateStr);
    return date.toLocaleString("en-GB", options); // or "uk-UA" for Ukrainian
  }

  const formattedDate = formatDate(date);

  return (
    <div className="mb-4 shadow-xl">
      <div className="m-autow-70 py-5 px-3 flex flex-col h-full">
        <div
          className="w-full h-64 bg-no-repeat bg-center"
          style={{
            backgroundImage:
              "url(https://brickscalibur.com/wp-content/uploads/2021/08/no-image.jpg)",
            backgroundSize: "cover",
          }}
        ></div>
        <div className="flex flex-col flex-grow">
          <div className="w-full">
            <div className="flex items-center justify-between mt-5">
              <div className="text-xl line-clamp-2 text-primary font-semibold">
                {title}
              </div>
            </div>
            <div className="mt-2">{description}</div>
          </div>

          <div className="flex-grow"></div>

          {/* Bottom Section */}
          <div className="mt-auto">
            <div className="flex mt-3">
              <MapPin color="#accf9f" />{" "}
              <span className="ml-2">{location}</span>
            </div>
            <div className="flex mt-2">
              <Calendar color="#accf9f" />{" "}
              <span className="ml-2">{formattedDate}</span>
            </div>
            <div className="flex mt-2">
              <Building2 color="#accf9f" />{" "}
              <span className="ml-2">{organizer.name}</span>
            </div>
            <div className="flex gap-4 w-full mt-5">
              <button
                className="w-full bg-primary text-white py-1 hover:opacity-80"
                onClick={() => navigate(`/edit-task/${id}`)}
              >
                Edit
              </button>
              <button
                className="w-full border-2 border-primary py-1 hover:text-white hover:bg-primary"
                onClick={() => handleDelete(id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
