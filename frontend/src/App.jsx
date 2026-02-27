import { Link, Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import { useHelper } from "./hooks/useHelper";
import { setTokenInvalidCallback } from "./api/api";
import { useEffect, useState } from "react";
import {
  ArrowLeftFromLine,
  Bell,
  Calendar,
  ChartColumnDecreasing,
  ChevronDown,
  ChevronUp,
  CircleCheckBig,
  CircleUserRound,
  Folder,
  House,
  ListTodo,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";
import ToasterNotif from "./components/Toaster";
import NotificationBell from "./components/NotificationBell";
import { useNotifications } from "./hooks/useNotifications";

function App() {
  const {
    isAuthenticated,
    logout,
    isTokenValid,
    markTokenInvalid,
    formattedDateTime,
  } = useHelper();
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState({});

  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSidebar(false);
        setOpen(false);
      } else {
        setSidebar(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setTokenInvalidCallback(markTokenInvalid);
  }, []);

  useEffect(() => {
    if (isTokenValid === false) {
      logout();
      navigate("/login");
    }
  }, [isTokenValid, logout, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (isTokenValid === null) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="w-7 h-7 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const logoutSubmit = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  return (
    <main className="w-screen h-screen flex text-gray-700">
      <aside
        className="relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden shrink-0"
        style={{ width: sidebar ? "300px" : "56px" }}
      >
        {/* Header */}
        <div className="flex items-center h-14 px-3 border-b border-gray-200 shrink-0">
          {sidebar ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 overflow-hidden">
                <CircleUserRound size={28} className="shrink-0 text-gray-700" />
                <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                  Welcome!
                </span>
              </div>
              <button
                onClick={() => {
                  setSidebar(false);
                  setOpen(false);
                }}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftFromLine size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSidebar(true)}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors mx-auto"
            >
              <Menu size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <div className="flex flex-col flex-1 justify-between py-4 overflow-hidden">
          <div
            className="flex flex-col gap-6 px-2 overflow-y-auto overflow-hidden"
            style={{ scrollbarGutter: "stable" }}
          >
            {/* Section 1 */}
            <div className="flex flex-col gap-1">
              {sidebar && (
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 mb-1">
                  Main
                </span>
              )}
              <div className={`${sidebar ? "mx-5" : ""} flex flex-col gap-3`}>
                <Link
                  to={"/"}
                  className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors group"
                >
                  <House
                    size={17}
                    className="shrink-0 text-gray-500 group-hover:text-gray-700 transition-colors"
                  />
                  {sidebar && (
                    <span className="whitespace-nowrap font-medium">
                      Dashboard
                    </span>
                  )}
                </Link>

                <Link
                  to={"/projects"}
                  className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors group"
                >
                  <Folder
                    size={17}
                    className="shrink-0 text-gray-500 group-hover:text-gray-700 transition-colors"
                  />
                  {sidebar && (
                    <span className="whitespace-nowrap font-medium">
                      Projects
                    </span>
                  )}
                </Link>
                <button className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors group">
                  <Calendar
                    size={17}
                    className="shrink-0 text-gray-500 group-hover:text-gray-700 transition-colors"
                  />
                  {sidebar && (
                    <span className="whitespace-nowrap font-medium">
                      Calendar
                    </span>
                  )}
                </button>
                <div className="flex flex-col  gap-3 w-full px-2 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors group">
                  <div
                    onClick={() => {
                      setSidebar(true);
                      setOpen(!open);
                    }}
                    className="flex items-center gap-3 justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Bell
                          size={17}
                          className="shrink-0 text-gray-500 group-hover:text-gray-700 transition-colors"
                        />

                        {!sidebar && unreadCount > 0 && (
                          <span className="absolute bg-red-500 text-white rounded-full w-[15px] h-[15px] bottom-2 left-2 flex text-[10px] items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      {sidebar && (
                        <div className="relative flex justify-between items-center">
                          <span className="whitespace-nowrap font-medium">
                            Notifications
                          </span>

                          {unreadCount > 0 && (
                            <span className="absolute bg-red-500 text-white rounded-full w-[15px] h-[15px] bottom-2 left-21 flex text-[10px] items-center justify-center">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {open && (
                  <div className="transition">
                    {unreadCount > 0 && (
                      <div
                        onClick={markAllRead}
                        className="flex justify-center mb-2 border border-gray-300 text-gray-700 rounded-md p-2 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all"
                      >
                        <button className="text-xs flex gap-1 items-center font-semibold">
                          <CircleCheckBig size={15} />
                          Mark all read
                        </button>
                      </div>
                    )}

                    {notifications.length === 0 ? (
                      <p className="flex justify-center p-5 items-center text-gray-700 font-semibold">
                        No notifications
                      </p>
                    ) : (
                      <ul className="">
                        {notifications.map((n) => (
                          <li
                            key={n.id}
                            onClick={() => markRead(n.id)}
                            className="p-2 flex gap-2 items-center hover:bg-slate-100 rounded"
                          >
                            <div>
                              {!n.is_read ? (
                                <div className="bg-blue-500 h-[10px] w-[10px] rounded-full"></div>
                              ) : (
                                <div className="bg-gray-500 h-[10px] w-[10px] rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-700">
                                {n.message}
                              </p>
                              <small className="text-gray-400 text-xs">
                                {formattedDateTime(n.created_at)}
                              </small>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <button className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors group">
                  <ChartColumnDecreasing
                    size={17}
                    className="shrink-0 text-gray-500 group-hover:text-gray-700 transition-colors"
                  />
                  {sidebar && (
                    <span className="whitespace-nowrap font-medium">
                      Analytics
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Section 2 */}
            <div className="flex flex-col gap-1">
              {sidebar && (
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 mb-1">
                  System
                </span>
              )}
              <div className={`${sidebar ? "mx-5" : ""} flex flex-col gap-3`}>
                <button className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors group">
                  <Settings
                    size={17}
                    className="shrink-0 text-gray-500 group-hover:text-gray-700 transition-colors"
                  />
                  {sidebar && (
                    <span className="whitespace-nowrap font-medium">
                      Settings
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="px-2">
            <button
              onClick={logoutSubmit}
              className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={17} className="shrink-0" />
              {sidebar && (
                <span className="whitespace-nowrap font-medium">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      <section className="flex-1 overflow-auto p-2 sm:p-10 text-sm">
        <Outlet />
      </section>

      <ToasterNotif />
    </main>
  );
}

export default App;
