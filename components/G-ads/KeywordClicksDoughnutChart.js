import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function KeywordClicksDoughnutChart({ data, style }) {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: "تعداد کلیک بر اساس کلمه کلیدی",
                data: data.values,
                backgroundColor: [
                    "#bc323a",
                    "#f7b32b",
                    "#4caf50",
                    "#1976d2",
                    "#ff9800",
                    "#9c27b0",
                    "#607d8b",
                    "#e91e63",
                    "#00bcd4",
                    "#8bc34a",
                ],
                borderWidth: 1,
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom", labels: { font: { family: "inherit", size: 14 } } },
            tooltip: { enabled: true },
        },
    };
    return (
        <div style={{ width: 220, height: 220, margin: "24px auto", ...style }}>
            <Doughnut data={chartData} options={options} />
        </div>
    );
}
