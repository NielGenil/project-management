import { useMutation, useQuery } from "@tanstack/react-query";
import {
  FolderOpen,
  Mails,
  UserRoundCog,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import { useHelper } from "../hooks/useHelper";
import { changePasswordAPI, inviteUserAPI } from "../api/api";
import toast from "react-hot-toast";
import { getCurrentUserAPI, updateCurrentUserAPI } from "../api/projectAPI";

export default function SettingsPage() {
  const { token } = useHelper();
  const formRef = useRef(null);
  const updateUserRef = useRef(null);
  const emailRef = useRef(null);
  const changePasswordRef = useRef(null);
  const [settingsDisplay, setSettingsDisplay] = useState("account-settings");
  const [updateUserModal, setUpdateUserModal] = useState(false);
  const [inviteUserModal, setInviteUserModal] = useState(false);

  const { data: userData } = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getCurrentUserAPI(token),
  });

  const { mutate: update } = useMutation({
    mutationFn: (formData) => updateCurrentUserAPI(token, formData),
    onSuccess: () => {
      toast.success("User details updated successfully.");
      setUpdateUserModal(false);
    },
    onError: () => {
      toast.error("Failed to update user details. Please try again.");
    },
  });

  const { mutate: invite, isPending } = useMutation({
    mutationFn: (formData) => inviteUserAPI(token, formData),
    onSuccess: () => {
      toast.success("Invitation sent successfully");
      setInviteUserModal(false);
      formRef.current.reset();
    },
    onError: () => {
      toast.error(
        "Invitation failed to send. Check if the user is already a member.",
      );
    },
  });

  const { mutate: changePassword, isPending: isChangePassword } = useMutation({
    mutationFn: (data) => changePasswordAPI(token, data),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      changePasswordRef.current.reset();
    },
    onError: (err) => {
      toast.error(err?.old_password || "Error changing password!");
    },
  });

  const submitChangePassword = (e) => {
    e.preventDefault();

    const form = changePasswordRef.current;
    const old_password = form.old_password.value;
    const new_password = form.new_password.value;
    const confirm_password = form.confirm_password.value;

    if (new_password !== confirm_password) {
      toast.error("Passwords do not match!");
      return;
    }

    changePassword({ old_password, new_password });
  };

  const updateUser = (e) => {
    e.preventDefault();
    const formData = new FormData(updateUserRef.current);
    update(formData);
  };

