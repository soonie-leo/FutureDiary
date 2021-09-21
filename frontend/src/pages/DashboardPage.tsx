import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import axios from 'axios';

import { IAssetInfo, ITargetInfo } from '../components/Dashboard/Interface';
import DashboardInfo from '../components/Dashboard/DashboardInfo';
import DashboardChart from '../components/Dashboard/DashboardChart';
import BaseSettingDialog from '../components/Dashboard/BaseSettingDialog';

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

const defaultAssetInfo = {
  date: '',
  netAsset: 0,
  loan: 0,
  realty: 0,
  stock: 0,
  cash: 0,
};

const defaultTargetInfo = {
  annualAsset: 0,
  monthlyIncome: 0,
  monthlyConsumption: 0,
};

const DashboardPage: React.FC = () => {
  const classes = useStyles();
  const [assetInfo, setAssetInfo] = React.useState<IAssetInfo>(defaultAssetInfo);
  const [targetInfo, setTargetInfo] = React.useState<ITargetInfo>(defaultTargetInfo);
  const [baseSettingVisible, setBaseSettingVisible] = React.useState(false);
  const [progressOpen, setProgressOpen] = React.useState(false);

  React.useEffect(() => {
    const getTargetAmount = async () => {
      setProgressOpen(true);
      const responseA = await axios.get('/api/asset');
      const responseB = await axios.get('/api/target');
      if (responseA.data.success && responseB.data.success) {
        console.log(responseA.data);
        setAssetInfo(responseA.data.data);
        setTargetInfo(responseB.data.data);
      } else {
        setBaseSettingVisible(true);
      }
      setProgressOpen(false);
    };
    getTargetAmount();
  }, []);

  return (
    <>
      <DashboardInfo assetInfo={assetInfo} targetInfo={targetInfo} />
      <Divider classes={{ root: classes.divider }} />
      <DashboardChart />
      <Backdrop className={classes.backdrop} open={progressOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <BaseSettingDialog visible={baseSettingVisible} isMobile={false} />
    </>
  );
};

export default DashboardPage;
