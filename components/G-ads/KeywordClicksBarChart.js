import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function KeywordClicksBarChart({ data }) {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: "تعداد کلیک بر اساس کلمه کلیدی",
                data: data.values,
                backgroundColor: "#bc323a",
                borderRadius: 3,
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: { enabled: true },
        },
        scales: {
            x: {
                title: { display: false },
                ticks: { font: { family: "inherit", size: 14 } },
            },
            y: {
                beginAtZero: true,
                ticks: { font: { family: "inherit", size: 14 } },
            },
        },
    };
    return (
        <div style={{ justifyItems: "center" }}>
            <Bar data={chartData} options={options} />
        </div>
    );
}
