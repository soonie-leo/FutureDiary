import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { IAmountInfo } from './Interface';
import Counter from './Counter';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    primaryText: {
      color: '#8dddd2',
      fontSize: '1.8rem',
      display: 'flex',
    },
    secondaryText: {
      color: '#f2e5b1',
      fontSize: '1.8rem',
      display: 'flex',
    },
    subText: {
      color: '#fba884',
      fontSize: '0.8rem',
      marginRight: theme.spacing(1),
    },
    subText2: {
      color: 'rgb(255, 255, 255, 0.7)',
      fontSize: '0.8rem',
    },
  }),
);

interface Props {
  amountInfo: IAmountInfo;
}

const AmountInfo: React.FC<Props> = ({ amountInfo }: Props) => {
  const classes = useStyles();

  return (
    <Box display="flex" mt={2}>
      <Box>
        <Typography>{'현재 순자산'}</Typography>
        <Counter target={amountInfo.currentNetAssets} textClass={classes.primaryText} />
        <Box display="flex">
          <Typography classes={{ root: classes.subText }}>
            <Box display="inline" mr={0.3}>
              {'▲ ₩'}
            </Box>
            {'2,400,000'}
          </Typography>
          <Typography classes={{ root: classes.subText2 }}>{'지날달 대비'}</Typography>
        </Box>
      </Box>
      <Box ml={6}>
        <Typography>{'월소비 목표'}</Typography>
        <Counter target={amountInfo.monthlyTargetAmount} textClass={classes.secondaryText} />
      </Box>
      <Box ml={6}>
        <Typography>{'월평균 수입'}</Typography>
        <Counter target={amountInfo.averageMonthlyIncome} textClass={classes.primaryText} />
      </Box>
      <Box ml={6}>
        <Typography>{'2021년 순자산 목표'}</Typography>
        <Counter target={amountInfo.annualTargetAmount} textClass={classes.secondaryText} />
      </Box>
    </Box>
  );
};

export default AmountInfo;
