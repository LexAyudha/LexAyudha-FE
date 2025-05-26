import { Button } from "antd";
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";


export default function DashTraining({ userData }) {

  const [latestReport, setLatestReport] = useState(null)

  useEffect(() => {
    getDyslexicRecords();
  }, [userData]);


  const getDyslexicRecords = async () => {
    try {
      const res = await axiosInstance.get(`/user/records/${userData?._id}`);
      if (res?.status === 200 && res?.data?.length > 0) {
        setLatestReport(res?.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };



  const trophies = [
    {
      name: "Word Master",
      desc: "Completed a quiz with 80 marks in a single session",
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
      {latestReport ? (
        <div className="flex flex-col w-full lg:h-[250px] items-start lg:flex-row">
          <div className="flex w-full lg:w-[50%] h-[100%] flex-col">
            <h3 className=" font-bold mb-[30px]">Previous Session Details</h3>
            <div className=" hover:h-full lg:h-[63%] transition-all duration-300 ease-in-out px-[15px] py-[15px] group theme-glass rounded-[8px] shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)]">
              <p>
                <span className="">Date: </span>
                <span className="text-[var(--slate-gray)]">
                  {latestReport?.date
                    ?
                    new Date(latestReport?.createdAt)
                      .toISOString()
                      .split("T")[0]

                    : "N/A"}
                </span>

              </p>
              <p>
                <span className="">Time: </span>
                <span className="text-[var(--slate-gray)]">
                  {latestReport?.date
                    ? new Date(latestReport?.createdAt).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone: "UTC",
                      }
                    )
                    : "N/A"}
                </span>
              </p>
              <p>
                <span className="">Status: </span>
                <span className="text-[var(--slate-gray)]">
                  {
                    "Completed"}
                </span>

              </p>
              <p>
                <span className="">Session ID: </span>
                <span className="text-[var(--slate-gray)]">
                  {latestReport?.name}_{latestReport?._id?.substring(0, 6)}
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
      ) : (
        <div className="flex flex-col w-full lg:h-[250px] items-start lg:flex-row">
          <div className="flex w-full lg:w-[50%] h-[100%] flex-col">
            <h3 className="font-bold mb-[30px] text-2xl">Welcome to Your Training Journey!</h3>
            <div className="hover:h-full lg:h-[63%] transition-all duration-300 ease-in-out px-[20px] py-[20px] group theme-glass rounded-[12px] shadow-[0px_0px_15px_rgba(0,_0,_0,_0.1)] bg-gradient-to-br from-white to-gray-50">
              <div className="flex flex-col items-start space-y-4">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-trophy text-2xl text-yellow-500"></i>
                  <p className="text-lg m-0 text-[var(--slate-gray)]">No sessions completed yet</p>
                </div>
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-lightbulb text-2xl text-blue-500"></i>
                  <p className="text-[var(--slate-gray)] m-0 ">Complete your first session to unlock achievements!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex lg:w-[50%] w-full mt-10 lg:mt-0 flex-col justify-center items-center">
            <div className="w-full max-w-[500px] text-center space-y-6 px-8">
              <h2 className="font-bold text-3xl text-blue-500 bg-clip-text leading-tight">
                Start Your Learning Adventure
              </h2>
              <p className="text-[var(--slate-gray)] text-lg">
                Every expert was once a beginner. Your journey starts with a single step.
              </p>
              <div className="flex justify-center space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <i className="fas fa-brain text-2xl text-blue-500"></i>
                  </div>
                  <p className="text-sm text-[var(--slate-gray)]">Train Skills</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <i className="fas fa-chart-line text-2xl text-green-500"></i>
                  </div>
                  <p className="text-sm text-[var(--slate-gray)]">Track Progress</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <i className="fas fa-award text-2xl text-purple-500"></i>
                  </div>
                  <p className="text-sm text-[var(--slate-gray)]">Earn Rewards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
