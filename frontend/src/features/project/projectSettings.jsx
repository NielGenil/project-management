import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clipboard, Plus, Settings, Trash, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addProjectMemberAPI,
  deleteProjectAPI,
  editProjectDataAPI,
  getAllUserAPI,
  getProjectDataAPI,
  getProjectStatusAPI,
} from "../../api/projectAPI";
import { useHelper } from "../../hooks/useHelper";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function ProjectSettings() {
  const { projectId } = useParams();
  const { token } = useHelper();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const editProjectRef = useRef();
  const addMemberRef = useRef();
  const removeMemberRef = useRef();

  const [addUserModal, setAddUserModal] = useState(false);
  const [removeUserModal, setRemoveUserModal] = useState(false);
  const [removeUserId, setRemoveUserId] = useState(null);

  const [deleteProjectModal, setDeleteProjectModal] = useState(false);

  const { data: project } = useQuery({
    queryKey: ["project-data"],
    queryFn: () => getProjectDataAPI(token, projectId),
  });

  const { data: projectStatus } = useQuery({
    queryKey: ["project-status"],
    queryFn: () => getProjectStatusAPI(token),
  });

  const { data: userList } = useQuery({
    queryKey: ["user-list"],
    queryFn: () => getAllUserAPI(token),
  });

  const { mutate: editProject } = useMutation({
    mutationFn: ({ formData, projectId }) =>
      editProjectDataAPI(token, formData, projectId),
    onSuccess: () => {
      toast.success("Project edited successfull!");
    },
    onError: (err) => {
      toast.error("Failed to edit project. Please try again.");
      console.error(err);
    },
  });

  const { mutate: addProjectMember } = useMutation({
    mutationFn: ({ data, projectId }) =>
      addProjectMemberAPI(token, data, projectId),
    onSuccess: () => {
      toast.success("User added successfully!");
      queryClient.invalidateQueries(["project-data"]);
      setAddUserModal(false);
    },
    onError: (err) => {
      toast.error("Failed to add user. Please try again.");
      console.error(err);
    },
  });

  const { mutate: removeProjectMember } = useMutation({
    mutationFn: ({ data, projectId }) =>
      addProjectMemberAPI(token, data, projectId),
    onSuccess: () => {
      toast.success("User removed successfully!");
      queryClient.invalidateQueries(["project-data"]);
      setRemoveUserModal(false);
      setRemoveUserId(null);
    },
    onError: (err) => {
      toast.error("Failed to remove user. Please try again.");
      console.error(err);
    },
  });

  const { mutate: deleteProjectData } = useMutation({
    mutationFn: (projectId) => deleteProjectAPI(token, projectId),
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      setDeleteProjectModal(false);
      navigate("/projects")
    },
    onError: (err) => {
      toast.error("Failed to delete project. Please try again.");
      console.error(err);
    },
  });

  const updateProject = (e) => {
    e.preventDefault();

    const formData = new FormData(editProjectRef.current);
  
    editProject({ formData, projectId });
  };

  const addMember = (e) => {
    e.preventDefault();

    const select = addMemberRef.current.querySelector(
      'select[name="project_members"]',
    );
    const selectedIds = Array.from(select.selectedOptions).map((opt) =>
      Number(opt.value),
    );

    if (selectedIds.length === 0) {
      toast.error("Please select at least one member.");
      return;
    }

    const existingIds = project.project_members.map((member) => member.id);
    const mergedIds = [...new Set([...existingIds, ...selectedIds])];

    addProjectMember({ data: { project_members: mergedIds }, projectId });
  };

  const removeMember = (e) => {
    e.preventDefault();

    // Filter out the selected user from existing members
    const updatedIds = project?.project_members
      .map((member) => member.id)
      .filter((id) => id !== removeUserId);



    removeProjectMember({ data: { project_members: updatedIds }, projectId });
  };

  const deleteProject = (e) => {
    e.preventDefault();

    deleteProjectData(projectId);
  };

  if (!project || !project?.project_status) {
    return (
      <main className="">
        <div className="">Loading...</div>
      </main>
    );
  }

  return (
    <main className="w-full h-full">
      <div className="flex sm:justify-between items-center mb-2">
        <div className="flex w-full items-center">
          <button
            onClick={() => navigate(`/project/tasks/${projectId}`)}
            className="flex gap-2 items-center p-1.5 border border-gray-300 border-r-0 rounded-l-md text-gray-700"
          >
            <Clipboard size={18} className="text-gray-700" />
            Task
          </button>
          <button className="flex gap-2 items-center p-1.5 border border-gray-300 rounded-r-md bg-blue-500 text-white">
            <Settings size={18} className="text-white" />
            Settings
          </button>
        </div>
        <div className="flex w-full flex-row-reverse items-center">
          <button
            onClick={() => {
              setDeleteProjectModal(true);
            }}
            className="text-white p-2 sm:p-1.5 bg-red-500 rounded-md flex gap-2 items-center"
          >
            <Trash2 size={18} />{" "}
            <span className="hidden sm:block">Delete Project</span>
          </button>
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-8 ">
        <form
          onSubmit={updateProject}
          ref={editProjectRef}
          className="border border-gray-300 w-full rounded-md p-7 flex flex-col gap-4"
        >
          <div>
            <h1 className="font-semibold text-lg">Project Details</h1>
          </div>
          <div className="flex gap-2 flex-col">
            <h1 className="text-gray-700">Project Name</h1>
            <input
              type="text"
              name="project_name"
              defaultValue={project?.project_name}
              className="p-2 border-gray-300 border rounded-md w-full"
            />
          </div>
          <div className="flex gap-2 flex-col">
            <h1 className="text-gray-700">Project Description</h1>
            <textarea
              type="text"
              name="project_description"
              defaultValue={project?.project_description}
              className="p-2 border-gray-300 border rounded-md w-full"
            />
          </div>
          <div className="flex gap-2 flex-col">
            <h1 className="text-gray-700">Status</h1>
            <select
              name="project_status"
              className="p-2 border-gray-300 border rounded-md w-full"
              required
              defaultValue={project?.project_status}
            >
              <option value="">Set Project Status</option>
              {projectStatus?.statuses?.map(([value]) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between flex-wrap w-full gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <h1 className="text-gray-700">Start</h1>
              <input
                type="date"
                name="project_start"
                defaultValue={project?.project_start}
                className="p-2 border-gray-300 border rounded-md w-full"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <h1 className="text-gray-700">End</h1>
              <input
                type="date"
                name="project_end"
                defaultValue={project?.project_end}
                className="p-2 border-gray-300 border rounded-md w-full"
              />
            </div>
          </div>
          <div className="flex flex-wrap w-full gap-2">
            <h1 className="text-gray-700">Created at :</h1>
            <p>{project?.created_at}</p>
          </div>

          <div className="flex flex-row-reverse">
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md p-2 px-4"
            >
              Save
            </button>
          </div>
        </form>

        <div className="border border-gray-300  w-full rounded-md p-7 flex flex-col gap-4">
          <div className="flex justify-between w-full">
            <h1 className="font-semibold text-lg">Project Members</h1>

            <button
              onClick={() => setAddUserModal(true)}
              className="border border-gray-300 rounded-md p-2"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="overflow-y-auto w-full">
            {project?.project_members
              ?.slice() // copy array to avoid mutating state
              .sort((a, b) => {
                // Team leader first
                if (a.id === project?.created_by?.id) return -1;
                if (b.id === project?.created_by?.id) return 1;

                // Alphabetical sort by username
                return a.username.localeCompare(b.username);
              })
              .map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center mb-2"
                >
                  <p>{user.username}</p>

                  {user.id === project?.created_by?.id && (
                    <p className="p-1 px-4 text-gray-700 flex gap-2 font-semibold border border-gray-300 rounded-md">
                      Team Leader
                    </p>
                  )}

                  {user.id !== project?.created_by?.id && (
                    <Trash2
                      className="bg-red-100 text-red-500 p-1 rounded-md"
                      onClick={() => {
                        setRemoveUserModal(true);
                        setRemoveUserId(user.id);
                      }}
                      size={24}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {addUserModal && (
        <main className="fixed z-50 bg-black/20 inset-0 flex justify-center items-center p-4">
          <div className="bg-white p-4 rounded-md shadow-2xl w-full max-w-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-bold text-xl">Add Members</h1>
            </div>

            <form
              ref={addMemberRef}
              onSubmit={addMember}
              className="w-full flex flex-col gap-5"
            >
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600">
                  Note: Select users to add. If no users are shown, it means all
                  users are already members.
                </p>

                <select
                  name="project_members"
                  className="p-2 border-gray-300 border rounded-md w-full"
                  multiple
                >
                  {userList?.map((user) => {
                    const isMember = project?.project_members?.some(
                      (member) => member.id === user.id,
                    );

                    return (
                      !isMember && (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      )
                    );
                  })}
                </select>
              </div>

              <div className="flex flex-row-reverse gap-2">
                <button
                  type="submit"
                  className="py-2 px-4 border bg-blue-500 text-white rounded-md"
                >
                  Add Member
                </button>
                <button
                  type="button"
                  className="py-2 px-4 border border-gray-300 rounded-md"
                  onClick={() => setAddUserModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      )}

      {removeUserModal && (
        <main className="fixed z-50 bg-black/20 inset-0 flex justify-center items-center p-4">
          <div className="bg-white p-4 rounded-md shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-bold text-xl">Remove User</h1>
            </div>

            <form
              ref={removeMemberRef}
              onSubmit={removeMember}
              className="w-full flex flex-col gap-5"
            >
              <div className="flex flex-col gap-4 my-4">
                <p>Are you sure you want to remove this user? </p>
              </div>

              <div className="flex flex-row-reverse gap-2">
                <button
                  type="submit"
                  className="py-2 px-4 border bg-blue-500 text-white rounded-md"
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="py-2 px-4 border border-gray-300 rounded-md"
                  onClick={() => setRemoveUserModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      )}

      {deleteProjectModal && (
        <main className="fixed z-50 bg-black/20 inset-0 flex justify-center items-center p-4">
          <div className="bg-white p-4 rounded-md shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-bold text-xl">Delete Project</h1>
            </div>

            <form
              onSubmit={deleteProject}
              className="w-full flex flex-col gap-5"
            >
              <div className="flex flex-col gap-4 my-4">
                <p>Are you sure you want to delete this project? </p>
              </div>

              <div className="flex flex-row-reverse gap-2">
                <button
                  type="submit"
                  className="py-2 px-4 border bg-blue-500 text-white rounded-md"
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="py-2 px-4 border border-gray-300 rounded-md"
                  onClick={() => setDeleteProjectModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      )}
    </main>
  );
}
