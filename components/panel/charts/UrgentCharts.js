import { Line } from "react-chartjs-2";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Tooltip,
Legend
);

export default function UrgentCharts({ data }) {

if(!data) return null;

const chartData = {
labels:data.visits.map(v=>v.date),
datasets:[
{
label:"بازدید آگهی فوری",
data:data.visits.map(v=>v.count),
borderColor:"#f57c00",
backgroundColor:"rgba(245,124,0,0.2)",
tension:0.4
}
]
};

return (
<div style={{marginBottom:40}}>

<h3 style={{marginBottom:10}}>آمار بازدید فوری</h3>

<Line data={chartData}/>

</div>
);
}
