import { Toaster } from "react-hot-toast";
export default function ToasterNotif() {
  return (
<Toaster
  position="top-center"
  toastOptions={{
    duration: 4000,
    className: "!bg-[#333] !text-white !rounded-lg !px-4 !py-3 !flex !items-center !justify-center !text-center !min-w-[200px]",
    success: {
      className: "!bg-green-600 !text-white !flex !items-center !justify-center !text-center text-xs sm:text-sm",
      iconTheme: {
        primary: "#fff",
        secondary: "#16a34a",
      },
    },
    error: {
      className: "!bg-red-600 !text-white !flex !items-center !justify-center !text-center text-xs sm:text-sm",
      iconTheme: {
        primary: "#fff",
        secondary: "#dc2626",
      },
    },
  }}
/>

  );
}
