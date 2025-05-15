'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label, hiddenColumns }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const details = payload[0].payload.details;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gridTemplateRows: 'repeat(2, auto)',
        gap: '10px',
        alignItems: 'start',
        width: '100%',
        maxWidth: '600px',
      }}
    >
      <div style={{ gridColumn: '1 / -1', marginBottom: '8px' }}>
        <h4 style={{ color: '#333', margin: 0 }}>Date: {label}</h4>
      </div>

      {details.map((item, index) => (
        <div
          key={`tooltip-item-${index}`}
          style={{
            borderBottom: index !== details.length - 1 ? '1px solid #f0f0f0' : 'none',
            paddingBottom: '10px',
          }}
        >
          <span style={{ color: '#333', fontWeight: 'bold' }}>{item.app_name}</span>
          <ul style={{ margin: '5px 0 0', padding: 0, listStyle: 'none', color: '#555' }}>
            {!hiddenColumns.includes('group1') && (
              <li style={{ color: '#8884d8', whiteSpace: 'nowrap' }}>
                Installed + Reactivated: <strong>{item.RELATIONSHIP_INSTALLED + item.RELATIONSHIP_REACTIVATED}</strong>
              </li>
            )}
            {!hiddenColumns.includes('group2') && (
              <li style={{ color: '#82ca9d', whiteSpace: 'nowrap' }}>
                Uninstalled + Deactivated:{' '}
                <strong>{item.RELATIONSHIP_DEACTIVATED + item.RELATIONSHIP_UNINSTALLED}</strong>
              </li>
            )}
            {!hiddenColumns.includes('group3') && (
              <li style={{ color: '#ffc658', whiteSpace: 'nowrap' }}>
                Activated + Unfrozen:{' '}
                <strong>{item.SUBSCRIPTION_CHARGE_ACTIVATED + item.SUBSCRIPTION_CHARGE_UNFROZEN}</strong>
              </li>
            )}
            {!hiddenColumns.includes('group4') && (
              <li style={{ color: '#ff8042', whiteSpace: 'nowrap' }}>
                Canceled + Frozen + Declined:{' '}
                <strong>
                  {item.SUBSCRIPTION_CHARGE_CANCELED +
                    item.SUBSCRIPTION_CHARGE_FROZEN +
                    item.SUBSCRIPTION_CHARGE_DECLINED}
                </strong>
              </li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

const renderLegend = ({ hiddenColumns, toggleColumn }) => {
  const legendItems = [
    { key: 'group1', color: '#8884d8', name: 'Installed + Reactivated' },
    { key: 'group2', color: '#82ca9d', name: 'Uninstalled + Deactivated' },
    { key: 'group3', color: '#ffc658', name: 'Activated + Unfrozen' },
    { key: 'group4', color: '#ff8042', name: 'Canceled + Frozen + Declined' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
      {legendItems.map((item) => (
        <div
          key={item.key}
          onClick={() => toggleColumn(item.key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '20px',
            cursor: 'pointer',
            textDecoration: hiddenColumns.includes(item.key) ? 'line-through' : 'none',
            color: hiddenColumns.includes(item.key) ? '#aaa' : '#000',
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

export default function EventCountByDate({ dataPartner }) {
  const [hiddenColumns, setHiddenColumns] = useState([]);

  const groupDataForBarChart = (dataPartner) => {
    const groupedData = {};

    dataPartner.forEach((app) => {
      const appId = app.app_id;
      const appName = app.app_name;
      const events = app.event_count_by_date;

      events.forEach((event) => {
        const {
          date,
          RELATIONSHIP_INSTALLED = 0,
          RELATIONSHIP_REACTIVATED = 0,
          RELATIONSHIP_DEACTIVATED = 0,
          RELATIONSHIP_UNINSTALLED = 0,
          SUBSCRIPTION_CHARGE_ACTIVATED = 0,
          SUBSCRIPTION_CHARGE_UNFROZEN = 0,
          SUBSCRIPTION_CHARGE_CANCELED = 0,
          SUBSCRIPTION_CHARGE_FROZEN = 0,
          SUBSCRIPTION_CHARGE_DECLINED = 0,
        } = event;

        if (!groupedData[date]) {
          groupedData[date] = {
            date,
            group1: 0,
            group2: 0,
            group3: 0,
            group4: 0,
            details: [],
          };
        }

        groupedData[date].group1 += RELATIONSHIP_INSTALLED + RELATIONSHIP_REACTIVATED;
        groupedData[date].group2 += RELATIONSHIP_UNINSTALLED + RELATIONSHIP_DEACTIVATED;
        groupedData[date].group3 += SUBSCRIPTION_CHARGE_ACTIVATED + SUBSCRIPTION_CHARGE_UNFROZEN;
        groupedData[date].group4 +=
          SUBSCRIPTION_CHARGE_CANCELED + SUBSCRIPTION_CHARGE_FROZEN + SUBSCRIPTION_CHARGE_DECLINED;

        groupedData[date].details.push({
          app_id: appId,
          app_name: appName,
          RELATIONSHIP_INSTALLED,
          RELATIONSHIP_REACTIVATED,
          RELATIONSHIP_DEACTIVATED,
          RELATIONSHIP_UNINSTALLED,
          SUBSCRIPTION_CHARGE_ACTIVATED,
          SUBSCRIPTION_CHARGE_UNFROZEN,
          SUBSCRIPTION_CHARGE_CANCELED,
          SUBSCRIPTION_CHARGE_FROZEN,
          SUBSCRIPTION_CHARGE_DECLINED,
        });
      });
    });

    return Object.values(groupedData);
  };

  const chartData = groupDataForBarChart(dataPartner);

  const toggleColumn = (dataKey) => {
    setHiddenColumns((prev) => (prev.includes(dataKey) ? prev.filter((key) => key !== dataKey) : [...prev, dataKey]));
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip hiddenColumns={hiddenColumns} />} />
        <Legend content={() => renderLegend({ hiddenColumns, toggleColumn })} />
        {!hiddenColumns.includes('group1') && (
          <Bar barSize={30} dataKey="group1" stackId="ac" fill="#8884d8" name="Installed + Reactivated" />
        )}
        {!hiddenColumns.includes('group2') && (
          <Bar barSize={30} dataKey="group2" stackId="ac" fill="#82ca9d" name="Uninstalled + Deactivated" />
        )}
        {!hiddenColumns.includes('group3') && (
          <Bar barSize={30} dataKey="group3" stackId="a" fill="#ffc658" name="Activated + Unfrozen" />
        )}
        {!hiddenColumns.includes('group4') && (
          <Bar barSize={30} dataKey="group4" stackId="a" fill="#ff8042" name="Canceled + Frozen + Declined" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
