'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label, hiddenColumns }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const details = payload[0].payload.details;
  const totalAmount = payload[0].payload.total_amount_per_day;

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
      <h4 style={{ marginBottom: '8px', color: '#333', whiteSpace: 'nowrap' }}>Date: {label}</h4>
      <p style={{ marginBottom: '8px', color: '#333', whiteSpace: 'nowrap' }}>
        Total Amount By Day: <strong>{Number.isInteger(totalAmount) ? totalAmount : totalAmount.toFixed(2)}</strong>
      </p>

      {details.map((item, index) => (
        <div key={`tooltip-item-${index}`} style={{ marginBottom: '10px' }}>
          <span style={{ color: '#333', whiteSpace: 'nowrap' }}>{item.app_name}</span>:
          <ul style={{ margin: '5px 0 0 15px', padding: 0, color: '#555' }}>
            {!hiddenColumns.includes('group1') && (
              <li style={{ color: '#8884d8', whiteSpace: 'nowrap', paddingBottom: 5 }}>
                Charge Activated:{' '}
                <strong>
                  {Number.isInteger(item.SUBSCRIPTION_CHARGE_ACTIVATED)
                    ? item.SUBSCRIPTION_CHARGE_ACTIVATED
                    : item.SUBSCRIPTION_CHARGE_ACTIVATED.toFixed(2)}
                </strong>
              </li>
            )}
            {!hiddenColumns.includes('group2') && (
              <li style={{ color: '#82ca9d', whiteSpace: 'nowrap', paddingBottom: 5 }}>
                Charge Activated:{' '}
                <strong>
                  {Number.isInteger(item.SUBSCRIPTION_CHARGE_CANCELED)
                    ? item.SUBSCRIPTION_CHARGE_CANCELED
                    : item.SUBSCRIPTION_CHARGE_CANCELED.toFixed(2)}
                </strong>
              </li>
            )}
            {!hiddenColumns.includes('group3') && (
              <li style={{ color: '#ffc658', whiteSpace: 'nowrap', paddingBottom: 5 }}>
                Charge Frozen:{' '}
                <strong>
                  {Number.isInteger(item.SUBSCRIPTION_CHARGE_FROZEN)
                    ? item.SUBSCRIPTION_CHARGE_FROZEN
                    : item.SUBSCRIPTION_CHARGE_FROZEN.toFixed(2)}
                </strong>
              </li>
            )}
            {!hiddenColumns.includes('group4') && (
              <li style={{ color: '#ff8042', whiteSpace: 'nowrap', paddingBottom: 5 }}>
                Charge Unfrozen:{' '}
                <strong>
                  {Number.isInteger(item.SUBSCRIPTION_CHARGE_UNFROZEN)
                    ? item.SUBSCRIPTION_CHARGE_UNFROZEN
                    : item.SUBSCRIPTION_CHARGE_UNFROZEN.toFixed(2)}
                </strong>
              </li>
            )}
            {!hiddenColumns.includes('total') && (
              <li style={{ color: '#a83279', whiteSpace: 'nowrap', paddingBottom: 5 }}>
                Total Amount:{' '}
                <strong>
                  {Number.isInteger(item.total_amount_per_day)
                    ? item.total_amount_per_day
                    : item.total_amount_per_day.toFixed(2)}
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
    { key: 'group1', color: '#8884d8', name: 'Charge Activated' },
    { key: 'group2', color: '#82ca9d', name: 'Charge Canceled' },
    { key: 'group3', color: '#ffc658', name: 'Charge Frozen' },
    { key: 'group4', color: '#ff8042', name: 'Charge Unfrozen' },
    { key: 'total', color: '#a83279', name: 'Total Amount' },
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

export default function EventAmountByDate({ dataPartner }) {
  const [hiddenColumns, setHiddenColumns] = useState([]);

  const groupDataForBarChart = (dataPartner) => {
    const groupedData = {};

    dataPartner.forEach((app) => {
      const appId = app.app_id;
      const appName = app.app_name;
      const events = app.event_amount_by_date;

      events.forEach((event) => {
        const {
          date,
          SUBSCRIPTION_CHARGE_ACTIVATED = 0,
          SUBSCRIPTION_CHARGE_CANCELED = 0,
          SUBSCRIPTION_CHARGE_FROZEN = 0,
          SUBSCRIPTION_CHARGE_UNFROZEN = 0,
          total_amount_per_day = 0,
        } = event;

        if (!groupedData[date]) {
          groupedData[date] = {
            date,
            group1: 0,
            group2: 0,
            group3: 0,
            group4: 0,
            total_amount_per_day: 0,
            details: [],
          };
        }

        groupedData[date].group1 += SUBSCRIPTION_CHARGE_ACTIVATED;
        groupedData[date].group2 += SUBSCRIPTION_CHARGE_CANCELED;
        groupedData[date].group3 += SUBSCRIPTION_CHARGE_FROZEN;
        groupedData[date].group4 += SUBSCRIPTION_CHARGE_UNFROZEN;
        groupedData[date].total_amount_per_day += total_amount_per_day;

        groupedData[date].details.push({
          app_id: appId,
          app_name: appName,
          SUBSCRIPTION_CHARGE_ACTIVATED,
          SUBSCRIPTION_CHARGE_CANCELED,
          SUBSCRIPTION_CHARGE_FROZEN,
          SUBSCRIPTION_CHARGE_UNFROZEN,
          total_amount_per_day,
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
          <Bar barSize={30} dataKey="group1" stackId="ac" fill="#8884d8" name="Activated" />
        )}
        {!hiddenColumns.includes('group2') && (
          <Bar barSize={30} dataKey="group2" stackId="ac" fill="#82ca9d" name="Canceled" />
        )}
        {!hiddenColumns.includes('group3') && (
          <Bar barSize={30} dataKey="group3" stackId="a" fill="#ffc658" name="Frozen" />
        )}
        {!hiddenColumns.includes('group4') && (
          <Bar barSize={30} dataKey="group4" stackId="a" fill="#ff8042" name="Unfrozen" />
        )}
        {!hiddenColumns.includes('total') && (
          <Bar barSize={30} dataKey="total_amount_per_day" fill="#a83279" name="Total Amount" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
