import Image from "next/image";
import { connectDB } from "./lib/connectDB";
import Link from "next/link";

const Page = async () => {
  await connectDB();

  return (
    <div className="flex flex-col lg:flex-row h-[100vh]  ">
      <div className="flex flex-col justify-center items-start lg:items-center w-full lg:min-w-[500px] z-10 bg-transparent lg:bg-white custom-absolute">
        {/* Logo */}
        <div className="welcome-logo absolute top-[25px] left-[25px]">
          <Image
            src="/images/welcome_image/blackwelcomelogo.png"
            alt="welcome"
            height={40}
            width={50}
            className="w- hidden lg:block w-[40px] h-[40px]"
          />
          <Image
            src="/images/welcome_image/whitewelcomelogo.png"
            alt="welcome"
            height={40}
            width={50}
            className="w-[40px] h-[40px] fixed top-[25px] left-[25px] z-20 lg:hidden"
          />
        </div>

        {/*  Content */}
        <div className="text-start mt-0 lg:px-0 welcome-content w-auto lg:w-[80%]">
          <h1 className="welcome-heading text-[40px] lg:text-[35px] font-bold text-white lg:text-black">
            Welcome to Olympiah
          </h1>
          <p className="welcome-line text-[1.7rem] sm:text-[2rem] lg:text-[1.5rem] mb-8 text-white lg:text-black">
            Your space for wellness, your way. Move with us.
          </p>

          {/* Buttons */}

          <div className="flex flex-row justify-start space-x-4 mb-4 w-full ">
            <Link href="/register" className="w-full">
              <button
                className="bg-white lg:bg-black text-black lg:text-white py-[10px] rounded-md text-lg w-full
      px-8 md:px-12 lg:px-13"
              >
                Sign Up
              </button>
            </Link>

            <Link href="/login" className="w-full">
              <button
                className="border-2 border-white lg:border-black text-white lg:text-black py-2 rounded-md text-lg w-full
      px-8 md:px-12 lg:px-13"
              >
                Log In
              </button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="absolute bottom-8 left-8 text-black hidden lg:block">
          &copy; 2024 Olympiah
        </p>
      </div>

      {/* Right Section - Video */}
      <div className="lg:w-[100%] h-screen relative">
        <video className="w-full h-full object-cover" autoPlay loop muted>
          <source
            src="https://res.cloudinary.com/dbqyagrzd/video/upload/v1726401024/file_ko4vzt.mp4"
            type="video/mp4"
          />
        </video>
        {/* Overlay for tablet and mobile screens only */}
        <div className="absolute inset-0 bg-[#00000033] bg-opacity-50 md:block lg:hidden"></div>
      </div>
    </div>
  );
};

export default Page;
