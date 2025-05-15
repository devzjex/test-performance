'use client';

import { Select } from 'antd';
import React from 'react';
import { DownOutlined } from '@ant-design/icons';

export default function SelectByLanguage(props) {
  const { Option } = Select;
  const OPTION_BY_LANGUAGE = [
    { value: 'uk', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'de', label: 'German' },
    { value: 'fr', label: 'French' },
    { value: 'cn', label: 'Chinese' },
    { value: 'tw', label: 'Traditional Chinese' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <Select
        value={props.selectValue}
        onChange={props.handleSelectChange}
        style={{ width: '120px' }}
        disabled={props.disabled}
        suffixIcon={<DownOutlined style={{ display: 'flex' }} />}
      >
        {OPTION_BY_LANGUAGE.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}
