import React from 'react';
import Form1003 from './Form1003';
import type { FormData } from '../../../types';

interface URLAFlowProps {
  initialData: FormData;
  onDataChange?: (data: Partial<FormData>) => void;
}

const URLAFlow: React.FC<URLAFlowProps> = ({ initialData, onDataChange }) => {
  return <Form1003 initialData={initialData} />;
};

export default URLAFlow;