const inviteUser = (e) => {
  e.preventDefault();
  const formData = new FormData(formRef.current);
  invite(formData);
};


  return (
    <main className="w-full h-full text-xs sm:text-sm flex flex-col sm:flex-row gap-4 overflow-hidden overflow-y-auto p-2 sm:py-10  sm:pl-20 sm:pr-10">
      <div className="border border-gray-300 sm:max-w-[500px] w-full rounded-md sm:p-7 p-2 py-4 flex flex-col gap-4">
        <div className="flex justify-between w-full">
          <h1 className="font-semibold text-lg">System Settings</h1>
        </div>

        <div
          className="overflow-y-auto w-full h-full flex flex-col gap-4"
          style={{ scrollbarGutter: "stable" }}
        >
          <div
            onClick={() => setSettingsDisplay("account-settings")}
            className={`flex gap-2 items-center p-2 rounded ${settingsDisplay === "account-settings" ? "bg-blue-500 text-white" : ""}`}
          >
            <UserRoundCog className="sm:w-5 sm:h-5 w-4 h-4" />
            <p>Account Settings</p>
          </div>
          <div
            onClick={() => setSettingsDisplay("add-user")}
            className={`flex gap-2 items-center p-2 rounded ${settingsDisplay === "add-user" ? "bg-blue-500 text-white" : ""}`}
          >
            <Mails className="sm:w-5 sm:h-5 w-4 h-4" />
            <p>Invite User</p>
          </div>
        </div>
      </div>
      {settingsDisplay === "account-settings" && (
        <div className="border border-gray-300 w-full rounded-md sm:p-7 p-2 py-4 flex flex-col gap-4">
          <div>
            <h1 className="font-semibold text-lg flex gap-2 items-center">
              <UserRoundPlus className="sm:w-5 sm:h-5 w-4 h-4" /> Account
              Settings
            </h1>
            <p className="text-gray-500">
              Below is you account details, you change and update you account
              details.
            </p>
          </div>

          <form
            ref={updateUserRef}
            onSubmit={updateUser}
            className="w-full flex flex-col sm:gap-4 gap-2"
          >
            <h1 className="font-semibold text-base flex gap-2 items-center">
              Account Details
            </h1>
            <div className="flex flex-col flex-wrap gap-2 sm:gap-4 sm:flex-row sm:justify-between">
              <div className="flex-1">
                <h1 className="font-semibold text-gray-700">First name</h1>
                <input
                  type="text"
                  name="first_name"
                  className="p-2 border-gray-300 border rounded-md w-full"
                  defaultValue={userData?.first_name}
                />
              </div>
              <div className="flex-1">
                <h1 className="font-semibold text-gray-700">Last name</h1>
                <input
                  type="text"
                  name="last_name"
                  className="p-2 border-gray-300 border rounded-md w-full"
                  defaultValue={userData?.last_name}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row sm:justify-between">
              <div className="flex-1">
                <h1 className="font-semibold text-gray-700">Username</h1>
                <input
                  type="text"
                  name="username"
                  className="p-2 border-gray-300 border rounded-md w-full"
                  defaultValue={userData?.username}
                />
              </div>
              <div className="flex-1">
                <h1 className="font-semibold text-gray-700">Email</h1>
                <input
                  type="text"
                  className="p-2 border-gray-300 border rounded-md w-full"
                  defaultValue={userData?.email}
                  disabled
                />
              </div>
            </div>
            <div className="w-full flex flex-row-reverse">
              <button
                type="button"
                onClick={() => setUpdateUserModal(true)}
                className="py-2 px-7 text-white rounded-md bg-blue-500"
              >
                Save Change
              </button>
            </div>

            {updateUserModal && (
              <main className="fixed z-50 bg-black/20 inset-0 flex justify-center items-center p-4">
                <div className="bg-white p-4 rounded-md shadow-2xl w-full max-w-md">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="font-bold sm:text-xl text-lg">
                      Update Information
                    </h1>
                  </div>

                  <div className="w-full flex flex-col gap-5">
                    <div className="flex flex-col gap-4 my-4">
                      <p>Are you sure you want to update your info? </p>
                    </div>

                    <div className="flex flex-row-reverse gap-2">
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 py-2 px-4 border text-white rounded-md bg-blue-500"
                      >
                        Yes
                      </button>

                      <button
                        type="button"
                        className="py-2 px-4 border rounded-md border-gray-300"
                        onClick={() => setUpdateUserModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            )}
          </form>

          <form
            ref={changePasswordRef}
            onSubmit={submitChangePassword}
            className="w-full flex flex-col sm:gap-4 gap-2"
          >
            <h1 className="font-semibold text-base flex gap-2 items-center">
              Change Password
            </h1>
            <div className="flex flex-col flex-wrap gap-2 sm:gap-4 sm:flex-row sm:justify-between">
              {/* New Password */}
              <div className="flex-1">
                <h1  className="font-semibold text-gray-700">
                  New Password
                </h1>
                <input
                  type="password"
                  name="new_password"
                  required
                  className="p-2 border-gray-300 border rounded-md w-full"
                />
              </div>

              {/* Confirm Password */}
              <div className="flex-1">
                <h1  className="font-semibold text-gray-700">
                  Confirm Password
                </h1>
                <input
                  type="password"
                  name="confirm_password"
                  required
                  className="p-2 border-gray-300 border rounded-md w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row sm:justify-between">
              <div className="flex-1">
                {/* Current Password */}
                <div className="flex flex-col gap-1">
                  <h1 className="font-semibold text-gray-700">
                    Current Password
                  </h1>
                  <input
                    type="password"
                    name="old_password"
                    required
                    className="p-2 border-gray-300 border rounded-md w-full"
                  />
                </div>
              </div>
              <div className="flex-1"></div>
            </div>
            <div className="w-full flex flex-row-reverse">
              <button
                type="submit"
                className={`flex items-center justify-center gap-2 py-2 px-4 border text-white rounded-md ${isChangePassword ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500"}`}
                disabled={isPending}
              >
                {isChangePassword && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {isChangePassword ? "Please wait..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      )}

      {settingsDisplay === "add-user" && (
        <form
        ref={formRef}
          onSubmit={inviteUser}
          className="border border-gray-300 w-full rounded-md sm:p-7 p-2 py-4 flex flex-col gap-4"
        >
          <div>
            <h1 className="font-semibold text-lg flex gap-2 items-center">
              <UserRoundPlus className="sm:w-5 sm:h-5 w-4 h-4" /> Invite a User
            </h1>
            <p className="text-gray-500">
              Please enter the user's email address to send an invitation to
              join the project management system.
            </p>
          </div>

          <div className="flex gap-2 flex-col sm:flex-row gap-2">
            <input
              type="email"
              name="email"
              ref={emailRef}
              className="p-2 border-gray-300 border rounded-md w-full"
              placeholder="Enter email"
            />
            <button
              type="button"
              className="flex gap-1 font-semibold bg-green-600 text-white rounded-md p-2 px-4"
              onClick={() => {
                const emailValue = emailRef.current?.value.trim();

                if (!emailValue) return;

                if (!emailValue.includes("@")) {
                  toast.error("Please enter a valid email!");
                  return;
                }
                setInviteUserModal(true);
              }}
            >
              <span>Invite</span> <span>User</span>
            </button>
          </div>
          {inviteUserModal && (
            <main className="fixed z-50 bg-black/20 inset-0 flex justify-center items-center p-4">
              <div className="bg-white p-4 rounded-md shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h1 className="font-bold sm:text-xl text-lg">Invite User</h1>
                </div>

                <div className="w-full flex flex-col gap-5">
                  <div className="flex flex-col gap-4 my-4">
                    <p>Are you sure you want to invite this user? </p>
                  </div>

                  <div className="flex flex-row-reverse gap-2">
                    <button
                      type="submit"
                      className={`flex items-center justify-center gap-2 py-2 px-4 border text-white rounded-md ${isPending ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500"}`}
                      disabled={isPending}
                    >
                      {isPending && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {isPending ? "Please wait..." : "Yes"}
                    </button>

                    <button
                      type="button"
                      className={`py-2 px-4 border rounded-md ${isPending ? "bg-gray-300 text-white cursor-not-allowed" : "border-gray-300"}`}
                      onClick={() => setInviteUserModal(false)}
                      disabled={isPending}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </main>
          )}
        </form>
      )}
    </main>
  );
}
