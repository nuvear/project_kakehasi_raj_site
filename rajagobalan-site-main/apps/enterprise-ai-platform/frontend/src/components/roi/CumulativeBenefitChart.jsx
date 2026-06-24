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
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function CumulativeBenefitChart({ data }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No cumulative benefit data available
      </div>
    );
  }

  const chartData = {
    labels: data.map((point, index) => `Month ${index + 1}`),
    datasets: [
      {
        label: 'Cumulative Benefit',
        data: data.map((point) => point / 1000),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return '$' + context.parsed.y.toFixed(0) + 'K';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '$' + value.toFixed(0) + 'K';
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
