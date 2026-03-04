import { useQuery } from "@tanstack/react-query";
import { useHelper } from "../hooks/useHelper";
import {
  getAllProjectAPI,
  getAllUserAPI,
  getCurrentUserAPI,
  getUserTaskAPI,
} from "../api/projectAPI";
import {
  ActivityIcon,
  AlignEndVertical,
  BookmarkCheck,
  BookType,
  CalendarCheck,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  FolderOpen,
  Layers,
  Layers2,
  LayersPlus,
  ListTodo,
  SquareCheckBig,
  SquareX,
  User,
} from "lucide-react";
import { usePermission } from "../hooks/usePermission";
import { useMemo, useState } from "react";

export default function DashboardPage() {
  const { token, formatDate } = useHelper();
  const { isAdmin } = usePermission();

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [userFilter, setUserFilter] = useState("0");

  const { data: userTask } = useQuery({
    queryKey: ["user-taks"],
    queryFn: () => getUserTaskAPI(token),
  });

  const { data: user } = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getCurrentUserAPI(token),
  });

  const { data: projectList } = useQuery({
    queryKey: ["project-list"],
    queryFn: () => getAllProjectAPI(token),
  });

  const { data: userList } = useQuery({
    queryKey: ["user-list"],
    queryFn: () => getAllUserAPI(token),
  });

  const allTasks = useMemo(() => {
    return userTask?.flatMap((user) => user.task_assign || []) || [];
  }, [userTask]);

  const projectListData = Array.isArray(projectList) ? projectList : [];

  const projectCount = projectList?.length || 0;

  const projectMembers = Array.isArray(userList) ? userList : [];

  const projectCompletedCount = projectListData.filter(
    (project) => project.project_status === "Completed",
  ).length;

  const taskCount = allTasks?.length || 0;

  const taskCompletedCount = allTasks.filter(
    (task) => task.task_status === "Done",
  ).length;

  const completionTaskPercentage =
    taskCount > 0 ? Math.round((taskCompletedCount / taskCount) * 100) : 0;

  const completionProjectPercentage =
    projectCount > 0
      ? Math.round((projectCompletedCount / projectCount) * 100)
      : 0;

  const filteredTasks = allTasks.filter((task) => {
    const matchStatus =
      statusFilter === "" || task.task_status === statusFilter;

    const matchPriority =
      priorityFilter === "" || task.task_priority === priorityFilter;

    const matchUser =
      userFilter === "0" || task.task_assign_user?.id === Number(userFilter);

    return matchStatus && matchPriority && matchUser;
  });

  return (
    <main className="w-full h-full flex flex-col text-xs sm:text-sm gap-5 sm:gap-10 overflow-hidden overflow-y-auto p-2 sm:py-10  sm:pl-20 sm:pr-10">
      <section className="w-full">
        <div className="flex sm:flex-row flex-col flex-1 justify-between items-center gap-4">
          <div className="w-full">
            <h1 className="sm:text-2xl text-lg font-semibold">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Get a quick overview of your projects, tasks, and team activity.
            </p>
          </div>
        </div>
      </section>

      {/* second section */}
      <section className="w-full flex sm:gap-4 flex justify-between gap-2 sm:flex-row sm:flex-wrap items-center">
        <div className="flex-1 flex sm:flex-row flex-col gap-2">
          <div className="flex w-full sm:flex-1 h-[50px] sm:h-[90px] justify-between items-center border-gray-300 rounded-md border sm:p-4 p-1">
            <div>
              <p className="text-gray-500 sm:text-sm text-xs">Total Projects</p>
              <h1 className="sm:text-2xl text:lg font-semibold">
                {projectCount}
              </h1>
            </div>
            <div>
              <FolderOpen className="bg-yellow-100 text-yellow-500 p-1 rounded-lg sm:w-9 sm:h-9 w-7 h-7" />
            </div>
          </div>

          <div className="flex w-full sm:flex-1 h-[50px] sm:h-[90px] justify-between items-center border-gray-300 rounded-md border sm:p-4 p-1">
            <div>
              <p className="text-gray-500 sm:text-sm text-xs">Total Task</p>
              <h1 className="sm:text-2xl text:lg font-semibold">{taskCount}</h1>
            </div>
            <div>
              <ClipboardList className="bg-orange-100 text-orange-500 p-1 rounded-lg sm:w-9 sm:h-9 w-7 h-7" />
            </div>
          </div>
          <div className="flex w-full sm:flex-1 sm:h-[90px] h-[50px] justify-between items-center border-gray-300 rounded-md border sm:p-4 p-1">
            <div>
              <p className="text-gray-500 sm:text-sm text-xs">Completed Task</p>
              <h1 className="sm:text-2xl text:lg font-semibold">
                {taskCompletedCount}
              </h1>
            </div>
            <div>
              <SquareCheckBig className="bg-blue-100 text-blue-500 p-1 rounded-lg sm:h-9 w-7 h-7" />
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col xl:flex-row gap-5 justify-between xl:overflow-hidden flex-col-reverse w-full">
        <div className="flex flex-1 flex-col gap-4 overflow-hidden overflow-x-auto overflow-y-auto max-h-[500px] xl:max-h-none">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h1 className="text-md sm:text-lg font-semibold flex gap-2 items-center">
              <ListTodo className="sm:w-5 sm:h-5 w-4 h-4" /> Project and Tasks
              Overview
            </h1>

            <div className="flex flex-wrap gap-1 sm:gap-4 items-center sm:flex-row-reverse">
              <div className="flex flex-wrap gap-1 sm:gap-4">
                {isAdmin && (
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
              </div>
            </div>
          </div>

          <div
            className="bg-white border border-gray-300 rounded-md overflow-hidden overflow-y-auto overflow-x-auto w-full"
            style={{ scrollbarGutter: "stable" }}
          >
            <table className="w-full">
              <thead>
                <tr className="text-left uppercase text-gray-500">
                  <th className="px-2 py-3 min-w-[150px] sm:text-sm text-[10px]">
                    Project
                  </th>
                  <th className="px-2 py-3 min-w-[150px] sm:text-sm text-[10px]">
                    Tasks
                  </th>
                  {isAdmin && (
                    <th className="px-2 py-3 min-w-[150px] sm:text-sm text-[10px]">
                      Assigned User
                    </th>
                  )}

                  <th className="px-2 py-3 min-w-[100px] sm:text-sm text-[10px]">
                    Status
                  </th>
                  <th className="px-2 py-3 min-w-[100px] sm:text-sm text-[10px]">
                    Priority
                  </th>
                  <th className="px-2 py-3 min-w-[150px] sm:text-sm text-[10px]">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="w-full overflow-y-auto">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isAdmin ? 6 : 5}
                      className="text-center py-4 text-gray-500 sm:text-sm text-xs"
                    >
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-t border-gray-200 text-sm"
                    >
                      <td className="px-2 py-3 sm:text-sm text-xs">
                        {task?.project?.project_name}
                      </td>
                      <td className="px-2 py-3 sm:text-sm text-xs">
                        {task.task_name}
                      </td>
                      {isAdmin && (
                        <td className="px-2 py-3  sm:text-sm text-xs">
                          <span className="flex gap-2 items-center">
                            <User
                              className="bg-violet-100 text-violet-500 p-1 rounded-lg"
                              size={18}
                            />
                            {task.task_assign_user?.username}
                          </span>
                        </td>
                      )}
                      <td className="px-2 py-3 sm:text-sm text-xs">
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
                      <td className="px-2 py-3 sm:text-sm text-xs">
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
                      <td className="px-2 py-3 sm:text-sm text-xs">
                        <span className="flex gap-2 items-center">
                          <CalendarCheck className="text-gray-500" size={18} />
                          {formatDate(task.task_due)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col xl:flex-col justify-between sm:flex-row gap-2 xl:w-[400px] w-full">
          <div className="flex flex-1 flex-col gap-4">
            <h1 className="text-md sm:text-lg font-semibold flex gap-2 items-center ">
              <AlignEndVertical className="sm:w-5 sm:h-5 w-4 h-4" />
              Completion
            </h1>
            <div className="border flex flex-col gap-4 border-gray-300 rounded-md p-5">
              <section className="w-full flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="sm:text-sm text-xs font-semibold text-gray-600">
                    Task Completion
                  </p>
                  <p className="sm:text-sm text-xs font-semibold text-gray-600">
                    {completionTaskPercentage}%
                  </p>
                </div>

                {/* The single horizontal progress bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${completionTaskPercentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-400">
                  <span>{taskCompletedCount} completed</span>
                  <span>{taskCount} total</span>
                </div>
              </section>

              <section className="w-full flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="sm:text-sm text-xs font-semibold text-gray-600">
                    Project Completion
                  </p>
                  <p className="sm:text-sm text-xs font-semibold text-gray-600">
                    {completionProjectPercentage}%
                  </p>
                </div>

                {/* The single horizontal progress bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${completionProjectPercentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-400">
                  <span>{projectCompletedCount} completed</span>
                  <span>{projectCount} total</span>
                </div>
              </section>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-hidden">
            <h1 className="text-md sm:text-lg font-semibold flex gap-2 items-center">
              <CalendarClock className="sm:w-5 sm:h-5 w-4 h-4" />
              Incoming Overdue
            </h1>
            <div className="border flex flex-col gap-2 border-gray-300 rounded-md p-5 overflow-y-auto">
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const overdueTasks = allTasks
                  .filter((task) => {
                    if (!task.task_due || task.task_status === "Done")
                      return false;
                    const due = new Date(task.task_due);
                    due.setHours(0, 0, 0, 0);
                    const sevenDaysFromNow = new Date(today);
                    sevenDaysFromNow.setDate(today.getDate() + 7);
                    return due <= sevenDaysFromNow;
                  })
                  .sort((a, b) => new Date(a.task_due) - new Date(b.task_due)); // ✅ oldest due date first

                if (overdueTasks.length === 0) {
                  return (
                    <p className="text-center text-gray-400 text-xs sm:text-sm py-2">
                      No overdue tasks 🎉
                    </p>
                  );
                }

                return overdueTasks.map((task) => {
                  const isOverdue =
                    new Date(task.task_due).setHours(0, 0, 0, 0) < today; // ✅ moved inside map

                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between rounded-md px-3 py-2 gap-2 border border-gray-300"
                    >
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <div
                          className={`h-3 w-3 rounded-full ${isOverdue ? "bg-red-500" : "bg-yellow-500"}`}
                        ></div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 truncate">
                          {task.task_name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                          {task?.project?.project_name}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
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
                        <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
                          <CalendarCheck size={12} />
                          {formatDate(task.task_due)}
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
