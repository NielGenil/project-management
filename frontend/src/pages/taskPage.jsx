import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useParams } from "react-router-dom";
import { getProjectDataAPI, getProjectMembersAPI, getTaskDataAPI } from "../api/projectAPI";
import { useHelper } from "../hooks/useHelper";
import {
  ActivityIcon,
  ArrowLeft,
  Ban,
  BookCheck,
  BookType,
  CalendarX,
  ClipboardCheck,
  ClipboardClock,
  FolderOpen,
  FolderPlus,
  RefreshCcw,
  SquareCheckBig,
  User,
} from "lucide-react";
import TaskTable from "../features/task/taskTable";
import AddTaskModal from "../features/task/AddTaskModal";
import { Activity, useState } from "react";
import { usePermission } from "../hooks/usePermission";

export default function TaskPage() {
  const { token } = useHelper();
  const { isTeamLeader } = usePermission();
  const { projectId } = useParams();
  const [addTaskModal, setAddTaskModal] = useState(false);

  const { data: projectData } = useQuery({
    queryKey: ["project-data"],
    queryFn: () => getProjectDataAPI(token, projectId),
  });

  const { data: taskList } = useQuery({
    queryKey: ["task-list"],
    queryFn: () => getTaskDataAPI(token, projectId),
  });

    const { data: memberList } = useQuery({
      queryKey: ["project-member"],
      queryFn: () => getProjectMembersAPI(token, projectId),
    });
  
    const memberListData = Array.isArray(memberList?.members)
      ? memberList?.members
      : [];

  const taskListData = Array.isArray(taskList?.tasks) ? taskList?.tasks : [];

  const taskCount = taskListData?.length || 0;

  const projectMemberCount = memberListData?.length || 0;

  const taskInProgressCount = taskListData.filter(
    (task) => task.task_status === "In Progress",
  ).length;

    const taskDoneCount = taskListData.filter(
    (task) => task.task_status === "Done",
  ).length;

  return (
    <main className="flex flex-col gap-10 sm:px-10">
      {/* first section */}
      <section className="w-full">
        <div className="flex sm:flex-row flex-col flex-1 justify-between items-center gap-4">
          {/* <div className="w-full flex">
            <Link to={"/projects"}>
              <ArrowLeft size={25} />
            </Link>
          </div> */}
          <div className="w-full sm:flex gap-4 items-center">
            <div>
              <Link to={"/projects"}>
                <ArrowLeft size={25} />
              </Link>
            </div>
            <div>
              <h1 className="text-2xl font-semibold">
                {projectData?.project_name}
              </h1>
              <p className="text-gray-500">
                Manage project tasks and details in one place. Assign tasks,
                track progress, and stay organized.
              </p>
            </div>
          </div>

          <div className="w-full flex flex-row-reverse">
            {isTeamLeader && (
              <button
                onClick={() => setAddTaskModal(true)}
                className="bg-blue-500 text-white p-2 rounded-md flex gap-2 justify-center items-center"
              >
                <FolderPlus className="text-white" size={18} /> Create Task
              </button>
            )}
          </div>
        </div>
      </section>

      {/* second section */}
      <section className="w-full flex gap-4 flex-col sm:flex-row sm:flex-wrap items-center">
        <div className="flex w-full flex-1 sm:h-[90px] justify-between items-center border-gray-300 rounded-md border p-4">
          <div>
            <p className="text-gray-500 text-sm">Total Task</p>
            <h1 className="text-2xl font-semibold">{taskCount}</h1>
          </div>
          <div>
            <BookType
              className="bg-yellow-100 text-yellow-500 p-1 rounded-lg"
              size={35}
            />
          </div>
        </div>

        <div className="flex w-full flex-1 sm:h-[90px] justify-between items-center border-gray-300 rounded-md border p-4">
          <div>
            <p className="text-gray-500 text-sm">In Progress Task</p>
            <h1 className="text-2xl font-semibold">{taskInProgressCount}</h1>
          </div>
          <div>
            <ActivityIcon
              className="bg-green-100 text-green-500 p-1 rounded-lg"
              size={35}
            />
          </div>
        </div>

        <div className="flex w-full flex-1 sm:h-[90px] justify-between items-center border-gray-300 rounded-md border p-4">
          <div>
            <p className="text-gray-500 text-sm">Completed Task</p>
            <h1 className="text-2xl font-semibold">{taskDoneCount}</h1>
          </div>
          <div>
            <ClipboardCheck
              className="bg-blue-100 text-blue-500 p-1 rounded-lg"
              size={35}
            />
          </div>
        </div>

        <div className="flex w-full flex-1 sm:h-[90px] justify-between items-center border-gray-300 rounded-md border p-4">
          <div>
            <p className="text-gray-500 text-sm">Total Member</p>
            <h1 className="text-2xl font-semibold">{projectMemberCount}</h1>
          </div>
          <div>
            <User
              className="bg-violet-100 text-violet-500 p-1 rounded-lg"
              size={35}
            />
          </div>
        </div>
      </section>

      {/* third section */}
      <section className="flex w-full h-full">
        <Outlet context={{ projectId, projectData }} />
      </section>

      {addTaskModal && (
        <AddTaskModal
          onClose={() => setAddTaskModal(false)}
          projectData={projectData}
          projectId={projectId}
        />
      )}
    </main>
  );
}
