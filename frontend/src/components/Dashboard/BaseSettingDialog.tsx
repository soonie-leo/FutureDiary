import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { TransitionProps } from '@material-ui/core/transitions';
import { getNumberWithComma } from '../common/utils';
import axios from 'axios';
import { Divider } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    width100: {
      width: '100%',
    },
    appbar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    textFiled: {
      width: '100%',
    },
    mainBtn: {
      backgroundColor: '#8dddd2',
      '&:hover': {
        backgroundColor: '#6cbcb1',
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children?: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  visible: boolean;
  isMobile: boolean;
}

const BaseSettingDialog: React.FC<Props> = ({ visible, isMobile }: Props) => {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const [loan, setLoan] = React.useState(0);
  const [realty, setRealty] = React.useState(0);
  const [stock, setStock] = React.useState(0);
  const [cash, setCash] = React.useState(0);

  const [targetAnnualAsset, setTargetAnnualAsset] = React.useState(0);
  const [targetMonthlyIncome, setTargetMonthlyIncome] = React.useState(0);
  const [targetMonthlyConsumption, setTargetMonthlyConsumption] = React.useState(0);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = async () => {
    const assetData = new FormData();
    assetData.append('date', new Date().toISOString().slice(0, 10).replace(/-/g, '.') + '.');
    assetData.append('cash', cash.toString());
    assetData.append('realty', realty.toString());
    assetData.append('stock', stock.toString());
    assetData.append('loan', loan.toString());
    assetData.append('netAsset', (cash + realty + stock - loan).toString());
    await axios.post('/api/asset', assetData);
    // TODO: 에러 처리

    const targetData = new FormData();
    targetData.append('annualAsset', targetAnnualAsset.toString());
    targetData.append('monthlyIncome', targetMonthlyIncome.toString());
    targetData.append('monthlyConsumption', targetMonthlyConsumption.toString());
    await axios.post('/api/target', targetData);
    // TODO: 에러 처리

    location.reload();
  };

  const getSteps = () => {
    return ['자산 설정', '목표 설정', '완료'];
  };

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <List>
            <ListItem>
              <TextField
                className={classes.textFiled}
                label="현금"
                value={getNumberWithComma(cash)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                }}
                onChange={(e) => {
                  let num = 0;
                  if (e.target.value != '') {
                    num = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                  }
                  setCash(num);
                }}
              />
            </ListItem>
            <ListItem>
              <TextField
                className={classes.textFiled}
                label="부동산"
                value={getNumberWithComma(realty)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                }}
                onChange={(e) => {
                  let num = 0;
                  if (e.target.value != '') {
                    num = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                  }
                  setRealty(num);
                }}
              />
            </ListItem>
            <ListItem>
              <TextField
                className={classes.textFiled}
                label="주식"
                value={getNumberWithComma(stock)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                }}
                onChange={(e) => {
                  let num = 0;
                  if (e.target.value != '') {
                    num = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                  }
                  setStock(num);
                }}
              />
            </ListItem>
            <ListItem>
              <TextField
                className={classes.textFiled}
                label="대출"
                value={getNumberWithComma(loan)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                }}
                onChange={(e) => {
                  let num = 0;
                  if (e.target.value != '') {
                    num = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                  }
                  setLoan(num);
                }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="총 자산"
                secondary={getNumberWithComma(cash + realty + stock - loan) + ' 원'}
              />
            </ListItem>
          </List>
        );
      case 1:
        return (
          <List>
            <ListItem>
              <TextField
                className={classes.textFiled}
                label="올해 목표 순자산"
                value={getNumberWithComma(targetAnnualAsset)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                }}
                onChange={(e) => {
                  let num = 0;
                  if (e.target.value != '') {
                    num = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                  }
                  setTargetAnnualAsset(num);
                }}
              />
            </ListItem>
            <ListItem>
              <TextField
                className={classes.textFiled}
                label="월간 목표 수입"
                value={getNumberWithComma(targetMonthlyIncome)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                }}
                onChange={(e) => {
                  let num = 0;
                  if (e.target.value != '') {
                    num = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                  }
                  setTargetMonthlyIncome(num);
                }}
              />
            </ListItem>
            <ListItem>
              <TextField
                className={classes.textFiled}
                label="월간 목표 소비"
                value={getNumberWithComma(targetMonthlyConsumption)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                }}
                onChange={(e) => {
                  let num = 0;
                  if (e.target.value != '') {
                    num = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                  }
                  setTargetMonthlyConsumption(num);
                }}
              />
            </ListItem>
          </List>
        );
      case 2:
        return (
          <>
            <Box display="flex" mb={2}>
              <TextField
                className={classes.width100}
                label="현금"
                value={getNumberWithComma(cash)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                  readOnly: true,
                  disableUnderline: true,
                }}
              />
              <TextField
                className={classes.width100}
                label="부동산"
                value={getNumberWithComma(realty)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                  readOnly: true,
                  disableUnderline: true,
                }}
              />
            </Box>
            <Box display="flex" mb={2}>
              <TextField
                className={classes.width100}
                label="주식"
                value={getNumberWithComma(stock)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                  readOnly: true,
                  disableUnderline: true,
                }}
              />
              <TextField
                className={classes.width100}
                label="대출"
                value={getNumberWithComma(loan)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                  readOnly: true,
                  disableUnderline: true,
                }}
              />
            </Box>
            <Divider />
            <Box display="flex" mt={2}>
              <TextField
                className={classes.width100}
                label="올해 목표 순자산"
                value={getNumberWithComma(targetAnnualAsset)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                  readOnly: true,
                  disableUnderline: true,
                }}
              />
              <TextField
                className={classes.width100}
                label="월간 목표 수입"
                value={getNumberWithComma(targetMonthlyIncome)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                  readOnly: true,
                  disableUnderline: true,
                }}
              />
            </Box>
            <Box display="flex" mt={2}>
              <TextField
                className={classes.width100}
                label="월간 목표 소비"
                value={getNumberWithComma(targetMonthlyConsumption)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                  readOnly: true,
                  disableUnderline: true,
                }}
              />
            </Box>
          </>
        );
      default:
        return 'Unknown stepIndex';
    }
  };

  const steps = getSteps();

  return (
    <div>
      <Backdrop className={classes.backdrop} open={visible}>
        <Box textAlign="center">
          <Typography>기본 자산을 설정해야 합니다.</Typography>
          <Typography>자산과 목표를 설정하고 관리해보세요!</Typography>
          <br />
          <Button classes={{ root: classes.mainBtn }} variant="contained" onClick={handleClickOpen}>
            설정하기
          </Button>
        </Box>
      </Backdrop>
      <Dialog
        classes={{ paper: classes.width100 }}
        fullScreen={isMobile}
        open={dialogOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appbar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              설정하기
            </Typography>
          </Toolbar>
        </AppBar>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box margin={3}>
          <div>
            {getStepContent(activeStep)}
            <Box textAlign="right" mt={2}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button variant="contained" color="primary" onClick={handleFinish}>
                  Finish
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext}>
                  Next
                </Button>
              )}
            </Box>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

export default BaseSettingDialog;
