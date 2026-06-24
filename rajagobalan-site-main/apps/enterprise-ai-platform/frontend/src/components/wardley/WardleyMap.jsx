import React, { useEffect, useRef } from 'react';
import { WARDLEY_RECOMMENDATIONS } from '../../utils/constants';

export default function WardleyMap({ components }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !components || components.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const padding = 60;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const graphWidth = canvasWidth - padding * 2;
    const graphHeight = canvasHeight - padding * 2;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw background grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = padding + (graphWidth / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvasHeight - padding);
      ctx.stroke();

      const y = padding + (graphHeight / 10) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvasWidth - padding, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, canvasHeight - padding);
    ctx.lineTo(canvasWidth - padding, canvasHeight - padding);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvasHeight - padding);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#333333';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // X-axis labels
    const xLabels = ['Genesis', 'Custom', 'Product', 'Commodity'];
    xLabels.forEach((label, i) => {
      const x = padding + (graphWidth / (xLabels.length - 1)) * i;
      ctx.fillText(label, x, canvasHeight - padding + 20);
    });

    // Y-axis labels
    const yLabels = ['Invisible', 'Visible'];
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    yLabels.forEach((label, i) => {
      const y = canvasHeight - padding - (graphHeight / (yLabels.length - 1)) * i;
      ctx.fillText(label, padding - 20, y);
    });

    // X-axis title
    ctx.textAlign = 'center';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Evolution', canvasWidth / 2, canvasHeight - 10);

    // Y-axis title
    ctx.save();
    ctx.translate(15, canvasHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Visibility', 0, 0);
    ctx.restore();

    // Plot components
    components.forEach((component) => {
      const evolutionStages = ['Genesis', 'Custom', 'Product', 'Commodity'];
      const evolutionIndex = evolutionStages.indexOf(component.evolution);
      const evolutionX = evolutionIndex !== -1 ? evolutionIndex / (evolutionStages.length - 1) : 0.5;

      const visibilityMin = 0;
      const visibilityMax = 1;
      const visibilityY = (component.visibility - visibilityMin) / (visibilityMax - visibilityMin);

      const x = padding + graphWidth * evolutionX;
      const y = canvasHeight - padding - graphHeight * visibilityY;

      // Get color based on recommendation
      const recommendationColor = WARDLEY_RECOMMENDATIONS[component.recommendation.toLowerCase()]?.color || '#6b7280';

      // Draw circle
      ctx.fillStyle = recommendationColor;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();

      // Draw circle border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#333333';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(component.name, x, y);
    });

    // Draw legend
    const legendX = canvasWidth - 180;
    const legendY = padding + 20;
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'left';
    ctx.fillText('Recommendations:', legendX, legendY);

    Object.entries(WARDLEY_RECOMMENDATIONS).forEach((entry, idx) => {
      const [key, value] = entry;
      const y = legendY + 25 + idx * 20;

      ctx.fillStyle = value.color;
      ctx.beginPath();
      ctx.arc(legendX + 10, y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#333333';
      ctx.font = '11px sans-serif';
      ctx.fillText(value.label, legendX + 25, y);
    });
  }, [components]);

  return (
    <div className="w-full bg-white rounded-lg shadow">
      <canvas
        ref={canvasRef}
        width={900}
        height={600}
        className="w-full border border-gray-200 rounded-lg"
      />
    </div>
  );
}
