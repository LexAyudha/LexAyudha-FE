import { Button } from "antd";
import React from "react";

export default function DashTraining({ userData }) {
  const res = {
    status: 200,
    data: {
      training: {
        session: {
          date: "2024-12-15",
          time: "12:00",
          status: "completed",
          Id: "DTS51820250315t",
        },
        progress: {
          total: 10,
          completed: 5,
        },
      },
    },
  };

  const trophies = [
    {
      name: "Word Master",
      desc: "Complete 50 words in a single session",
      icon: "https://clipground.com/images/black-shield-clipart-19.jpg",
    },
    {
      name: "Number Master",
      desc: "Complete 20 counts in a single session",
      icon: "https://clipground.com/images/black-shield-clipart-19.jpg",
    },
  ];

  return (
    <div className="flex h-[calc(100%-20px)] flex-col justify-between">
      <div className="flex w-full">
        <div className="flex w-[50%] flex-col">
          <h3 className=" font-bold">Previous Session Details</h3>
          <p>
            <span className="font-bold">Date: </span>
            {res.data.training.session.date
              ? res.data.training.session.date
              : "N/A"}
          </p>
          <p>
            <span className="font-bold">Time: </span>
            {res.data.training.session.time
              ? res.data.training.session.time
              : "N/A"}
          </p>
          <p>
            <span className="font-bold">Status: </span>
            {res.data.training.session.status
              ? res.data.training.session.status
              : "N/A"}
          </p>
          <p>
            <span className="font-bold">Session ID: </span>
            {res.data.training.session.Id
              ? res.data.training.session.Id
              : "N/A"}
          </p>
        </div>
        <div className="flex w-[50%] flex-col justify-center  items-end">
          <div className="w-[65%] flex justify-center items-center ">
            <div className="flex flex-col w-full">
              <h3 className=" font-bold mb-7">My Trophies</h3>
              <div className="flex items-center justify-center flex-col">
                <img
                  className=" w-[100px] h-fit object-cover"
                  src={trophies[0].icon}
                  alt={trophies[0].name}
                />
                <h4 className="font-bold">{trophies[0].name}</h4>
                <p>{trophies[0].desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-5">
        <Button
          type="primary"
          className="w-[200px]"
          onClick={() => {
            window.location = "/training";
          }}
        >
          Start Training
        </Button>
      </div>
    </div>
  );
}
