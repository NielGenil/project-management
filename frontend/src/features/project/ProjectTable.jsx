import { useQuery } from "@tanstack/react-query";
import { useHelper } from "../../hooks/useHelper";
import { getAllProjectAPI } from "../../api/projectAPI";
import {
  Ban,
  CalendarCheck,
  CalendarMinus2,
  ClipboardClock,
  RefreshCcw,
  SquareCheckBig,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProjectTable() {
  const { token, formatDate } = useHelper();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("");

  const { data: projectList } = useQuery({
    queryKey: ["project-list"],
    queryFn: () => getAllProjectAPI(token),
  });

  const projectListData = Array.isArray(projectList) ? projectList : [];

  const filterProjectList = projectListData.filter((project) => {
    const projectStatus =
      statusFilter === "" || project.project_status === statusFilter;

    return projectStatus;
  });

  return (
    <main className="w-full h-full">
      <div className="mb-2 w-full flex-row-reverse flex">
        <select
          name=""
          id=""
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
           className="p-1.5 text-gray-700 font-semibold border-gray-300 bg-white border rounded-md"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>
      <div className="bg-white border-2 border-gray-200 rounded-md overflow-hidden overflow-x-auto w-full">
        <table className="w-full">
          <thead>
            <tr className="text-left uppercase text-xs text-gray-500">
              <th className="px-2 py-3">Title</th>
              <th className="px-2 py-3">Status</th>
              <th className="px-2 py-3">Start</th>
              <th className="px-2 py-3">End</th>
            </tr>
          </thead>

          <tbody className="w-full">
            {filterProjectList?.map((project) => (
              <tr
                key={project.id}
                onClick={() => {
                  navigate(`/project/tasks/${project.id}`);
                }}
                className="border-t border-gray-200 text-sm"
              >
                <td className="px-2 py-3">{project.project_name}</td>
                <td className="px-2 py-3">
                  <span className="flex gap-2 items-center">
                    {project.project_status === "Active" ? (
                      <RefreshCcw
                        className="bg-green-100 text-green-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : project.project_status === "Pending" ? (
                      <ClipboardClock
                        className="bg-orange-100 text-orange-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : project.project_status === "Canceled" ? (
                      <Ban
                        className="bg-red-100 text-red-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : project.project_status === "Completed" ? (
                      <SquareCheckBig
                        className="bg-blue-100 text-blue-500 p-1 rounded-lg"
                        size={24}
                      />
                    ) : (
                      ""
                    )}
                    {project.project_status}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <span className="flex gap-2 items-center">
                    <CalendarCheck className="text-gray-500" size={18} />
                    {formatDate(project.project_start)}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <span className="flex gap-2 items-center">
                    <CalendarMinus2 className="text-gray-500" size={18} />
                    {formatDate(project.project_end)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
