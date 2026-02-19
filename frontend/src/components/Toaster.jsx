import { Toaster } from "react-hot-toast";
export default function ToasterNotif() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "8px",
          padding: "12px 16px",
          display: "flex",

          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minWidth: "200px",
        },
        success: {
          style: {
            background: "#16a34a",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#16a34a",
          },
        },
        error: {
          style: {
            background: "#dc2626",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#dc2626",
          },
        },
      }}
    />
  );
}
