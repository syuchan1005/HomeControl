import React, { FC, useMemo } from 'react';
import { ResponsiveLineCanvas } from '@nivo/line';
import { SensorData } from '@common/GQLTypes';

interface SensorDataLineChartProps {
  data: Array<SensorData>;
}

const SensorDataLineChart: FC<SensorDataLineChartProps> = (props: SensorDataLineChartProps) => {
  const { data } = props;

  const mappedData = useMemo(() => [
    {
      id: 'sensor',
      color: 'rgb(255, 0, 0)',
      data: data.map(({ value, createdAt }) => {
        const created = new Date(createdAt);
        return {
          x: `${created.getMinutes()}m${created.getSeconds()}s`,
          y: value,
        };
      }),
    },
  ], [data]);

  return (
    <ResponsiveLineCanvas
      data={mappedData}
      margin={{
        top: 10, right: 30, bottom: 30, left: 50,
      }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false,
      }}
      axisTop={null}
      axisRight={null}
      colors={{ scheme: 'nivo' }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
    />
  );
};

export default SensorDataLineChart;
