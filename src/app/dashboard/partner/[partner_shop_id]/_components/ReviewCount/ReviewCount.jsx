'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * (percent < 0.1 ? 0.8 : 0.6);
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{ fontSize: '12px' }}
    >
      {`${value}`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const color = payload[0].payload.color;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: color,
          marginRight: '8px',
        }}
      />
      <p style={{ margin: 0, fontSize: '12px' }}>
        {payload[0].name}: {payload[0].value}
      </p>
    </div>
  );
};

const renderLegend = ({ hiddenColumns, toggleColumn }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
      {hiddenColumns.map((item) => (
        <div
          key={item.name}
          onClick={() => toggleColumn(item.name)}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '20px',
            cursor: 'pointer',
            textDecoration: item.hidden ? 'line-through' : 'none',
            color: item.hidden ? '#aaa' : '#000',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: item.color,
              marginRight: '5px',
            }}
          />
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default function ReviewCountPie({ dataPartner }) {
  const [hiddenColumns, setHiddenColumns] = useState([]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a83279', '#00C49F'];

  const updatedDataPartner = dataPartner.map((app, index) => ({
    ...app,
    color: COLORS[index % COLORS.length],
  }));

  const reviewData = updatedDataPartner.map((app) => ({
    name: app.app_name,
    value: app.review_count,
    color: app.color,
  }));

  const filteredData = reviewData.filter((data) => !hiddenColumns.includes(data.name));

  const toggleColumn = (name) => {
    setHiddenColumns((prev) => (prev.includes(name) ? prev.filter((key) => key !== name) : [...prev, name]));
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={filteredData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          content={() =>
            renderLegend({
              hiddenColumns: reviewData.map((item) => ({
                name: item.name,
                color: item.color,
                hidden: hiddenColumns.includes(item.name),
              })),
              toggleColumn,
            })
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
