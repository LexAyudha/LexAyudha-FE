import React, { useEffect, useState, } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Image, Modal, Button, message, Upload } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import logo from "../assets/lexLogo.png";
import DashTraining from "../components/dashTraining.jsx";
import DashSettings from "../components/dashSettings.jsx";
import DashAchievements from "../components/dashAchive.jsx";
import DashBilling from "../components/dashBilling.jsx";
import DashPerformance from "../components/dashPerfRecords.jsx";
import DashCustomize from "../components/dashCustLesson.jsx";
import axiosInstance from "../api/axiosInstance.js';
import useVerifyLoginState from '../utils/validateLogin.js";
const { Dragger } = Upload;

export default function Dashboard() {

  const [userData, setUserData] = useState({})
  const [panel, setPanel] = useState('training')
  const [profileImage, setProfileImage] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const { id } = useParams()
  const [updatedUserName, setUpdatedUserName] = useState('')
  const [loadingScreen, setLoadingScreen] = useState(true)
  

  //proPic modal
  const [proPicOpen, setProPicOpen] = useState(false);
  const [confirmProPicLoading, setConfirmProPicLoading] = useState(false);
  const [proPicModalText, setProPicModalText] = useState('');

  //coverPic modal
  const [coverPicOpen, setCoverPicOpen] = useState(false);
  const [confirmCoverPicLoading, setConfirmCoverPicLoading] = useState(false);
  const [coverPicModalText, setCoverPicModalText] = useState('');

  //update user name modal
  const [UNOpen, setUNOpen] = useState(false);
  const [confirmUNLoading, setConfirmUNLoading] = useState(false);
  const [UNModalText, setUNModalText] = useState('');

  //profile picture modal functions
  const showProPicModal = () => {
    setProPicOpen(true);
  };
  const handleOk = async () => {
    setProPicModalText('Saving profile picture...');
    setConfirmProPicLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', profileImage);

      const res = await axiosInstance.post(`/user/uploads/profilePicture/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        setProfileImage(null)
        fetchUserData() // Fetch user data again to get the latest changes.
      }
      setProPicOpen(false);
      setProPicModalText('');
      setConfirmProPicLoading(false);
    } catch (error) {
      console.log(error)
    }

  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setProPicOpen(false);
    setProPicModalText('');
  };


  //cover picture modal functions
  const showCoverPicModal = () => {
    setCoverPicOpen(true);
  };
  const handleCoverOk = async () => {
    setCoverPicModalText('Saving cover picture...');
    setConfirmCoverPicLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', coverImage);

      const res = await axiosInstance.post(`/user/uploads/coverPicture/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        setCoverImage(null)
        fetchUserData() // Fetch user data again to get the latest changes.
      }
      setCoverPicOpen(false);
      setCoverPicModalText('');
      setConfirmCoverPicLoading(false);
    } catch (error) {
      console.log(error)
    }

  };
  const handleCoverCancel = () => {
    console.log('Clicked cancel button');
    setCoverPicOpen(false);
    setCoverPicModalText('');
  };


  //update userName modal functions
  const showUNModal = () => {
    setUpdatedUserName(userData?.userName)
    setUNOpen(true);
  };
  const handleUNOk = async () => {
    setUNModalText('Updating username...');
    setConfirmUNLoading(true);

    try {

      const payload = {
        userName: updatedUserName
      }

      const res = await axiosInstance.patch(`/user/${id}`, payload);

      if (res.status === 200) {
        setUpdatedUserName('')
        fetchUserData() // Fetch user data again to get the latest changes.

      }
      setUNOpen(false);
      setUNModalText('');
      setConfirmUNLoading(false);
    } catch (error) {
      console.log(error)
    }

  };
  const handleUNCancel = () => {
    console.log('Clicked cancel button');
    setUNOpen(false);
    setUNModalText('');
  };

  // proPic upload component
  const proPicUplaodProps = {
    name: 'profileImage',
    multiple: false,
    beforeUpload: (file) => {
      setProfileImage(file);
      return false; // Prevent upload
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },

  };

  // CoverPic upload component
  const coverPicUplaodProps = {
    name: 'profileImage',
    multiple: false,
    beforeUpload: (file) => {
      setCoverImage(file);
      return false; // Prevent upload
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },

  };

  //Validate the login
  useVerifyLoginState()

  useEffect(() => {
    fetchUserData(); //Get all user data 
  }, [])

  const fetchUserData = async () => {
    // Fetch user data from the server
    try {
      setLoadingScreen(true)
      const res = await axiosInstance.get(`/user/allDetails/${id}`)

      if (res?.status === 200) {
        setUserData(res?.data)
        setLoadingScreen(false)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlelogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  }

  const togglePanel = (panelProp) => {
    switch (panelProp) {
      case "training":
        setPanel("training");
        break;
      case "performance":
        setPanel("performance");
        break;
      case "achievements":
        setPanel("achievements");
        break;
      case "billings":
        setPanel("billings");
        break;
      case "customize":
        setPanel("customize");
        break;
      case "settings":
        setPanel("settings");
        break;

      default:
        setPanel("training");
        break;
    }
  }

  const handleUpdateUserName = (e) => {
    setUpdatedUserName(e.target.value)
  }

  return (
    <div className='la-container flex relative'>
      <div className={`absolute flex justify-center items-center z-50 w-full h-screen  ${loadingScreen === true ? 'block' : 'hidden'} bg-white`}>
        <div className='flex flex-col items-center justify-center'>
          <h2>Hang on. We are getting things ready for you.</h2>
          <p>(For Devs: if you're seeing this that means backend is not running and data fetching has failed)</p>
          <div className="custom-loader mt-[50px]"></div>
        </div>
      </div>
      <div className='w-[360px] h-screen primary-color-bg z-10 flex flex-col justify-between'>

        <div className='flex items-center justify-start px-2 py-2'>
          <div className='w-[50px] h-[50px] mr-2'>
            <img src={logo} alt='LexAyudha logo' />
          </div>
          <h2 className="h-fit m-0">LexAyudha</h2>
        </div>
        <div className='flex flex-col items-center h-[calc(100%-90px)] justify-between'>
          <div className='w-full flex flex-col items-center'>
            <div className='relative w-fit '>
              <div className='w-[150px] h-[150px] rounded-full shadow-[0px_0px_5px_1px_rgba(0,_0,_0,_0.1)] overflow-hidden'>
                <i className="fas fa-pencil-alt rounded-full p-1.5 primary-color-bg main-border-color shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] border-2 absolute right-1 bottom-1 z-20 cursor-pointer" onClick={showProPicModal}></i>
                <Image src={userData.proPic ? userData.proPic : ''} alt='profile picture' />
              </div>
            </div>
            <div className='flex flex-col items-center justify-between w-full'>
              <div className='flex items-center group cursor-pointer w-full justify-center'>
                <h2 className='mb-0.8 text-center'>{userData?.userName}</h2>
                <i className="fas fa-pencil-alt ml-5 mt-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={showUNModal}></i>
              </div>
              <div className="flex">
                <h4 className="m-0 text-gray-500">{userData?.email}</h4>
              </div>
            </div>
          </div>
          <div className="w-full h-full mt-[32px] flex flex-col justify-between ">
            <div className="flex flex-col items-start mb-5 w-full">
              <div
                className={`pl-4 flex flex-row items-center py-2 cursor-pointer w-full ${
                  panel === "training" ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
                onClick={() => togglePanel("training")}
              >
                <i className="fas fa-chalkboard-user mr-2"></i>
                <p className="m-0 pl-2">Training</p>
              </div>
              <div
                className={`pl-4 flex flex-row items-center py-2 cursor-pointer w-full ${
                  panel === "performance" ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
                onClick={() => togglePanel("performance")}
              >
                <i className="fas fa-chart-column mr-2"></i>
                <p className="m-0 pl-2">Performance Records</p>
              </div>
              <div
                className={`pl-4 flex flex-row items-center py-2 cursor-pointer w-full ${
                  panel === "achievements" ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
                onClick={() => togglePanel("achievements")}
              >
                <i className="fas fa-trophy mr-2"></i>
                <p className="m-0 pl-2">Achievements</p>
              </div>
              <div
                className={`pl-4 flex flex-row items-center py-2 cursor-pointer w-full ${
                  panel === "billings" ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
                onClick={() => togglePanel("billings")}
              >
                <i className="fas fa-wallet mr-2"></i>
                <p className="m-0 pl-2">Billings</p>
              </div>
              <div
                className={`pl-4 flex flex-row items-center py-2 cursor-pointer w-full ${
                  panel === "customize" ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
                onClick={() => togglePanel("customize")}
              >
                <i className="fas fa-pen-ruler mr-2"></i>
                <p className="m-0 pl-2">Customize Lessons</p>
              </div>
              <div
                className={`pl-4 flex flex-row items-center py-2 cursor-pointer w-full ${
                  panel === "settings" ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
                onClick={() => togglePanel("settings")}
              >
                <i className="fas fa-cog mr-2"></i>
                <p className="m-0 pl-2">Settings</p>
              </div>
            </div>
            <div className="py-[20px]">
              <div
                className="flex w-full justify-center  flex-row items-center text-red-500 self-center py-2 cursor-pointer"
                onClick={handlelogout}
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                <p className="m-0">Logout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=' w-full relative bg-gray-200 flex flex-col items-center justify-center'>
        <div className='w-full h-[320px] z-[0] group relative'>
          <img src={userData.coverPic ? userData.coverPic : ''} className='w-full h-full object-cover' alt='cover picture' />
          <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center'>
            <button className='border border-white text-white px-4 py-2 rounded-md' onClick={showCoverPicModal}>Change Cover</button>
          </div>
        </div>
        <div className='w-full p-[14px] h-[calc(100vh-320px)] flex items-center justify-center'>
          <div className='primary-color-bg w-full h-full  bottom-0 px-10 py-5 z-[5]   rounded-md '>
            {panel === 'training' && (
              <DashTraining userData={userData} />
            )}
            {panel === 'performance' && (
              <DashPerformance />
            )}
            {panel === 'achievements' && (
              <DashAchievements />
            )}
            {panel === 'billings' && (
              <DashBilling />
            )}
            {panel === 'customize' && (
              <DashCustomize />
            )}
            {panel === 'settings' && (
              <DashSettings />
            )}
          </div>
        </div>
      </div>

      {/* ProPic Model */}
      <Modal
        title="Upload new profile picture"
        centered={true}
        open={proPicOpen}
        onOk={handleOk}
        confirmLoading={confirmProPicLoading}
        onCancel={handleCancel}
      >
        <Dragger {...proPicUplaodProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag image to this area to upload</p>
          <p className="ant-upload-hint">
            Image size should be less than 5mb. Only .png, .jpg, .jpeg, and .gif files are allowed.
          </p>
        </Dragger>
        <p>{proPicModalText}</p>
      </Modal>

      {/* coverPic Model */}
      <Modal
        title="Upload new cover picture"
        centered={true}
        open={coverPicOpen}
        onOk={handleCoverOk}
        confirmLoading={confirmCoverPicLoading}
        onCancel={handleCoverCancel}
      >
        <Dragger {...coverPicUplaodProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag image to this area to upload</p>
          <p className="ant-upload-hint">
            Image size should be less than 5mb. Only .png, .jpg, .jpeg, and .gif files are allowed.
          </p>
        </Dragger>
        <p>{coverPicModalText}</p>
      </Modal>

      {/* Change user name modal */}
      <Modal
        title="Please enter a new user name"
        centered={true}
        open={UNOpen}
        onOk={handleUNOk}
        confirmLoading={confirmUNLoading}
        onCancel={handleUNCancel}
      >
        <input type='text' placeholder='Enter new name' value={updatedUserName} onChange={handleUpdateUserName} />
        <p>{UNModalText}</p>
      </Modal>
    </div>
  );
}
