// components/G-ads/AdChart.js
import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
} from "chart.js";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";

dayjs.extend(jalali);
dayjs.locale("fa");

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function AdChart({ chartData }) {
    const labels = chartData.map((point) =>
        dayjs(point.date).locale("fa").format("YY/MM/DD")
    );

    const data = {
        labels,
        datasets: [
            {
                label: "تعداد کلیک روزانه",
                data: chartData.map((point) => point.views),
                fill: false,
                borderColor: "rgba(75,192,192,1)",
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: true, labels: { font: { family: "IRANSans", size: 14 } } },
        },
        scales: {
            x: {
                ticks: {
                    font: { family: "IRANSans", size: 12 },
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10,
                    font: { family: "IRANSans", size: 12 },
                },
            },
        },
    };

    return <Line data={data} options={options} />;
}
