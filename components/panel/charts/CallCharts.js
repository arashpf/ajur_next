import { Doughnut, Line } from "react-chartjs-2";
import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend,
CategoryScale,
LinearScale,
PointElement,
LineElement
} from "chart.js";

ChartJS.register(
ArcElement,
Tooltip,
Legend,
CategoryScale,
LinearScale,
PointElement,
LineElement
);

export default function CallCharts({ data }) {

if(!data) return null;

const remaining = data.total - data.used;

const doughnutData = {
labels:["مصرف شده","باقی مانده"],
datasets:[
{
data:[data.used, remaining],
backgroundColor:["#ef5350","#66bb6a"],
borderWidth:0
}
]
};

const lineData = {
labels:data.timeline.map(i=>i.date),
datasets:[
{
label:"تماس ها",
data:data.timeline.map(i=>i.count),
borderColor:"#1565c0",
backgroundColor:"rgba(21,101,192,0.2)",
tension:0.4
}
]
};

return (
<div style={{marginBottom:40}}>

<h3 style={{marginBottom:10}}>آمار تماس</h3>

<div style={{maxWidth:260,margin:"auto"}}>
<Doughnut data={doughnutData}/>
</div>

<div style={{marginTop:25}}>
<Line data={lineData}/>
</div>

</div>
);
}
