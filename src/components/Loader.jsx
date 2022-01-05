import React from 'react';
import { Spin } from 'antd';

const Loader = () => (
  <div className="flex justify-center items-center py-3">
    <Spin />
  </div>
);

export default Loader;