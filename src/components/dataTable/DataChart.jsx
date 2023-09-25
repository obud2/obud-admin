import React from 'react';
import styled from 'styled-components';

import {
  Chart as ChartJS,
  ArcElement,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';

import { Chart } from 'react-chartjs-2';

ChartJS?.register(
  ArcElement,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
);

const Container = styled.div`
  width: 100%;
  max-width: 500px;
`;

const BackgroundColors = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
];

const BorderColors = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
];

const DataChart = (props) => {
  const { type, option, data } = props;

  return (
    <Container>
      <Chart
        type={type}
        options={option}
        data={{
          ...data,
          backgroundColor: BackgroundColors,
          borderColor: BorderColors,
          borderWidth: 1,
        }}
        {...props}
      />
    </Container>
  );
};

export default DataChart;
