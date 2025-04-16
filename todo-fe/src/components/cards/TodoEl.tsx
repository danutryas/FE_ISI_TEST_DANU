"use client";

import { StatusType, TodoCardProps } from "@/types/todoType";

const statusStyles: Record<StatusType, { bg: string; text: string }> = {
  "Not Started": { bg: "bg-gray-700", text: "text-gray-200" },
  "On Progress": { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  Done: { bg: "bg-green-500/20", text: "text-green-400" },
  Reject: { bg: "bg-red-500/20", text: "text-red-400" },
};

const defaultStatus = { label: "Unknown", color: "bg-yellow-500" };

const TodoEl: React.FC<TodoCardProps> = ({ taskName, status }) => {
  const { bg, text } = statusStyles[status] ?? defaultStatus;
  return (
    <div className="bg-[#2D3748] hover:bg-[#3E4C59] transition duration-300 ease-in-out p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer w-full">
      <div className="bg-[#1F2937] text-[#F3F4F6] p-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:shadow-lg hover:scale-[1.005] transition-all duration-300 ease-in-out">
        <div className="flex flex-col flex-grow">
          <h3 className="text-base font-semibold mb-1 truncate max-w-full sm:max-w-[200px] md:max-w-[360px] lg:max-w-[560px] xl:max-w-[920px]">
            {taskName}
          </h3>
        </div>

        <div
          className={`text-[11px] font-medium px-3 py-1 rounded-full ${bg} ${text} shadow-sm border border-white/10 w-max self-start sm:self-auto`}
          title={status}
        >
          {status}
        </div>
      </div>
    </div>
  );
};
export default TodoEl;
