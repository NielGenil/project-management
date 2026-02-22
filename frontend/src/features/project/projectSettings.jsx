import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ActivityIcon,
  ActivitySquare,
  Ban,
  BookmarkCheck,
  CalendarCheck,
  CalendarMinus2,
  CalendarX,
  Clipboard,
  ClipboardCheck,
  ClipboardClock,
  Layers,
  Layers2,
  LayersPlus,
  Plus,
  RefreshCcw,
  Settings,
  SquareCheckBig,
  Trash,
  User,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import {
  editProjectDataAPI,
  getProjectDataAPI,
  getProjectStatusAPI,
} from "../../api/projectAPI";
import { useHelper } from "../../hooks/useHelper";
import { useRef } from "react";
import toast from "react-hot-toast";

export default function ProjectSettings() {
  const { projectId } = useParams();
  const { token } = useHelper();
  const navigate = useNavigate();

  const editProjectRef = useRef();

  const { data: project } = useQuery({
    queryKey: ["project-data"],
    queryFn: () => getProjectDataAPI(token, projectId),
  });

  const { data: projectStatus } = useQuery({
    queryKey: ["project-status"],
    queryFn: () => getProjectStatusAPI(token),
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

  const updateProject = (e) => {
    e.preventDefault();

    const formData = new FormData(editProjectRef.current);

    editProject({ formData, projectId });
  };
  console.log(project?.project_status);

  if (!project || !project?.project_status) {
    return (
      <main className="">
        <div className="">Loading...</div>
      </main>
    );
  }

  return (
    <main className="w-full h-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex  w-full items-center">
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
        <div className="flex w-full flex-row-reverse">
          <button className="text-white p-1.5 bg-red-500 rounded-md flex gap-2 items-center"><Trash size={18}/> Delete Project</button>
        </div>
      </div>
      <div className="flex gap-4">
        <form
          onSubmit={updateProject}
          ref={editProjectRef}
          className="border border-gray-300 w-full rounded-md p-7 flex flex-col gap-4"
        >
          <div>
            <h1 className="font-semibold text-lg">Project Details</h1>
          </div>
          <div>
            <h1>Project Name</h1>
            <input
              type="text"
              name="project_name"
              defaultValue={project?.project_name}
              className="p-2 border-gray-300 border rounded-md w-full"
            />
          </div>
          <div>
            <h1>Project Description</h1>
            <textarea
              type="text"
              name="project_description"
              defaultValue={project?.project_description}
              className="p-2 border-gray-300 border rounded-md w-full"
            />
          </div>
          <div>
            <h1>Status</h1>
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
          <div className="flex justify-between w-full gap-4">
            <div className="flex-1">
              <h1>Start</h1>
              <input
                type="date"
                name="project_start"
                defaultValue={project?.project_start}
                className="p-2 border-gray-300 border rounded-md w-full"
              />
            </div>
            <div className="flex-1">
              <h1>End</h1>
              <input
                type="date"
                name="project_end"
                defaultValue={project?.project_end}
                className="p-2 border-gray-300 border rounded-md w-full"
              />
            </div>
          </div>
          <div>
            <h1>Created at</h1>
            <input
              type="text"
              defaultValue={project?.created_at}
              className="p-2 w-full"
            />
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

        <form className="border border-gray-300 w-full rounded-md p-7 flex flex-col gap-4">
          <div className="flex justify-between">
            <h1 className="font-semibold text-lg">Team Members</h1>

            <button className="border border-gray-300 rounded-md p-2">
              <Plus size={18} />
            </button>
          </div>

          <div>
            {project?.project_members?.map((user) => (
              <div className="flex justify-between items-center">
                <p>{user?.username}</p>

                {user.id === project?.created_by?.id && (
                  <p className="p-1 px-2 text-gray-700 font-semibold border border-gray-300 rounded-md">
                    Team Lead
                  </p>
                )}
              </div>
            ))}
          </div>
        </form>
      </div>
    </main>
  );
}
