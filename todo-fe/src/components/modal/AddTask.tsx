"use client";
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { Task } from "@/types/todoType";
import { User } from "@/types/user";
import { getUserRole } from "@/lib/user";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jwt";

const statusStyles = {
  "Not Started": { bg: "bg-gray-700", text: "text-gray-200" },
  "On Progress": { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  Done: { bg: "bg-green-500/20", text: "text-green-400" },
  Reject: { bg: "bg-red-500/20", text: "text-red-400" },
};

const AddTaskModal = ({
  isOpen,
  closeModal,
  isCreateTask,
  taskData,
  modalType,
}: {
  isOpen: boolean;
  isCreateTask: boolean;
  taskData: Task | null;
  closeModal: () => void;
  modalType: "Add" | "Edit";
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "Not Started" | "On Progress" | "Done" | "Reject"
  >("Not Started");
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>(""); // To handle any errors
  const [assignedUser, setAssignedUser] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addTask = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3000/api/tasks",
        {
          title,
          description,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to add task");
      } else {
        throw new Error("Unexpected error occurred");
      }
    }
  };

  const editTask = async () => {
    if (taskData) {
      const id = taskData.id;
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.put(
          "http://localhost:3000/api/tasks",
          {
            id,
            title,
            description,
            status,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data;
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(error.response.data.message || "Failed to add task");
        } else {
          throw new Error("Unexpected error occurred");
        }
      }
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return alert("Title is required");

    if (isCreateTask) {
      addTask();
    } else {
      if (taskData) {
        editTask();
      }
    }

    console.log({ title, description, status });
    // window.location.reload();
    resetForm();
    closeModal();
  };

  const handleClose = () => {
    closeModal();
    resetForm();
  };

  // Close the modal when Escape key is pressed
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [closeModal]);

  useEffect(() => {
    if (taskData) {
      setTitle(taskData.title);
      setDescription(taskData.description);
      setStatus(taskData.status);
    }
  }, [taskData]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("Not Started");
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflowY = "auto";

      const lineHeight = 24;
      const maxLines = 5;

      const newHeight = Math.min(
        textareaRef.current.scrollHeight,
        lineHeight * maxLines
      );

      textareaRef.current.style.height = `${newHeight}px`;

      if (textareaRef.current.scrollHeight > lineHeight * maxLines) {
        textareaRef.current.style.overflowY = "scroll";
      }
    }
  }, [description]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        setUsers(response.data); // Update the users state with the fetched users
      } catch (err) {
        console.error("Error fetching users:", err);

        // Handling different types of errors
        if (axios.isAxiosError(err)) {
          // Axios-specific error handling
          if (err.response) {
            // Server responded with an error status
            setError(
              `Error: ${err.response.data.message || "Something went wrong"}`
            );
          } else if (err.request) {
            // No response was received (network issues)
            setError("Error: No response from server.");
          } else {
            // Other errors (such as setup errors)
            setError(`Error: ${err.message}`);
          }
        } else {
          // Non-Axios error (general JS errors)
          setError("Error: Unable to fetch users");
        }
      }
    };

    fetchUsers();
  }, [isOpen]);

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Gradient */}
          <motion.div
            className="fixed inset-0 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </motion.div>

          {/* Modal */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-lg mx-auto p-6 rounded-t-xl bg-[#1F2937]/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.4)]"
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Inputs */}
            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full px-4 py-2 text-sm text-white bg-[#111827] border border-[#2D2D2D] placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                required
              />

              <textarea
                ref={textareaRef}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={1}
                className="w-full px-4 py-2 text-sm text-white bg-[#111827] border border-[#2D2D2D] placeholder-gray-400 rounded-lg resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
              />
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between">
              {/* Status */}
              <div className="flex gap-2 flex-col sm:flex-row sm:gap-4">
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as
                        | "Not Started"
                        | "On Progress"
                        | "Done"
                        | "Reject"
                    )
                  }
                  className={`px-3 py-2 rounded-md text-sm ${statusStyles[status].bg} ${statusStyles[status].text} border border-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
                >
                  <option>Not Started</option>
                  <option>On Progress</option>
                  <option>Done</option>
                  <option>Reject</option>
                </select>

                {role === "lead" ? (
                  <select
                    value={assignedUser}
                    onChange={(e) => setAssignedUser(e.target.value)}
                    className="px-3 py-2 rounded-md text-sm bg-[#111827] text-white border border-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  >
                    <option value="" disabled>
                      Select User
                    </option>
                    {users.map((user) => (
                      <option key={user.id} value={user.email}>
                        {user.email}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
              {/* Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClose}
                  className="p-2 rounded-md hover:bg-gray-700 transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-300" />
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
                  aria-label="Submit"
                >
                  {modalType}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddTaskModal;
