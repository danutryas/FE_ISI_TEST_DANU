"use client";
import AddTaskModal from "@/components/modal/AddTask";
import { Task } from "@/types/todoType";
import React, { createContext, useState, useContext, ReactNode } from "react";

type modalType = "Add" | "Edit";

interface ModalContextType {
  isOpen: boolean;
  isCreateTask: boolean;
  modalType: modalType;
  openAddTaskModal: () => void;
  openEditTaskModal: (data: Task) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateTask, setIsCreateTask] = useState(true);
  const [taskData, setTaskData] = useState<Task | null>(null);
  const [modalType, setModalType] = useState<modalType>("Add");

  const openAddTaskModal = () => {
    setIsOpen(true);
    setIsCreateTask(true);
    setModalType("Add");
  };
  const openEditTaskModal = (data: Task) => {
    setIsOpen(true);
    setIsCreateTask(false);
    setTaskData(data);
    setModalType("Edit");
  };
  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        openAddTaskModal,
        openEditTaskModal,
        closeModal,
        isCreateTask,
        modalType,
      }}
    >
      {children}
      <AddTaskModal
        isOpen={isOpen}
        modalType={modalType}
        closeModal={closeModal}
        isCreateTask={isCreateTask}
        taskData={taskData}
      />
    </ModalContext.Provider>
  );
};
