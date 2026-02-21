import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHelper } from "../../hooks/useHelper";
import {
  editTaskDataAPI,
  getAllUserAPI,
  getTaskStatusAPI,
} from "../../api/projectAPI";
import { useRef } from "react";
import { toast } from "react-hot-toast";

export default function TaskDetailModal({ onClose, taskDetail, projectData }) {
  const { token } = useHelper();
  const editTaskRef = useRef();
  const queryClient = useQueryClient();

  const { data: taskStatus } = useQuery({
    queryKey: ["task-status"],
    queryFn: () => getTaskStatusAPI(token),
  });

  const { data: allUser } = useQuery({
    queryKey: ["all-user"],
    queryFn: () => getAllUserAPI(token),
  });

  const { mutate: addTask } = useMutation({
    mutationFn: ({ formData, id }) => editTaskDataAPI(token, formData, id),
    onSuccess: () => {
      toast.success("Task edited successfully!");
      queryClient.invalidateQueries(["task-list"]);
      onClose();
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to edit task. Please try again.");
    },
  });

  const editTask = (e) => {
    e.preventDefault();

    const formData = new FormData(editTaskRef.current);

    const id = taskDetail.id;
    console.log(id);
    addTask({ formData, id });
  };

  if (!taskDetail || !taskStatus) {
    return (
      <main className="fixed z-50 bg-black/20 inset-0 flex justify-center items-center">
        <div className="bg-white p-6 rounded-md shadow-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="fixed z-50 bg-black/20 inset-0 flex justify-center items-center p-4">
      <div className="bg-white p-4 rounded-md shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-xl">Task Detail</h1>
        </div>

        <form
          onSubmit={editTask}
          ref={editTaskRef}
          className="w-full flex flex-col gap-5"
        >
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-md font-semibold">Title</h1>
              <input
                type="text"
                name="task_name"
                defaultValue={taskDetail?.task_name}
                className="p-2 border-gray-300 border rounded-md w-full"
              />
            </div>

            <div>
              <h1 className="text-md font-semibold">Description</h1>
              <textarea
                name="task_description"
                defaultValue={taskDetail?.task_description}
                className="p-2 border-gray-300 border rounded-md w-full"
              ></textarea>
            </div>

            <div className="w-full flex gap-4 flex-wrap">
              <div className="flex-1">
                <h1 className="text-md font-semibold">User</h1>
                <select
                  name="task_assign_user"
                  className="p-2 border-gray-300 border rounded-md w-full"
                  required
                  defaultValue={taskDetail?.task_assign_user?.id}
                >
                  {projectData?.project_members?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user?.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <h1 className="text-md font-semibold">Task Due Date</h1>
                <input
                  type="date"
                  name="task_due"
                  defaultValue={taskDetail?.task_due}
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>

            <div className="w-full flex gap-4 flex-wrap">
              <div className="flex-1">
                <h1 className="text-md font-semibold">Status</h1>
                <select
                  name="task_status"
                  className="p-2 border-gray-300 border rounded-md w-full"
                  required
                  defaultValue={taskDetail?.task_status}
                >
                  <option value="">Set Task Status</option>
                  {taskStatus?.statuses?.map(([value]) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <h1 className="text-md font-semibold">Priority</h1>
                <select
                  name="task_priority"
                  className="p-2 border-gray-300 border rounded-md w-full"
                  required
                  defaultValue={taskDetail?.task_priority}
                >
                  <option value="">Set Task Priority</option>
                  {taskStatus?.priority?.map(([value]) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-2">
            <button
              type="submit"
              className="py-2 px-4 border bg-blue-500 text-white rounded-md"
            >
              Create
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
