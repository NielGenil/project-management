import { useQuery } from "@tanstack/react-query";
import { useHelper } from "../../hooks/useHelper";
import { getAllProjectAPI, getTaskDataAPI } from "../../api/projectAPI";
import {
  Ban,
  CalendarCheck,
  CalendarMinus2,
  CalendarX,
  ClipboardClock,
  RefreshCcw,
  SquareCheckBig,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TaskDetailModal from "./taskDetailModal";

export default function TaskTable({ projectId, projectData }) {
  const { token } = useHelper();
  const navigate = useNavigate();
  const [taskDetailModal, setTaskDetailModal] = useState(false);
  const [taskData, setTaskData] = useState({});

  const { data: taskList } = useQuery({
    queryKey: ["task-list"],
    queryFn: () => getTaskDataAPI(token, projectId),
  });

  const taskListData = Array.isArray(taskList?.tasks) ? taskList?.tasks : [];

  return (
    <main className="w-full h-full">
      <div className="bg-white border-2 border-gray-200 rounded-md overflow-hidden overflow-x-auto w-full">
        <table className="w-full">
          <thead>
            <tr className="text-left uppercase text-xs text-gray-500">
              <th className="px-2 py-3">Title</th>
              <th className="px-2 py-3">Assigned User</th>
              <th className="px-2 py-3">Status</th>
              <th className="px-2 py-3">Priority</th>
              <th className="px-2 py-3">Due Date</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {taskListData?.map((task) => (
              <tr
                key={task.id}
                onClick={() => {
                  setTaskDetailModal(true);
                  setTaskData(task)
                }}
                className="border-t border-gray-200 text-sm"
              >
                <td className="px-2 py-3">{task.task_name}</td>
                <td className="px-2 py-3">
                  <span className="flex gap-2">
                    <CalendarCheck className="text-gray-500" size={18} />
                    {task.task_assign_user?.username}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <span className="flex gap-2">
                    {task.project_status === "Active" ? (
                      <RefreshCcw
                        className="bg-green-100 text-green-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : task.project_status === "Pending" ? (
                      <ClipboardClock
                        className="bg-gray-100 text-gray-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : task.project_status === "Canceled" ? (
                      <Ban
                        className="bg-orange-100 text-orange-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : task.project_status === "Completed" ? (
                      <SquareCheckBig
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
                  <span className="flex gap-2">
                    {task.project_status === "Active" ? (
                      <RefreshCcw
                        className="bg-green-100 text-green-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : task.project_status === "Pending" ? (
                      <ClipboardClock
                        className="bg-gray-100 text-gray-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : task.project_status === "Canceled" ? (
                      <Ban
                        className="bg-orange-100 text-orange-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : task.project_status === "Completed" ? (
                      <SquareCheckBig
                        className="bg-blue-100 text-blue-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : (
                      ""
                    )}
                    {task.task_priority}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <span className="flex gap-2">
                    <CalendarCheck className="text-gray-500" size={18} />
                    {task.task_due}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {taskDetailModal && <TaskDetailModal onClose={() => setTaskDetailModal(false)} taskDetail={taskData} projectData={projectData}/>}
    </main>
  );
}
