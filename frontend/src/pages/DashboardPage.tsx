import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import axios from 'axios';

import { IAmountInfo } from '../components/Dashboard/Interface';
import AmountInfo from '../components/Dashboard/AmountInfo';
import AmountChart from '../components/Dashboard/AmountChart';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    divider: {
      margin: '40px 0px',
      backgroundColor: 'rgb(255, 255, 255, 0.5)',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

const defaultAmountInfo = {
  annualTargetAmount: 25600000,
  monthlyTargetAmount: 2400000,
  currentNetAssets: 35100000,
  averageMonthlyIncome: 3900000,
};

const DashboardPage: React.FC = () => {
  const classes = useStyles();
  const [amountInfo, setAmountInfo] = React.useState<IAmountInfo>(defaultAmountInfo);
  const [progressOpen, setProgressOpen] = React.useState(false);

  React.useEffect(() => {
    const getTargetAmount = async () => {
      setProgressOpen(true);
      const response = await axios.get('/api/amount');
      console.log(response.data);
      setAmountInfo(response.data);
      setProgressOpen(false);
    };
    getTargetAmount();
  }, []);

  return (
    <>
      <AmountInfo amountInfo={amountInfo} />
      <Divider classes={{ root: classes.divider }} />
      <AmountChart amountInfo={amountInfo} />
      <Backdrop className={classes.backdrop} open={progressOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default DashboardPage;
