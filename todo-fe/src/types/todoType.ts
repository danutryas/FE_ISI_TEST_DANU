export type StatusType = "Not Started" | "On Progress" | "Done" | "Reject";

export type TodoCardProps = {
  taskName: string;
  status: StatusType;
  assignedTo: string;
};
export type Task = {
  id: string;
  title: string;
  description: string;
  status: StatusType;
  created_at: string;
  updated_at: string;
};
