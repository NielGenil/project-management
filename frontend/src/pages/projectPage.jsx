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

export default function ProjectPage() {
  const [addProjectModal, setAddProjectModal] = useState(false);
  return (
    <main className="flex flex-col gap-10 w-full h-full sm:px-10">
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
                setAddProjectModal(true)
              }}
              className="bg-blue-500 text-white p-2 rounded-md flex gap-2 justify-center items-center"
            >
              <FolderPlus className="text-white" size={18} /> Add Project
            </button>
          </div>
        </div>
      </section>

      {/* second section */}
      <section className="w-full flex gap-4 flex-col sm:flex-row items-center justify-between">
        <div className="flex w-full sm:w-[250px] justify-between items-center border-gray-300 rounded-md border p-4">
          <div>
            <p className="text-gray-500 text-sm">Total Projects</p>
            <h1 className="text-2xl font-semibold">1</h1>
          </div>
          <div>
            <FolderOpen
              className="bg-yellow-100 text-yellow-500 p-1 rounded-lg"
              size={35}
            />
          </div>
        </div>

        <div className="flex w-full sm:w-[250px] justify-between items-center border-gray-300 rounded-md border p-4">
          <div>
            <p className="text-gray-500 text-sm">Active Projects</p>
            <h1 className="text-2xl font-semibold">1</h1>
          </div>
          <div>
            <RefreshCcw
              className="bg-green-100 text-green-500 p-1 rounded-lg"
              size={35}
            />
          </div>
        </div>

        <div className="flex w-full sm:w-[250px] justify-between items-center border-gray-300 rounded-md border p-4">
          <div>
            <p className="text-gray-500 text-sm">Pending Projects</p>
            <h1 className="text-2xl font-semibold">1</h1>
          </div>
          <div>
            <ClipboardClock
              className="bg-gray-100 text-gray-500 p-1 rounded-lg"
              size={35}
            />
          </div>
        </div>

        <div className="flex w-full sm:w-[250px] justify-between items-center border-gray-300 rounded-md border p-4">
          <div>
            <p className="text-gray-500 text-sm">Overdue Projects</p>
            <h1 className="text-2xl font-semibold">1</h1>
          </div>
          <div>
            <CalendarX
              className="bg-red-100 text-red-500 p-1 rounded-lg"
              size={35}
            />
          </div>
        </div>

        <div className="flex w-full sm:w-[250px] justify-between items-center border-gray-300 rounded-md border p-4">
          <div>
            <p className="text-gray-500 text-sm">Completed Projects</p>
            <h1 className="text-2xl font-semibold">1</h1>
          </div>
          <div>
            <SquareCheckBig
              className="bg-blue-100 text-blue-500 p-1 rounded-lg"
              size={35}
            />
          </div>
        </div>

        <div className="flex w-full sm:w-[250px] justify-between items-center border-gray-300 rounded-md border p-4">
          <div>
            <p className="text-gray-500 text-sm">Canceled Projects</p>
            <h1 className="text-2xl font-semibold">1</h1>
          </div>
          <div>
            <Ban
              className="bg-orange-100 text-orange-500 p-1 rounded-lg"
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
