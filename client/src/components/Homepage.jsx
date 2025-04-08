import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="flex px-24 gap-20">
      <div className="xl:mt-20 lg:mt-16 md:mt-12 sm:mt-10">
        <p className="bg-secondary w-3/5 p-2">
          Join a growing community of Volunteero!
        </p>
        <h1 className="text-4xl text-primary font-bold mt-6">
          Connect. Volunteer. Make an Impact.
        </h1>
        <p className="text-lg mt-6">
          Volunteero is a platform that connects passionate volunteers with
          meaningful initiatives. Whether you're an individual looking to help
          or an organization seeking support — Volunteero makes it easy to join
          forces, create impact, and build a better world together.
        </p>

        <p className="mt-6">
          <span className="bg-secondary mr-3 px-3 py-1 rounded-full">1</span>{" "}
          Set up your account
        </p>
        <p className="mt-6">
          <span className="bg-secondary mr-3 px-3 py-1 rounded-full">2</span>{" "}
          Join a volunteering task
        </p>
        <p className="mt-6">
          <span className="bg-secondary mr-3 px-3 py-1 rounded-full">3</span>{" "}
          Make the world better
        </p>
        <button
          className=" mt-10 bg-primary hover:opacity-80 text-white p-4"
          onClick={() => navigate("/participate")}
        >
          Participate now!
        </button>
      </div>
      <img
        src="homepage.png"
        className="h-[calc(100vh-64px)] w-1/2 object-contain"
      />
    </div>
  );
}
