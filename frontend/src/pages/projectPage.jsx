import {
  Ban,
  CalendarX,
  ClipboardClock,
  FolderClock,
  FolderOpen,
  FolderPlus,
  RefreshCcw,
  SquareCheckBig,
} from "lucide-react";
import AddProjectModal from "../features/project/AddProjectModal";
import { useState } from "react";
import ProjectTable from "../features/project/ProjectTable";
import { getAllProjectAPI } from "../api/projectAPI";
import { useHelper } from "../hooks/useHelper";
import { useQuery } from "@tanstack/react-query";

export default function ProjectPage() {
  const { token } = useHelper();
  const [addProjectModal, setAddProjectModal] = useState(false);

  const { data: projectList } = useQuery({
    queryKey: ["project-list"],
    queryFn: () => getAllProjectAPI(token),
  });

  const projectListData = Array.isArray(projectList) ? projectList : [];

  const projectCount = projectList?.length || 0;

  const projectActiveCount = projectListData.filter(
    (project) => project.project_status === "Active",
  ).length;

  const projectPendingCount = projectListData.filter(
    (project) => project.project_status === "Pending",
  ).length;

  const projectCompletedCount = projectListData.filter(
    (project) => project.project_status === "Completed",
  ).length;

  return (
    <main className="flex flex-col sm:gap-10 gap-5 sm:px-10 overflow-auto">
      {/* first section */}
      <section className="w-full">
        <div className="flex sm:flex-row flex-col flex-1 justify-between items-center gap-4">
          <div className="w-full">
            <h1 className="sm:text-2xl text-lg font-semibold">Projects</h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Manage your projects, assign tasks, and monitor progress
              efficiently.
            </p>
          </div>

          <div className="w-full flex flex-row-reverse">
            <button
              onClick={() => {
                setAddProjectModal(true);
              }}
              className="bg-blue-500 text-white p-2 rounded-md flex gap-2 justify-center items-center text-xs sm:text-sm"
            >
              <FolderPlus className="text-white sm:w-5 sm:h-5 w-4 h-4" /> Create Project
            </button>
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
              <p className="text-gray-500 sm:text-sm text-xs">Active</p>
              <h1 className="sm:text-2xl text:lg font-semibold">
                {projectActiveCount}
              </h1>
            </div>
            <div>
              <RefreshCcw className="bg-green-100 text-green-500 p-1 rounded-lg sm:w-9 sm:h-9 w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="flex-1 flex sm:flex-row flex-col gap-2">
          <div className="flex w-full sm:flex-1 sm:h-[90px] h-[50px] justify-between items-center border-gray-300 rounded-md border sm:p-4 p-1">
            <div>
              <p className="text-gray-500 sm:text-sm text-xs">Pending</p>
              <h1 className="sm:text-2xl text:lg font-semibold">
                {projectPendingCount}
              </h1>
            </div>
            <div>
              <ClipboardClock className="bg-orange-100 text-orange-500 p-1 rounded-lg sm:h-9 w-7 h-7" />
            </div>
          </div>

          <div className="flex w-full sm:flex-1 sm:h-[90px] h-[50px] justify-between items-center border-gray-300 rounded-md border sm:p-4 p-1">
            <div>
              <p className="text-gray-500 sm:text-sm text-xs">Completed</p>
              <h1 className="sm:text-2xl text:lg font-semibold">
                {projectCompletedCount}
              </h1>
            </div>
            <div>
              <SquareCheckBig className="bg-blue-100 text-blue-500 p-1 rounded-lg sm:h-9 w-7 h-7" />
            </div>
          </div>
        </div>
      </section>

      {/* third section */}
      <section className="flex w-full h-full">
        <ProjectTable />
      </section>

      {addProjectModal && (
        <AddProjectModal onClose={() => setAddProjectModal(false)} />
      )}
    </main>
  );
}
