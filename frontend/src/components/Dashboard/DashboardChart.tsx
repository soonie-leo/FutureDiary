import * as React from 'react';
// import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { Bar } from 'react-chartjs-2';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const AmountChart: React.FC = () => {
  //   const classes = useStyles();

  const data = {
    labels: ['20210909', '20210910', '20210911', '20210912', '20210913'],
    datasets: [
      {
        label: '용돈',
        data: [20, 22, 21, 30, 18],
        fill: false,
        backgroundColor: 'rgb(242, 182, 179, 0.8)',
        hoverBackgroundColor: 'rgb(242, 182, 179, 1.0)',
      },
      {
        label: '교통',
        data: [10, 18, 14, 10, 12],
        fill: false,
        backgroundColor: 'rgb(219, 182, 149, 0.8)',
        hoverBackgroundColor: 'rgb(219, 182, 149, 1.0)',
      },
      {
        label: '식사',
        data: [40, 35, 35, 40, 45],
        fill: false,
        backgroundColor: 'rgb(242, 229, 177, 0.8)',
        hoverBackgroundColor: 'rgb(242, 229, 177, 1.0)',
      },
      {
        label: '통신비',
        data: [20, 15, 20, 10, 15],
        fill: false,
        backgroundColor: 'rgb(196, 219, 149, 0.8)',
        hoverBackgroundColor: 'rgb(196, 219, 149, 1.0)',
      },
      {
        label: '공과금',
        data: [10, 10, 10, 10, 10],
        fill: false,
        backgroundColor: 'rgb(217, 255, 228, 0.8)',
        hoverBackgroundColor: 'rgb(217, 255, 228, 1.0)',
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        // align: 'end',
        title: {
          color: '#fff',
        },
        labels: {
          color: 'rgb(255, 255, 255, 0.87)',
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: 'rgb(255, 255, 255, 0.87)',
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: 'rgb(255, 255, 255, 0.87)',
        },
      },
    },
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <Typography>{'일간 소비'}</Typography>
        <Bar data={data} options={options} />
      </Grid>
      <Grid item xs={6}>
        <Typography>{'주간 소비'}</Typography>
        <Bar data={data} options={options} />
      </Grid>
    </Grid>
  );
};

export default AmountChart;
