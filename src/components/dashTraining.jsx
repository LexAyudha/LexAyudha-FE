import { Button } from "antd";
import React, { useEffect, useState } from "react";
import EmotionDetectionButton from "./EmotionDetectionButton";

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
      icon: "https://firebasestorage.googleapis.com/v0/b/lexayudha-71fc6.firebasestorage.app/o/uploads%2FwordMaster.png?alt=media&token=5a679522-7fe7-4b91-87b4-d7d10b40711c",
    },
    {
      name: "Number Master",
      desc: "Complete 20 counts in a single session",
      icon: "https://clipground.com/images/black-shield-clipart-19.jpg",
    },
  ];

  const handleGetReport = () => {

  }

  return (
    <div className="flex h-[calc(100%-20px)] flex-col justify-between">
      <div className="flex flex-col w-full lg:h-[250px] items-start lg:flex-row">
        <div className="flex w-full lg:w-[50%] h-[100%] flex-col">
          <h3 className=" font-bold mb-[30px]">Previous Session Details</h3>
          <div className=" hover:h-full lg:h-[63%] transition-all duration-300 ease-in-out px-[15px] py-[15px] group theme-glass rounded-[8px] shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)]">
            <p>
              <span className="">Date: </span>
              <span className="text-[var(--slate-gray)]">
                {res?.data?.training?.session?.date
                  ? res?.data?.training?.session?.date
                  : "N/A"}
              </span>
              
            </p>
            <p>
              <span className="">Time: </span>
              <span className="text-[var(--slate-gray)]">
              {res?.data?.training?.session?.time
                ? res?.data?.training?.session?.time
                : "N/A"}
              </span>
            </p>
            <p>
              <span className="">Status: </span>
              <span className="text-[var(--slate-gray)]">
              {res?.data?.training?.session?.status
                ? res?.data?.training?.session?.status
                : "N/A"}
              </span>
              
            </p>
            <p>
              <span className="">Session ID: </span>
              <span className="text-[var(--slate-gray)]">
              {res?.data?.training?.session?.Id
                ? res?.data?.training?.session?.Id
                : "N/A"}
              </span>
              
            </p>
            <div className=" opacity-100 lg:opacity-0 lg:-translate-y-2 lg:group-hover:block lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-200 ease-out">
              <button onClick={handleGetReport} className="flex items-center w-full text-center text-white rounded-[6px] bg-[#1574F9] hover:bg-[#3E91F6] transition-all duration-300 justify-center p-[10px] mt-5 text-sm ">Get Full Report</button>
            </div>
          </div>

        </div>
        <div className="flex lg:w-[50%] w-full mt-10 lg:mt-0 flex-col justify-center  items-end">
          <div className="lg:w-[65%] w-full flex justify-center items-center ">
            <div className="flex flex-col w-full">
              <h3 className=" font-bold mb-7">My Trophies</h3>
              <div className="flex items-center justify-center flex-col">
                <img
                  className=" w-[100px] h-fit object-cover"
                  src={trophies[0].icon}
                  alt={trophies[0].name}
                  loading="lazy"
                />
                <h4 className="font-bold">{trophies[0].name}</h4>
                <p>{trophies[0].desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center pt-5">
        <Button
          type="primary"
          className="w-[200px]"
          onClick={() => {
            window.location = `/training?new=${userData?.isFirstTimeUser}&u=${userData?.userName}`;
          }}
        >
          Start Training
        </Button>

      </div>
    </div>
  );
}
