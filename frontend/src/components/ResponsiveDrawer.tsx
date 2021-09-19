import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

const drawerWidth = 250;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      backgroundColor: '#313131',
    },
    drawer: {
      width: drawerWidth,
      height: '100%',
      color: 'white',
      backgroundColor: '#212121',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    dividerFullWidth: {
      margin: `5px 0 0 ${theme.spacing(2)}px`,
    },
    toolbar: theme.mixins.toolbar,
    container: {
      maxWidth: '1280px',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    title: {
      marginRight: theme.spacing(2),
    },
  }),
);

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement;
}

const ResponsiveDrawer: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const [drawerState, setDrawerState] = React.useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerState(open);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            edge="start"
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6">
            미래일기
          </Typography>
        </Toolbar>
      </AppBar>
      <div>
        <React.Fragment>
          <SwipeableDrawer
            anchor="left"
            open={drawerState}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            <div className={classes.drawer}>
              <div className={classes.toolbar} />
              <Divider />
              <List>
                <ListItem
                  button
                  onClick={() => {
                    location.href = '/';
                  }}
                >
                  <ListItemText primary={'대시보드'} />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    location.href = '/accountBook';
                  }}
                >
                  <ListItemText primary={'가계부'} />
                </ListItem>
              </List>
            </div>
          </SwipeableDrawer>
        </React.Fragment>
      </div>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Container className={classes.container}>{props.children}</Container>
      </main>
    </div>
  );
};

export default ResponsiveDrawer;
