'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { QUADRANT_COLORS, QUADRANT_LABELS } from '../../utils/constants';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Filler);

const quadrantPlugin = {
  id: 'quadrantPlugin',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;
    const { left, top, width, height } = chartArea;
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    ctx.save();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(centerX, top);
    ctx.lineTo(centerX, top + height);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(left, centerY);
    ctx.lineTo(left + width, centerY);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Quadrant labels
    const labelOffset = 30;
    ctx.fillText(QUADRANT_LABELS.bigBet, left + labelOffset, top + labelOffset);
    ctx.fillText(QUADRANT_LABELS.quickWin, left + width - labelOffset, top + labelOffset);
    ctx.fillText(QUADRANT_LABELS.deprioritize, left + labelOffset, top + height - labelOffset);
    ctx.fillText(QUADRANT_LABELS.fillIn, left + width - labelOffset, top + height - labelOffset);

    ctx.restore();
  },
};

function getQuadrantColor(feasibility, impact) {
  if (feasibility >= 5 && impact >= 5) return QUADRANT_COLORS.quickWin;
  if (feasibility < 5 && impact >= 5) return QUADRANT_COLORS.bigBet;
  if (feasibility >= 5 && impact < 5) return QUADRANT_COLORS.fillIn;
  return QUADRANT_COLORS.deprioritize;
}

export default function MatrixView({ projects }) {
  const chartData = useMemo(() => {
    if (!projects || projects.length === 0) {
      return {
        datasets: [],
      };
    }

    return {
      datasets: [
        {
          label: 'Projects',
          data: projects.map((project) => ({
            x: project.feasibility_score || 5,
            y: project.impact_score || 5,
            r: (project.estimated_roi || 10) / 2 + 5, // bubble radius
            projectId: project.id,
            projectName: project.name,
            status: project.status,
          })),
          backgroundColor: projects.map((project) =>
            getQuadrantColor(
              project.feasibility_score || 5,
              project.impact_score || 5
            )
          ),
          borderColor: projects.map((project) =>
            getQuadrantColor(
              project.feasibility_score || 5,
              project.impact_score || 5
            )
          ),
          borderWidth: 2,
          opacity: 0.7,
        },
      ],
    };
  }, [projects]);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        cornerRadius: 6,
        callbacks: {
          title() {
            return '';
          },
          label(context) {
            const data = context.raw;
            return [
              `Project: ${data.projectName}`,
              `Feasibility: ${data.x.toFixed(1)}/10`,
              `Impact: ${data.y.toFixed(1)}/10`,
              `Status: ${data.status}`,
              `ROI: ${data.r * 2 - 10}%`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: 10,
        title: {
          display: true,
          text: 'Feasibility →',
          font: { size: 14, weight: 'bold' },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        min: 0,
        max: 10,
        title: {
          display: true,
          text: '← Impact',
          font: { size: 14, weight: 'bold' },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  return (
    <div className="w-full h-96 bg-white rounded-lg shadow-md p-6 mb-8">
      <Bubble data={chartData} options={options} plugins={[quadrantPlugin]} />
    </div>
  );
}
