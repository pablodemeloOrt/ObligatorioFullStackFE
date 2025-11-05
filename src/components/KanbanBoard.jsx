import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import KanbanColumn from "./KanbanColumn";

const KanbanBoard = () => {
  const taskList = useSelector((state) => state.taskSlice);
  const [dateFilter, setDateFilter] = useState("all"); 

  const categories = [
    { key: "backlog", title: "Backlog" },
    { key: "in_progress", title: "En Progreso" },
    { key: "testing", title: "Testing" },
    { key: "done", title: "Completado" }
  ];

  const list = Array.isArray(taskList)
    ? taskList
    : (taskList?.tasks || taskList?.data || []);

  // 🧮 función auxiliar que calcula el límite según el filtro
  const getFilteredTasks = useMemo(() => {
    const now = new Date();
    let limitDate;

    if (dateFilter === "week") {
      limitDate = new Date();
      limitDate.setDate(now.getDate() - 7);
    } else if (dateFilter === "month") {
      limitDate = new Date();
      limitDate.setMonth(now.getMonth() - 1);
    }

    return list.filter((task) => {
      if (!task.createdAt) return true;
      const created = new Date(task.createdAt);
      if (dateFilter === "all") return true;
      return created >= limitDate;
    });
  }, [list, dateFilter]);

  const getTasksByStatus = (status) =>
    getFilteredTasks.filter((task) => task.status === status);

  return (
    <div className="kanban-board-container">
      <h2>Tablero de Tareas</h2>

      {/* 🔍 Selector de rango de fecha */}
      <div className="d-flex gap-2 mb-3">
        <label>Filtrar por fecha:</label>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="form-select w-auto"
        >
          <option value="all">Todo el histórico</option>
          <option value="week">Última semana</option>
          <option value="month">Último mes</option>
        </select>
      </div>

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
