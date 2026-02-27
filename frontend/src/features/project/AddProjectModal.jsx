import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHelper } from "../../hooks/useHelper";
import {
  getCurrentUserAPI,
  getProjectStatusAPI,
  postProjectAPI,
} from "../../api/projectAPI";
import { useRef } from "react";
import { toast } from "react-hot-toast";

export default function AddProjectModal({ onClose }) {
  const { token } = useHelper();
  const addProjectRef = useRef();
  const queryClient = useQueryClient();

  const { data: projectStatus } = useQuery({
    queryKey: ["project-status"],
    queryFn: () => getProjectStatusAPI(token),
  });

  const { data: user } = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getCurrentUserAPI(token),
  });

  const { mutate: addProject } = useMutation({
    mutationFn: (formData) => postProjectAPI(formData, token),
    onSuccess: () => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries(["project-list"]);
      onClose();
    },
    onError: () => {
      toast.error("Failed to create project. Please try again.");
    },
  });

  const createProject = (e) => {
    e.preventDefault();

    const formData = new FormData(addProjectRef.current);
    addProject(formData);
  };

  return (
    <main className="fixed z-50 bg-black/20 inset-0 flex justify-center items-center p-4">
      <div className="bg-white p-4 rounded-md shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-xl">Create New Project</h1>
        </div>

        <form
          onSubmit={createProject}
          ref={addProjectRef}
          className="w-full flex flex-col gap-5"
        >
          <div className="flex flex-col gap-4">
            <input type="hidden" name="created_by" defaultValue={user?.id} />
            <input
              type="hidden"
              name="project_members"
              defaultValue={user?.id}
            />
            <div>
              <h1 className="text-md font-semibold">Title</h1>
              <input
                type="text"
                name="project_name"
                placeholder="Project Name"
                className="p-2 border-gray-300 border rounded-md w-full"
              />
            </div>

            <div>
              <h1 className="text-md font-semibold">Description</h1>
              <textarea
                name="project_description"
                className="p-2 border-gray-300 border rounded-md w-full"
              ></textarea>
            </div>

            <div className="w-full flex gap-4 flex-wrap">
              <div className="flex-1">
                <h1 className="text-md font-semibold">Start</h1>
                <input
                  type="date"
                  name="project_start"
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
              </div>

              <div className="flex-1">
                <h1 className="text-md font-semibold">End</h1>
                <input
                  type="date"
                  name="project_end"
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>

            <div className="w-full flex gap-4 flex-wrap">
              <div className="flex-1">
                <h1 className="text-md font-semibold">Status</h1>
                <select
                  name="project_status"
                  className="p-2 border-gray-300 border rounded-md w-full bg-white"
                  required
                >
                  <option value="">Set Project Status</option>
                  {projectStatus?.statuses?.map(([value]) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1"></div>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-2">
            <button
              type="submit"
              className="py-2 px-4 border bg-blue-500 text-white rounded-md"
            >
              Create
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
