import React from "react";
import TaskCard from "./TaskCard";

const KanbanColumn = ({ title, tasks, statusKey }) => {
  return (
    <div className="kanban-column">
      <div className={`kanban-column-header ${statusKey}`}>
        <span>{title}</span>
        <span className="kanban-column-header-count">
          {tasks.length}
        </span>
      </div>
      
      <div className="kanban-column-body">
        {tasks.length === 0 ? (
          <div className="kanban-column-empty">
            No hay tareas
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task._id || task.id} {...task} />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
