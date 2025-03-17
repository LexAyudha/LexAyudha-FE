import React, { useEffect, useState } from 'react';

const ThankYouPopUp = ({
    message = "Thank you for completing the speech calibration.",
    redirectMessage = "You will be redirected to the training selection menu momentarily.",
    redirectDelay = 5,
    redirectUrl = "/training-selection",
    onRedirect = null,
    title = "Thank You!"
}) => {
    const [countdown, setCountdown] = useState(redirectDelay);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount <= 1) {
                    clearInterval(timer);

                    // Handle redirect - either with provided function or default URL redirect
                    if (onRedirect && typeof onRedirect === 'function') {
                        onRedirect();
                    } else if (redirectUrl) {
                        window.location.href = redirectUrl;
                    }
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onRedirect, redirectUrl]);

    return (
        <div className='flex items-center absolute z-50 justify-center w-screen h-screen bg-black bg-opacity-60'>
            <div className="flex flex-col absolute  items-center justify-center p-4 primary-color-bg rounded-lg shadow-md max-w-md mx-auto text-center">


                <h2 className="text-2xl font-semibold  mb-3">
                    {title}
                </h2>
                <div className="mb-4">
                    <svg
                        className="w-16 h-16  mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                </div>
                <p className=" mb-2">
                    {message}
                </p>

                <p className=" mb-6">
                    {redirectMessage}
                </p>

                <div className="inline-block px-4 py-2 bg-[var(--background-color)] rounded-full text-sm ">
                    Redirecting in {countdown} seconds...
                </div>
            </div>
        </div>

    );
};

export default ThankYouPopUp;