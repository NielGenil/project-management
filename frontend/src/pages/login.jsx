import { LockKeyhole, Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../api/api";
import Cookies from "js-cookie";
import { useHelper } from "../hooks/useHelper";
import toast from "react-hot-toast";
import ToasterNotif from "../components/Toaster";

function LoginPage() {
  const loginRef = useRef();
  const navigate = useNavigate();
  const { isAuthenticated } = useHelper();

  const { mutate: login, isPending } = useMutation({
    mutationFn: (loginData) => loginAPI(loginData),

    onSuccess: (data) => {
      console.log("Success", data);
      Cookies.set("access", data.access, { secure: false, sameSite: "Lax" });
      Cookies.set("refresh", data.refresh, {
        secure: false,
        sameSite: "Lax",
      });
      navigate("/");
    },

    onError: (error) => {
      toast.error(error.detail);
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, []);

  if (isAuthenticated) {
    return null;
  }

  const loginSubmit = (e) => {
    e.preventDefault();

    const loginData = new FormData(loginRef.current);
    login(loginData);
  };

  return (
    <main className="flex w-screen h-screen justify-center items-center p-2 sm:p-0 bg-gray-100">
      <div className="bg-white flex shadow-lg sm:h-[60vh] sm:w-[60vw]">
        {/* SECTION 1 */}
        <div className=" flex flex-1 bg-[url('/image/bg.png')] bg-cover bg-center items-center text-white"></div>

        {/* SECTION 2 */}
        <form
          ref={loginRef}
          onSubmit={loginSubmit}
          className="flex flex-col lg:max-w-[400px] sm:py-20 p-7 gap-6 justify-between items-center w-full text-xs sm:text-sm"
        >
          <section className="flex flex-col gap-2 w-full">
            <h1 className="text-gray-800 font-semibold sm:text-2xl text-xl">
              Login
            </h1>

            <p className="text-gray-500 max-w-md leading-relaxed">
              Organize your work, stay on schedule, and collaborate with your
              team in one unified workspace.
            </p>
          </section>

          <section className="flex flex-col gap-4 w-full">
            <div className="flex gap-2 flex-col">
              <div className="flex gap-2 text-gray-500 font-semibold items-center">
                <p className="text-xs">E-MAIL</p>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700">
                  <Mail size={18} className="text-blue-500" />
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your emial"
                  className="border border-gray-300 p-2 rounded-sm w-full pl-10 focus:outline-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <div className="flex gap-2 flex-col">
                <div className="flex gap-2 text-gray-500 font-semibold items-center">
                  <p className="text-xs">PASSWORD</p>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700">
                    <LockKeyhole size={18} className="text-blue-500" />
                  </span>

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="border border-gray-300 p-2 rounded-sm w-full pl-10 focus:outline-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-row-reverse">
                <p className="text-blue-400">Forgot password?</p>
              </div>
            </div>
            <section className="flex justify-center items-center w-full">
              <button
                className={`text-white px-4 py-3 flex gap-2 items-center justify-center rounded w-full ${isPending ? "bg-gray-300 " : "bg-blue-500 "}`}
                type="submit"
                disabled={isPending}
              >
                {isPending && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {isPending ? "Logging in..." : "Login"}
              </button>
            </section>
          </section>
        </form>
      </div>
      <ToasterNotif />
    </main>
  );
}

export default LoginPage;
