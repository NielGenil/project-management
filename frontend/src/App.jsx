import { useNavigate } from "react-router-dom";
import "./App.css";
import { useHelper } from "./hooks/useHelper";
import { setTokenInvalidCallback } from "./api/api";
import { useEffect, useState } from "react";
import {
  ArrowLeftFromLine,
  Bell,
  Calendar,
  ChartColumnDecreasing,
  CircleUserRound,
  House,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";

function App() {
  const { isAuthenticated, logout, isTokenValid, markTokenInvalid } =
    useHelper();
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);

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
    <main className="w-screen h-screen flex">
      <aside
        className="relative flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out overflow-hidden shrink-0"
        style={{ width: sidebar ? "240px" : "56px" }}
      >
        {/* Header */}
        <div className="flex items-center h-14 px-3 border-b border-gray-100 shrink-0">
          {sidebar ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 overflow-hidden">
                <CircleUserRound size={28} className="shrink-0 text-gray-700" />
                <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                  Welcome!
                </span>
              </div>
              <button
                onClick={() => setSidebar(false)}
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
          <div className="flex flex-col gap-6 px-2">
            {/* Section 1 */}
            <div className="flex flex-col gap-1">
              {sidebar && (
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 mb-1">
                  Main
                </span>
              )}
              <button className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors group">
                <House
                  size={17}
                  className="shrink-0 text-gray-500 group-hover:text-gray-700 transition-colors"
                />
                {sidebar && (
                  <span className="whitespace-nowrap font-medium">
                    Dashboard
                  </span>
                )}
              </button>
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
              <button className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors group">
                <Bell
                  size={17}
                  className="shrink-0 text-gray-500 group-hover:text-gray-700 transition-colors"
                />
                {sidebar && (
                  <span className="whitespace-nowrap font-medium">
                    Notifications
                  </span>
                )}
              </button>
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

            {/* Section 2 */}
            <div className="flex flex-col gap-1">
              {sidebar && (
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 mb-1">
                  System
                </span>
              )}
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

      <section className="flex-1 overflow-auto" />
    </main>
  );
}

export default App;
