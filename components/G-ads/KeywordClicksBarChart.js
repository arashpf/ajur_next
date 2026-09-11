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
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export default function KeywordClicksBarChart({ data }) {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: "تعداد کلیک بر اساس کلمه کلیدی",
                data: data.values,
                backgroundColor: "#bc323a",
                borderRadius: 3,
                datalabels: {
                    anchor: "start",
                    align: "start",
                    color: "#fff",
                    font: {
                        family: "inherit",
                        size: 14,
                    },
                    formatter: (value) => value,
                    clip: false,
                },
            },
        ],
    };

    const options = {
        // indexAxis: "y",
        responsive: true,
        plugins: {
            datalabels: {
                display: true,
            },
            legend: { display: false },
            title: { display: false },
            tooltip: { enabled: true },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: { font: { family: "inherit", size: 14 } },
            },
            y: {
                ticks: { font: { family: "inherit", size: 14 } },
            },
        },
    };

    return (
        <div style={{ justifyItems: "center", }}>
            <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
        </div>
    );
}
