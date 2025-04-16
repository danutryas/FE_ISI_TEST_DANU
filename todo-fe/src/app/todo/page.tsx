"use client";
import TodoEl from "@/components/cards/TodoEl";
import Header from "@/components/Header";
import { useModal } from "@/context/ModalContext";
import Axios from "@/lib/Axios";
import { getUserRole } from "@/lib/user";
import { StatusType, Task } from "@/types/todoType";
import { useEffect, useState } from "react";

export default function Home() {
  const { openAddTaskModal, openEditTaskModal } = useModal();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>("");
  // const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await Axios.get("http://localhost:3000/api/tasks", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        setTasks(response.data); // Update the tasks state with the fetched tasks
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks");
      }
    };

    fetchTasks();
  }, []);

  return (
    <>
      <Header />
      <div className="mt-36 sm:mt-[108px] mx-4 sm:mx-6 mb-6 ">
        <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-[#1F2937] via-[#374151] to-[#2d3748] p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col gap-5 ">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-2xl sm:text-3xl text-[#E5E7EB]">
              Todo
            </h3>
            {getUserRole && getUserRole() === "lead" ? (
              <button
                onClick={openAddTaskModal}
                className="cursor-pointer px-4 py-2 text-base font-medium bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 ease-in-out"
              >
                Add Task
              </button>
            ) : null}
          </div>

          {/* Search */}
          {/* <div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-lg text-sm bg-[#2D3748] text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          {/* Todo List */}
          <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {tasks.map((task, index) => (
              <div key={index} onClick={() => openEditTaskModal(task)}>
                <TodoEl
                  assignedTo=""
                  status={task.status}
                  taskName={task.title}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {/* <div className="flex flex-wrap justify-center gap-2 mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-600 text-[#E5E7EB] hover:bg-blue-500 transition duration-300 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePagination(index + 1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-600 text-[#E5E7EB] hover:bg-blue-500"
                } transition duration-300`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-600 text-[#E5E7EB] hover:bg-blue-500 transition duration-300 disabled:opacity-50"
            >
              Next
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
}
