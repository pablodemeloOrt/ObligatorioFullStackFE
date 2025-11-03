import React from "react";
import { useSelector } from "react-redux";
import KanbanColumn from "./KanbanColumn";

const KanbanBoard = () => {
  const taskList = useSelector((state) => state.taskSlice);

  const categories = [
    { key: "backlog", title: "Backlog" },
    { key: "in_progress", title: "En Progreso" },
    { key: "testing", title: "Testing" },
    { key: "done", title: "Completado" }
  ];

  // Filtrar tareas por categoría/status
  const getTasksByStatus = (status) => {
    const tasks = taskList?.tasks || [];
    return tasks.filter((task) => task?.status === status) || [];
  };

  return (
    <div className="kanban-board-container">
      <h2>Tablero de Tareas</h2>
      
      <div className="kanban-board">
        {categories.map((category) => (
          <KanbanColumn
            key={category.key}
            title={category.title}
            statusKey={category.key}
            tasks={getTasksByStatus(category.key)}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
