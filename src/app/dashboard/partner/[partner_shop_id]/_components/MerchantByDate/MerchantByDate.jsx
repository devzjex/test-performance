'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label, hiddenColumns }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const filteredPayload = payload.filter((entry) => !hiddenColumns.includes(entry.name));

  if (filteredPayload.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h4 style={{ color: '#333', marginBottom: '10px' }}>Date: {label}</h4>
      {filteredPayload.map((entry, index) => (
        <div key={`tooltip-${index}`} style={{ marginBottom: '5px' }}>
          <p style={{ margin: 0, color: entry.color }}>
            <span>{entry.name}</span>: {Number.isInteger(entry.value) ? entry.value : entry.value.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default function MerchantByDate({ dataPartner }) {
  const [hiddenColumns, setHiddenColumns] = useState([]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a83279'];

  const updatedDataPartner = dataPartner.map((app, index) => ({
    ...app,
    color: COLORS[index % COLORS.length],
  }));

  const processEarningData = () => {
    const allDates = new Set();
    updatedDataPartner.forEach((app) => {
      app.merchant_by_date?.forEach((entry) => {
        allDates.add(entry.date);
      });
    });

    const sortedDates = Array.from(allDates).sort();

    const chartData = sortedDates.map((date) => {
      const dataPoint = { date };

      updatedDataPartner.forEach((app) => {
        const appEarning = app.merchant_by_date?.find((entry) => entry.date === date);
        dataPoint[app.app_name] = appEarning && appEarning.merchant >= 0 ? appEarning.merchant : 0;
      });

      return dataPoint;
    });

    return chartData;
  };

  const chartData = processEarningData();

  const toggleColumn = (dataKey) => {
    setHiddenColumns((prev) => (prev.includes(dataKey) ? prev.filter((key) => key !== dataKey) : [...prev, dataKey]));
  };

  const maxValue = Math.max(
    ...chartData.map((item) => Math.max(...Object.values(item).filter((value) => !isNaN(value) && value >= 0))),
  );

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
          <YAxis
            domain={[0, maxValue]}
            tickCount={Math.ceil(maxValue / 1000) + 1}
            ticks={Array.from({ length: Math.ceil(maxValue / 1000) + 1 }, (_, index) => index * 1000)}
          />
          <Tooltip content={<CustomTooltip hiddenColumns={hiddenColumns} active payload label />} />
          <Legend
            verticalAlign="bottom"
            payload={updatedDataPartner.map((app) => ({
              id: app.app_name,
              value: app.app_name,
              color: app.color,
              type: 'line',
            }))}
            onClick={(e) => toggleColumn(e.value)}
            formatter={(value) => (
              <span
                style={{
                  textDecoration: hiddenColumns.includes(value) ? 'line-through' : 'none',
                  color: hiddenColumns.includes(value) ? '#aaa' : '#000',
                  cursor: 'pointer',
                }}
              >
                {value}
              </span>
            )}
          />
          {updatedDataPartner.map((app) =>
            !hiddenColumns.includes(app.app_name) ? (
              <Line
                key={app.app_id}
                type="monotone"
                dataKey={app.app_name}
                stroke={app.color}
                strokeWidth={2}
                dot={false}
              />
            ) : null,
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
