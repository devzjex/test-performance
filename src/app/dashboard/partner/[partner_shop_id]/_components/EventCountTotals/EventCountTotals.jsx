'use client';

import { Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import React, { useState } from 'react';

const renderLegend = ({ hiddenColumns, toggleColumn }) => {
  const legendItems = [
    { name: 'Installed + Reactivated', color: '#8884d8' },
    { name: 'Uninstalled + Deactivated', color: '#82ca9d' },
    { name: 'Activated + Unfrozen', color: '#ffc658' },
    { name: 'Canceled + Frozen + Declined', color: '#ff8042' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
      {legendItems.map((item) => (
        <div
          key={item.name}
          onClick={() => toggleColumn(item.name)}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '20px',
            cursor: 'pointer',
            textDecoration: hiddenColumns.includes(item.name) ? 'line-through' : 'none',
            color: hiddenColumns.includes(item.name) ? '#aaa' : '#000',
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

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const detailedData = payload[0].payload.detailed;
  const color = payload[0].payload.fill;

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
      <p
        style={{
          fontWeight: 'bold',
          marginBottom: '10px',
          color: color,
        }}
      >
        {payload[0].name} (Total: {payload[0].value})
      </p>
      {detailedData.map((entry, index) => (
        <div key={`tooltip-detail-${index}`}>
          <p style={{ color: '#555' }}>
            <span>{entry.app_name}</span>: {entry.value}
          </p>
        </div>
      ))}
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {value}
    </text>
  );
};

export default function EventCountTotals({ dataPartner }) {
  const [hiddenColumns, setHiddenColumns] = useState([]);

  const processEventCountTotals = () => {
    const groupedData = [];

    const COLORS_MAP = {
      'Installed + Reactivated': '#8884d8',
      'Uninstalled + Deactivated': '#82ca9d',
      'Activated + Unfrozen': '#ffc658',
      'Canceled + Frozen + Declined': '#ff8042',
    };

    dataPartner.forEach((app) => {
      const eventCountTotals = app.event_count_totals || [];
      const appId = app.app_id;
      const appName = app.app_name;

      groupedData.push({
        name: 'Installed + Reactivated',
        value:
          (eventCountTotals.find((item) => item._id === 'RELATIONSHIP_INSTALLED')?.total_count || 0) +
          (eventCountTotals.find((item) => item._id === 'RELATIONSHIP_REACTIVATED')?.total_count || 0),
        app_id: appId,
        app_name: appName,
        color: COLORS_MAP['Installed + Reactivated'],
      });

      groupedData.push({
        name: 'Uninstalled + Deactivated',
        value:
          (eventCountTotals.find((item) => item._id === 'RELATIONSHIP_UNINSTALLED')?.total_count || 0) +
          (eventCountTotals.find((item) => item._id === 'RELATIONSHIP_DEACTIVATED')?.total_count || 0),
        app_id: appId,
        app_name: appName,
        color: COLORS_MAP['Uninstalled + Deactivated'],
      });

      groupedData.push({
        name: 'Activated + Unfrozen',
        value:
          (eventCountTotals.find((item) => item._id === 'SUBSCRIPTION_CHARGE_ACTIVATED')?.total_count || 0) +
          (eventCountTotals.find((item) => item._id === 'SUBSCRIPTION_CHARGE_UNFROZEN')?.total_count || 0),
        app_id: appId,
        app_name: appName,
        color: COLORS_MAP['Activated + Unfrozen'],
      });

      groupedData.push({
        name: 'Canceled + Frozen + Declined',
        value:
          (eventCountTotals.find((item) => item._id === 'SUBSCRIPTION_CHARGE_CANCELED')?.total_count || 0) +
          (eventCountTotals.find((item) => item._id === 'SUBSCRIPTION_CHARGE_FROZEN')?.total_count || 0) +
          (eventCountTotals.find((item) => item._id === 'SUBSCRIPTION_CHARGE_DECLINED')?.total_count || 0),
        app_id: appId,
        app_name: appName,
        color: COLORS_MAP['Canceled + Frozen + Declined'],
      });
    });

    // Gộp dữ liệu theo `name`
    const aggregatedData = [];
    const nameMap = {};

    groupedData.forEach((item) => {
      if (!nameMap[item.name]) {
        nameMap[item.name] = { name: item.name, value: 0, color: item.color, detailed: [] };
        aggregatedData.push(nameMap[item.name]);
      }
      nameMap[item.name].value += item.value;
      nameMap[item.name].detailed.push({
        app_name: item.app_name,
        value: item.value,
      });
    });

    // Lọc những mục bị ẩn
    return aggregatedData.filter((entry) => !hiddenColumns.includes(entry.name));
  };

  const pieData = processEventCountTotals();

  const toggleColumn = (name) => {
    setHiddenColumns((prev) => (prev.includes(name) ? prev.filter((key) => key !== name) : [...prev, name]));
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={() => renderLegend({ hiddenColumns, toggleColumn })} />
      </PieChart>
    </ResponsiveContainer>
  );
}
