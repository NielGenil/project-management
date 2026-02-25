import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHelper } from "../../hooks/useHelper";
import {
  getProjectMembersAPI,
  getTaskStatusAPI,
  postTaskAPI,
} from "../../api/projectAPI";
import { useRef } from "react";
import { toast } from "react-hot-toast";

export default function AddTaskModal({ onClose, projectData, projectId }) {
  const { token } = useHelper();
  const addTaskRef = useRef();
  const queryClient = useQueryClient();

  const { data: taskStatus } = useQuery({
    queryKey: ["task-status"],
    queryFn: () => getTaskStatusAPI(token),
  });

  const { data: memberList } = useQuery({
    queryKey: ["project-member"],
    queryFn: () => getProjectMembersAPI(token, projectId),
  });

  const memberListData = Array.isArray(memberList?.members)
    ? memberList?.members
    : [];

  const { mutate: addTask } = useMutation({
    mutationFn: (formData) => postTaskAPI(formData, token),
    onSuccess: () => {
      toast.success("Task created successfully!");
      queryClient.invalidateQueries(["task-list"]);
      onClose();
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to create task. Please try again.");
    },
  });

  const createTask = (e) => {
    e.preventDefault();

    const formData = new FormData(addTaskRef.current);
    addTask(formData);
  };

  return (
    <main className="fixed z-50 bg-black/20 inset-0 flex justify-center items-center p-4">
      <div className="bg-white p-4 rounded-md shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-xl">Create New Task</h1>
        </div>

        <form
          onSubmit={createTask}
          ref={addTaskRef}
          className="w-full flex flex-col gap-5"
        >
          <input type="hidden" name="project" value={projectData?.id} />
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-md font-semibold">Title</h1>
              <input
                type="text"
                name="task_name"
                placeholder="Task Name"
                className="p-2 border-gray-300 border rounded-md w-full"
              />
            </div>

            <div>
              <h1 className="text-md font-semibold">Description</h1>
              <textarea
                name="task_description"
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
                >
                  <option value="">Assign user</option>
                  {memberListData?.map((user) => (
                    <option key={user.id} value={user.user.id}>
                      {user?.user?.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <h1 className="text-md font-semibold">Task Due Date</h1>
                <input
                  type="date"
                  name="task_due"
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>

            <div className="w-full flex gap-4 flex-wrap">
              <div className="flex-1">
                <h1 className="text-md font-semibold">Priority</h1>
                <select
                  name="task_priority"
                  className="p-2 border-gray-300 border rounded-md w-full"
                  required
                >
                  <option value="">Set Task Priority</option>
                  {taskStatus?.priority?.map(([value]) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <h1 className="text-md font-semibold">Status</h1>
                <select
                  name="task_status"
                  className="p-2 border-gray-300 border rounded-md w-full"
                  required
                >
                  <option value="">Set Task Status</option>
                  {taskStatus?.statuses?.map(([value]) => (
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
              Cancle
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
