import * as React from 'react';
import './App.css';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import ResponsiveDrawer from './components/ResponsiveDrawer';
import DashboardPage from './pages/DashboardPage';
import AccountBookPage from './pages/AccountBookPage';

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#969696',
      contrastText: '#fff',
    },
  },
});

const App: React.FunctionComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Router>
          <ResponsiveDrawer>
            <Switch>
              <Route
                path="/"
                render={() => {
                  return <Redirect to="/dashboard" />;
                }}
                exact
              />
              <Route path="/dashboard" component={DashboardPage} exact />
              <Route path="/accountBook" component={AccountBookPage} exact />
            </Switch>
          </ResponsiveDrawer>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
