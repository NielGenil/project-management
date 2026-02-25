import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHelper } from "../../hooks/useHelper";
import {
  deleteTaskAPI,
  getProjectDataAPI,
  getTaskDataAPI,
} from "../../api/projectAPI";
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
  RefreshCcw,
  Settings,
  SquareCheckBig,
  SquareX,
  Trash,
  User,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import TaskDetailModal from "./taskDetailModal";
import toast from "react-hot-toast";
import { usePermission } from "../../hooks/usePermission";

export default function TaskTable() {
  const { projectId } = useParams();
  const { token } = useHelper();
  const { isTeamLeader } = usePermission();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [taskDetailModal, setTaskDetailModal] = useState(false);
  const [taskData, setTaskData] = useState({});

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [userFilter, setUserFilter] = useState("0");

  const [selectedTasksIds, setSelectedTasksIds] = useState([]);
  const [deleteTaskModal, setDeleteTaskModal] = useState(false);

  const { data: taskList } = useQuery({
    queryKey: ["task-list"],
    queryFn: () => getTaskDataAPI(token, projectId),
  });

  const { data: projectData } = useQuery({
    queryKey: ["project-data"],
    queryFn: () => getProjectDataAPI(token, projectId),
  });

  const { mutate: deleteSelectedTask } = useMutation({
    mutationFn: (selectedTasksIds) => deleteTaskAPI(token, selectedTasksIds),
    onSuccess: () => {
      toast.success("Taks deleted successfully!");
      setSelectedTasksIds([]);
      queryClient.invalidateQueries(["tasks-list"]);
    },
    onError: () => {
      toast.error("Failed to delete tasks. Please try again.");
    },
  });

  const taskListData = Array.isArray(taskList?.tasks) ? taskList?.tasks : [];

  const projectMembers = Array.isArray(projectData?.project_members)
    ? projectData?.project_members
    : [];

  const filteredTasks = taskListData.filter((task) => {
    const matchStatus =
      statusFilter === "" || task.task_status === statusFilter;

    const matchPriority =
      priorityFilter === "" || task.task_priority === priorityFilter;

    const matchUser =
      userFilter === "0" || task.task_assign_user?.id === Number(userFilter);

    return matchStatus && matchPriority && matchUser;
  });

  const deleteTask = () => {
    if (selectedTasksIds.length === 0) return;
    deleteSelectedTask(selectedTasksIds);
  };

  // console.log(taskList);

    if (!taskListData) {
    return (
      <main className="fixed z-50 bg-black/20 inset-0 flex justify-center items-center">
        <div className="bg-white p-6 rounded-md shadow-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="w-full h-full">
      <div className="flex justify-between items-center mb-2 gap-2 flex-wrap">
        <div className="flex items-center">
          <button className="flex gap-2 items-center p-1.5 border border-gray-300 border-r-0 rounded-l-md bg-blue-500 text-white">
            <Clipboard size={18} className="text-white" />
            Task
          </button>

          <button
            onClick={() => navigate(`/project/tasks/${projectId}/settings`)}
            className="flex gap-2 items-center p-1.5 border border-gray-300 rounded-r-md text-gray-700"
          >
            <Settings size={18} className="text-gray-700" />
            Settings
          </button>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-4 items-center sm:flex-row-reverse">
          <div className="flex flex-wrap gap-1 sm:gap-4">
            {isTeamLeader && (
              <div className="">
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="p-1.5 font-semibold text-gray-700 border-gray-300 bg-white border rounded-md w-full"
                >
                  <option value="0">All User</option>
                  {projectMembers?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-1.5 text-gray-700 font-semibold border-gray-300 bg-white border rounded-md w-full"
              >
                <option value="">All Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className="">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="p-1.5 font-semibold text-gray-700 border-gray-300 bg-white border rounded-md w-full"
              >
                <option value="">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div>
            {(priorityFilter !== "" ||
              statusFilter !== "" ||
              userFilter !== "0") && (
              <button
                onClick={() => {
                  setPriorityFilter("");
                  setStatusFilter("");
                  setUserFilter("0");
                }}
                className="text-gray-700 flex gap-2 items-center"
              >
                <SquareX size={18} />
                Clear
              </button>
            )}

            {selectedTasksIds.length > 0 && (
              <button
                onClick={() => setDeleteTaskModal(true)}
                className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm"
              >
                <Trash size={16} />
                Delete ({selectedTasksIds.length})
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white border-2 border-gray-200 rounded-md overflow-hidden overflow-x-auto w-full">
        <table className="w-full">
          <thead>
            <tr className="text-left uppercase text-xs text-gray-500">
              <th className="px-2 py-3 flex gap-2 items-center">
                <div
                  className={`w-4 h-4 rounded-full flex-shrink-0 cursor-pointer flex items-center justify-center transition-colors bg-gray-300 `}
                ></div>
                Tasks
              </th>
              <th className="px-2 py-3">Assigned User</th>
              <th className="px-2 py-3">Status</th>
              <th className="px-2 py-3">Priority</th>
              <th className="px-2 py-3">Due Date</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {filteredTasks?.map((task) => (
              <tr
                key={task.id}
                onClick={() => {
                  setTaskDetailModal(true);
                  setTaskData(task);
                }}
                className="border-t border-gray-200 text-sm"
              >
                <td className="px-2 py-3 flex gap-2 items-center">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTasksIds((prev) =>
                        prev.includes(task.id)
                          ? prev.filter((id) => id !== task.id)
                          : [...prev, task.id],
                      );
                    }}
                    className={`w-4 h-4 rounded-full flex-shrink-0 cursor-pointer flex items-center justify-center transition-colors ${
                      selectedTasksIds.includes(task.id)
                        ? "bg-blue-500 border-blue-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {selectedTasksIds.includes(task.id) && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="1,6 4,9 11,3" />
                      </svg>
                    )}
                  </div>
                  {task.task_name}
                </td>
                <td className="px-2 py-3">
                  <span className="flex gap-2 items-center">
                    <User
                      className="bg-violet-100 text-violet-500 p-1 rounded-lg"
                      size={18}
                    />
                    {task.task_assign_user?.username}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <span className="flex gap-2 items-center">
                    {task.task_status === "To Do" ? (
                      <BookmarkCheck
                        className="bg-yellow-100 text-yellow-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : task.task_status === "In Progress" ? (
                      <ActivityIcon
                        className="bg-green-100 text-green-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : task.task_status === "Done" ? (
                      <ClipboardCheck
                        className="bg-blue-100 text-blue-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : (
                      ""
                    )}
                    {task.task_status}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <span className="flex gap-2 items-center">
                    {task.task_priority === "Low" ? (
                      <Layers2
                        className="bg-green-100 text-green-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : task.task_priority === "Medium" ? (
                      <Layers
                        className="bg-orange-100 text-orange-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : task.task_priority === "High" ? (
                      <LayersPlus
                        className="bg-red-100 text-red-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : (
                      ""
                    )}
                    {task.task_priority}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <span className="flex gap-2 items-center">
                    <CalendarCheck className="text-gray-500" size={18} />
                    {task.task_due}
                  </span>
                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {taskDetailModal && (
        <TaskDetailModal
          onClose={() => setTaskDetailModal(false)}
          taskDetail={taskData}
          projectData={projectData}
          projectId={projectId}
        />
      )}

      {deleteTaskModal && (
        <main className="fixed z-50 bg-black/20 inset-0 flex justify-center items-center p-4">
          <div className="bg-white p-4 rounded-md shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-bold text-xl">Delete Project</h1>
            </div>

            <form onSubmit={deleteTask} className="w-full flex flex-col gap-5">
              <div className="flex flex-col gap-4 my-4">
                <p>Are you sure you want to delete this tasks? </p>
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
                  onClick={() => setDeleteTaskModal(false)}
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
