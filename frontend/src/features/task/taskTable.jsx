import { useQuery } from "@tanstack/react-query";
import { useHelper } from "../../hooks/useHelper";
import { getAllProjectAPI, getTaskDataAPI } from "../../api/projectAPI";
import {
  ActivityIcon,
  ActivitySquare,
  Ban,
  BookmarkCheck,
  CalendarCheck,
  CalendarMinus2,
  CalendarX,
  ClipboardCheck,
  ClipboardClock,
  Layers,
  Layers2,
  LayersPlus,
  RefreshCcw,
  SquareCheckBig,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TaskDetailModal from "./taskDetailModal";

export default function TaskTable({ projectId, projectData }) {
  const { token } = useHelper();
  const navigate = useNavigate();
  const [taskDetailModal, setTaskDetailModal] = useState(false);
  const [taskData, setTaskData] = useState({});

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [userFilter, setUserFilter] = useState("0");
  const [clearFilterBtn, setClearFilterBtn] = useState({});

  const { data: taskList } = useQuery({
    queryKey: ["task-list"],
    queryFn: () => getTaskDataAPI(token, projectId),
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

  const clearFilter = (e) => {
    e.preventDefault();
    setPriorityFilter("");
    setStatusFilter("");
    setUserFilter("0");
  };

  console.log(userFilter);

  return (
    <main className="w-full h-full">
      <div className="flex gap-4 mb-2">
        <div className="">
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="p-2 font-semibold text-gray-700 border-gray-300 bg-white border rounded-md w-full"
          >
            <option value="0">All User</option>
            {projectMembers?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 text-gray-700 font-semibold border-gray-300 bg-white border rounded-md w-full"
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
            className="p-2 font-semibold text-gray-700 border-gray-300 bg-white border rounded-md w-full"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button
          onClick={() => {
            setPriorityFilter("");
            setStatusFilter("");
            setUserFilter("0");
          }}
        >
          Clear
        </button>
      </div>
      <div className="bg-white border-2 border-gray-200 rounded-md overflow-hidden overflow-x-auto w-full">
        <table className="w-full">
          <thead>
            <tr className="text-left uppercase text-xs text-gray-500">
              <th className="px-2 py-3">Tasks</th>
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
                <td className="px-2 py-3">{task.task_name}</td>
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
        />
      )}
    </main>
  );
}
