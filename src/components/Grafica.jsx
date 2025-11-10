import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Grafica = ({ etiquetas, datos, nombreGrafica, nombreDatos, colores, compacta }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: compacta ? 3 : 2,
    plugins: {
      legend: {
        display: !compacta,
        position: "bottom",
      },
      title: {
        display: true,
        text: `${nombreGrafica ? nombreGrafica : "Grafica"}`,
        font: {
          size: compacta ? 14 : 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: compacta ? 10 : 12
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: compacta ? 10 : 12
          }
        }
      }
    }
  };

  // Colores por defecto si no se proporcionan
  const coloresPorDefecto = [
    "rgba(108, 117, 125, 0.8)", // Backlog - gris
    "rgba(13, 110, 253, 0.8)",  // En Progreso - azul
    "rgba(255, 193, 7, 0.8)",   // Testing - amarillo
    "rgba(25, 135, 84, 0.8)"    // Completado - verde
  ];

  const data = {
    labels: etiquetas,
    datasets: [
      {
        label: `${nombreDatos ? nombreDatos : "Datos"}`,
        data: datos,
        backgroundColor: colores || coloresPorDefecto,
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default Grafica;
