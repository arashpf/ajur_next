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

export default function SpecialCharts({ data }) {

if(!data) return null;

const chartData = {
labels:data.visits.map(v=>v.date),
datasets:[
{
label:"بازدید آگهی ویژه",
data:data.visits.map(v=>v.count),
borderColor:"#8e24aa",
backgroundColor:"rgba(142,36,170,0.2)",
tension:0.4
}
]
};

return (
<div style={{marginBottom:40}}>

<h3 style={{marginBottom:10}}>آمار بازدید ویژه</h3>

<Line data={chartData}/>

</div>
);
}
