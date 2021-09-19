import * as React from 'react';
import { useSpring, animated } from 'react-spring';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { getNumberWithComma } from '../common/utils';

interface Props {
  target: number;
  textClass: string;
}

const Counter: React.FC<Props> = ({ target, textClass }: Props) => {
  const counter = useSpring({
    from: { number: 0 },
    to: { number: target },
    config: {
      duration: 800,
      precision: 1,
    },
  });

  return (
    <>
      <Typography classes={{ root: textClass }}>
        <Box mr={0.5}>{'₩'}</Box>
        <animated.div>{counter.number.to((n) => getNumberWithComma(Math.round(n)))}</animated.div>
      </Typography>
    </>
  );
};

export default Counter;
