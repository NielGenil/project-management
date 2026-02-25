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
    <main className="flex flex-col gap-10 sm:px-10  overflow-auto">
      {/* first section */}
      <section className="w-full">
        <div className="flex sm:flex-row flex-col flex-1 justify-between items-center gap-4">
          <div className="w-full">
            <h1 className="text-2xl font-semibold">Projects</h1>
            <p className="text-gray-500">
              Manage your projects, assign tasks, and monitor progress
              efficiently.
            </p>
          </div>

          <div className="w-full flex flex-row-reverse">
            <button
              onClick={() => {
                setAddProjectModal(true);
              }}
              className="bg-blue-500 text-white p-2 rounded-md flex gap-2 justify-center items-center"
            >
              <FolderPlus className="text-white" size={18} /> Create Project
            </button>
          </div>
        </div>
      </section>

      {/* second section */}
      <section className="w-full flex gap-4 flex-col sm:flex-row sm:flex-wrap items-center">
        <div className="flex w-full flex-1 sm:h-[90px] justify-between items-center border-gray-300 rounded-md border p-4">
          <div>
            <p className="text-gray-500 text-sm">Total Projects</p>
            <h1 className="text-2xl font-semibold">{projectCount}</h1>
          </div>
          <div>
            <FolderOpen
              className="bg-yellow-100 text-yellow-500 p-1 rounded-lg"
              size={35}
            />
          </div>
        </div>

        <div className="flex w-full flex-1 sm:h-[90px] justify-between items-center border-gray-300 rounded-md border p-4">
          <div>
            <p className="text-gray-500 text-sm">Active Projects</p>
            <h1 className="text-2xl font-semibold">{projectActiveCount}</h1>
          </div>
          <div>
            <RefreshCcw
              className="bg-green-100 text-green-500 p-1 rounded-lg"
              size={35}
            />
          </div>
        </div>

        <div className="flex w-full flex-1 sm:h-[90px] justify-between items-center border-gray-300 rounded-md border p-4">
          <div>
            <p className="text-gray-500 text-sm">Pending Projects</p>
            <h1 className="text-2xl font-semibold">{projectPendingCount}</h1>
          </div>
          <div>
            <ClipboardClock
              className="bg-orange-100 text-orange-500 p-1 rounded-lg"
              size={35}
            />
          </div>
        </div>

        <div className="flex w-full flex-1 sm:h-[90px] justify-between items-center border-gray-300 rounded-md border p-4">
          <div>
            <p className="text-gray-500 text-sm">Completed Projects</p>
            <h1 className="text-2xl font-semibold">{projectCompletedCount}</h1>
          </div>
          <div>
            <SquareCheckBig
              className="bg-blue-100 text-blue-500 p-1 rounded-lg"
              size={35}
            />
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
