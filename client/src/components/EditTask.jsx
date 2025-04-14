import React from "react";
import { useNavigate, useParams } from "react-router";
import { MapPin, Calendar, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EditTask() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [alert, setAlert] = useState(null);

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    let link = `http://localhost:4567/tasks/${id}`;

    axios
      .get(link)
      .then((res) => {
        setTitle(res.data.title);
        if (res.data.date.length == 16) setDate(res.data.date);
        if (res.data.date.length < 16) setDate(`${res.data.date}T00:00`);
        setLocation(res.data.location);
        setDescription(res.data.description);
        setImage(res.data.image);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => setImage(null);

  const handleEdit = async (e) => {
    e.preventDefault();

    const localDate = new Date(date);
    const isoUtcString = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    ).toISOString();
    const formattedDate = isoUtcString.split(".")[0] + "Z";
    console.log(formattedDate);

    const link = `http://localhost:4567/tasks/${id}`;

    await axios
      .put(
        link,
        { title, description, location, date: formattedDate },
        {
          withCredentials: true,
        }
      )
      .then(async (res) => {
        console.log(res);
        navigate("/profile");
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
    <div className="w-full mt-6">
      <h1 className="text-center text-2xl text-primary font-bold">
        Create new task
      </h1>
      <form className="text-center" onSubmit={(e) => handleEdit(e)}>
        <div className="flex justify-center gap-16">
          <div className="flex flex-col w-1/4 mt-8">
            <div className="flex flex-col items-center align-middle justify-around gap-4 p-4 border-2 border-dashed border-gray-500 rounded-lg h-full">
              {!image ? (
                <label className="cursor-pointer flex flex-col h-full items-center p-4 mt-auto text-gray-500">
                  <span className="text-sm text-center">
                    Click or drag a photo to upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative w-3/4">
                  <img
                    src={image}
                    alt="Preview"
                    className="object-contain rounded-lg shadow-md"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-white rounded-full"
                  >
                    <XCircle className="text-red-500 w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col w-2/5 gap-8 mt-8">
            <input
              required
              type="text"
              value={title}
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-gray-700 border-2 p-2 border-gray-500 focus:outline-none focus:border-secondary shadow-lg"
            />
            <div className="flex items-center">
              <Calendar color="#accf9f" />
              <input
                required
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="ml-3 w-full text-gray-700 border-2 p-2 border-gray-500 focus:outline-none focus:border-secondary shadow-lg"
              />
            </div>
            <div className="flex items-center">
              <MapPin color="#accf9f" />
              <input
                required
                type="text"
                value={location}
                placeholder="Location"
                onChange={(e) => setLocation(e.target.value)}
                className="ml-3 w-full text-gray-700 border-2 p-2 border-gray-500 focus:outline-none focus:border-secondary shadow-lg"
              />
            </div>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="7"
              cols="50"
              className="h-full text-gray-700 border-2 p-2 border-gray-500 focus:outline-none focus:border-secondary shadow-lg"
              placeholder="Description"
            ></textarea>
          </div>
        </div>
        {alert && <p className="mt-6 text-red-700 text-center">{alert}</p>}
        <div className="flex justify-center w-full gap-20">
          <button
            className="border-2 border-primary px-16 py-2 text-lg hover:bg-primary hover:text-white mt-8 w-54"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-white bg-primary px-16 py-2 text-lg hover:opacity-80 mt-8 w-54"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
