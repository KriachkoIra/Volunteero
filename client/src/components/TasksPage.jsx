import React, { useState } from "react";
import { MapPin, Calendar, Building2 } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";

// const tasks = [
//   {
//     _id: "1",
//     title: "Task 1",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In consequat mi eget dolor porta tempus. Sed aliquet, lectus id condimentum tincidunt, eros odio vehicula sapien, ac blandit sem lorem nec arcu. In sodales urna metus, in faucibus arcu commodo ut.",
//     location: "Kyiv, Poshtova ploshcha",
//     date: "2025-04-10T10:00:00Z",
//     organizer: "Pet Shelter",
//   },
//   {
//     _id: "2",
//     title: "Task 2",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In consequat mi eget dolor porta tempus. Sed aliquet, lectus id condimentum tincidunt, eros odio vehicula sapien, ac blandit sem lorem nec arcu. In sodales urna metus, in faucibus arcu commodo ut.",
//     location: "Kyiv, Poshtova ploshcha",
//     date: "2025-04-10T10:00:00Z",
//     organizer: "Pet Shelter",
//   },
//   {
//     _id: "3",
//     title: "Task 3",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In consequat mi eget dolor porta tempus. Sed aliquet, lectus id condimentum tincidunt, eros odio vehicula sapien, ac blandit sem lorem nec arcu. In sodales urna metus, in faucibus arcu commodo ut.",
//     location: "Kyiv, Poshtova ploshcha",
//     date: "2025-04-10T10:00:00Z",
//     organizer: "Pet Shelter",
//   },
//   {
//     _id: "4",
//     title: "Task 4",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In consequat mi eget dolor porta tempus. Sed aliquet, lectus id condimentum tincidunt, eros odio vehicula sapien, ac blandit sem lorem nec arcu. In sodales urna metus, in faucibus arcu commodo ut.",
//     location: "Kyiv, Poshtova ploshcha",
//     date: "2025-04-10T10:00:00Z",
//     organizer: "Pet Shelter",
//   },
//   {
//     _id: "5",
//     title: "Task 5",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In consequat mi eget dolor porta tempus. Sed aliquet, lectus id condimentum tincidunt, eros odio vehicula sapien, ac blandit sem lorem nec arcu. In sodales urna metus, in faucibus arcu commodo ut.",
//     location: "Kyiv, Poshtova ploshcha",
//     date: "2025-04-10T10:00:00Z",
//     organizer: "Pet Shelter",
//   },
// ];

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let link = `http://localhost:4567/tasks`;

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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 px-20 gap-7 mt-8">
      {tasks.map((task) => (
        <Task key={task.id} item={task} />
      ))}
    </div>
  );
}

function Task({ item }) {
  const { title, description, location, date, organizer } = item;

  function formatDate(dateStr) {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    let date;

    dateStr[dateStr.length - 1] == "Z"
      ? (date = new Date(dateStr.slice(0, -1)))
      : (date = new Date(dateStr));
    return date.toLocaleString("en-GB", options);
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
          </div>
        </div>
      </div>
    </div>
  );
}
