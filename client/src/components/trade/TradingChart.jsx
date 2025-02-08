import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TradingChart({ data }) {
  const chartData = {
    labels: data.map(([timestamp]) => 
      new Date(timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: 'Price (USD)',
        data: data.map(([, price]) => price),
        borderColor: '#1E90FF',
        backgroundColor: 'rgba(30, 144, 255, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(234, 234, 234, 0.1)',
        },
        ticks: {
          color: '#EAEAEA',
        },
      },
      y: {
        grid: {
          color: 'rgba(234, 234, 234, 0.1)',
        },
        ticks: {
          color: '#EAEAEA',
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="h-[400px] w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default TradingChart;