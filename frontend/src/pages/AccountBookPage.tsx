import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import {
  DataGridPro,
  GridColDef,
  GridCellParams,
  GridSortDirection,
  GridRowParams,
  GridToolbarContainer,
  MuiEvent,
  useGridApiRef,
  GridApiRef,
  GridApi,
  GridRowId,
} from '@mui/x-data-grid-pro';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Alert, AlertTitle } from '@material-ui/lab';
import axios from 'axios';

import { IRow } from '../components/AccountBook/Interface';
import { convertDate2Str, getNumberWithComma } from '../components/common/utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbarContainer: {
      margin: theme.spacing(1),
    },
    toolbarAddBtn: {
      fontWeight: 'bold',
    },
    toolbarDeleteBtn: {
      fontWeight: 'bold',
      color: '#e65b65',
      marginLeft: theme.spacing(1),
    },
    income: {
      color: '#fd7a79',
    },
    expense: {
      color: '#3484ba',
    },
    actions: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      color: theme.palette.text.secondary,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

const convertData2Row = (data: Array<IRow>) => {
  data.map((value) => {
    value.date = new Date(value.date);
    console.log(value);
  });
  return data;
};

const AccountBookPage: React.FC = () => {
  const classes = useStyles();
  const apiRef = useGridApiRef();

  const [rows, setRows] = React.useState<Array<IRow>>([]);
  const [lastId, setLastId] = React.useState(0);
  const [activeAddBtn, setActiveAddBtn] = React.useState(true);
  const [activeAddMode, setActiveAddMode] = React.useState(false);
  const [activeEditMode, setActiveEditMode] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [progressOpen, setProgressOpen] = React.useState(false);

  interface RowMenuProps {
    api: GridApi;
    id: GridRowId;
  }

  const RowMenuCell = (props: RowMenuProps) => {
    const { api, id } = props;
    const isInEditMode = api.getRowMode(id) === 'edit';

    const handleEditClick = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (activeAddMode) {
        setErrorMessage('????????? ????????? ?????? ????????????. ???????????? ??????????????????.');
        return;
      }
      if (activeEditMode) {
        setErrorMessage('?????? ?????? ????????? ????????????. ???????????? ??????????????????.');
        return;
      }
      api.setRowMode(id, 'edit');
      setActiveAddBtn(false);
      setActiveAddMode(false);
      setActiveEditMode(true);
    };

    const handleSaveClick = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      api.commitRowChange(id);

      const row = api.getRow(id);
      if (row) {
        console.log(row);

        const insertAccountBook = async () => {
          setProgressOpen(true);

          console.log(convertDate2Str(row.date));
          const data = new FormData();
          data.append('date', convertDate2Str(row.date));
          data.append('content', row.content);
          data.append('income', row.income);
          data.append('expense', row.expense);
          data.append('category', row.category);
          data.append('memo', row.memo);

          let response = {
            data: {
              success: false,
              message: 'Error: ????????? ?????????????????????.',
            },
          };
          if (activeAddMode) response = await axios.post('/api/accountbook', data);
          else response = await axios.put(`/api/accountbook/${id}`, data);

          console.log(response.data);
          if (!response.data.success) {
            setErrorMessage(response.data.message.replace('Error: ', ''));
          } else {
            setActiveAddBtn(true);
            setErrorMessage('');

            api.setRowMode(id, 'view');
            api.updateRows([{ ...row, isNew: false }]);

            setActiveAddMode(false);
            setActiveEditMode(false);
          }

          setProgressOpen(false);
        };
        insertAccountBook();
      }
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();

      const deleteAccountBook = async () => {
        setProgressOpen(true);

        const response = await axios.delete(`/api/accountbook/${id}`);

        console.log(response.data);
        if (!response.data.success) {
          setErrorMessage(response.data.message.replace('Error: ', ''));
        } else {
          setErrorMessage('');
          api.updateRows([{ id, _action: 'delete' }]);
        }

        setProgressOpen(false);
      };
      deleteAccountBook();
    };

    const handleCancelClick = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      api.setRowMode(id, 'view');

      const row = api.getRow(id);
      if (row?.isNew) {
        api.updateRows([{ id, _action: 'delete' }]);
      }

      setActiveAddBtn(true);
      setActiveAddMode(false);
      setActiveEditMode(false);
      setErrorMessage('');
    };

    if (isInEditMode) {
      return (
        <div className={classes.actions}>
          <IconButton color="primary" size="small" aria-label="save" onClick={handleSaveClick}>
            <SaveIcon fontSize="small" />
          </IconButton>
          <IconButton color="inherit" size="small" aria-label="cancel" onClick={handleCancelClick}>
            <CancelIcon fontSize="small" />
          </IconButton>
        </div>
      );
    }

    return (
      <div className={classes.actions}>
        <IconButton color="inherit" size="small" aria-label="edit" onClick={handleEditClick}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton color="inherit" size="small" aria-label="delete" onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      align: 'right',
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'date',
      headerName: '??????',
      width: 200,
      valueFormatter: (params) => {
        return convertDate2Str(new Date(params.value as Date));
      },
      type: 'dateTime',
      editable: true,
    },
    {
      field: 'content',
      headerName: '??????',
      width: 200,
      editable: true,
    },
    {
      field: 'income',
      headerName: '??????',
      width: 120,
      type: 'number',
      renderCell: (params: GridCellParams) => (
        <Typography className={(params.value as number) > 0 ? classes.income : ''}>
          {getNumberWithComma(params.value as number) + '???'}
        </Typography>
      ),
      align: 'right',
      editable: true,
    },
    {
      field: 'expense',
      headerName: '??????',
      width: 120,
      type: 'number',
      renderCell: (params: GridCellParams) => (
        <Typography className={(params.value as number) > 0 ? classes.expense : ''}>
          {getNumberWithComma(params.value as number) + '???'}
        </Typography>
      ),
      align: 'right',
      editable: true,
    },
    { field: 'category', headerName: '????????????', width: 140, align: 'center', editable: true },
    { field: 'memo', headerName: '??????', width: 200, editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: RowMenuCell,
      sortable: false,
      width: 100,
      headerAlign: 'center',
      filterable: false,
      align: 'center',
      disableColumnMenu: true,
      disableReorder: true,
    },
  ];

  interface CustomToolbarProps {
    apiRef: GridApiRef;
  }

  const CustomToolbar = (props: CustomToolbarProps) => {
    const { apiRef } = props;

    const handleAddClick = () => {
      const newId = lastId + 1;
      setLastId(newId);

      const defaultRow = {
        id: newId,
        date: new Date(),
        content: '',
        income: 0,
        expense: 0,
        category: '',
        memo: '',
      };

      apiRef.current.updateRows([{ ...defaultRow, isNew: true }]);
      apiRef.current.setRowMode(newId, 'edit');
      apiRef.current.setCellFocus(newId, 'content');
      setActiveAddBtn(false);
      setActiveAddMode(true);
      setActiveEditMode(false);
    };

    return (
      <GridToolbarContainer className={classes.toolbarContainer}>
        <Button
          className={classes.toolbarAddBtn}
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          disabled={activeAddBtn ? false : true}
        >
          Add Row
        </Button>
      </GridToolbarContainer>
    );
  };

  const handleRowEditStart = (params: GridRowParams, event: MuiEvent<React.SyntheticEvent>) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params: GridRowParams, event: MuiEvent<React.SyntheticEvent>) => {
    event.defaultMuiPrevented = true;
  };

  React.useEffect(() => {
    const getAccountBook = async () => {
      setProgressOpen(true);
      const response = await axios.get('/api/accountbook');
      setRows(convertData2Row(response.data.data));
      setProgressOpen(false);
    };
    getAccountBook();
  }, []);

  React.useEffect(() => {
    if (rows.length > 0) {
      const lastId = Object.entries(rows).reduce((a, b) => (a[1].id > b[1].id ? a : b))[1].id;
      setLastId(lastId);
    }
  }, [rows]);

  return (
    <>
      {errorMessage.length > 0 && (
        <Box mb={2}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {errorMessage}
          </Alert>
        </Box>
      )}
      <Box height={1000} width="100%">
        <Box height="100%" display="flex">
          <Box flexGrow={1}>
            <DataGridPro
              rows={rows}
              columns={columns}
              apiRef={apiRef}
              sortModel={[{ field: 'date', sort: 'desc' as GridSortDirection }]}
              editMode="row"
              disableSelectionOnClick
              onRowEditStart={handleRowEditStart}
              onRowEditStop={handleRowEditStop}
              components={{
                Toolbar: CustomToolbar,
              }}
              componentsProps={{
                toolbar: { apiRef },
              }}
            />
          </Box>
        </Box>
      </Box>
      <Backdrop className={classes.backdrop} open={progressOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default AccountBookPage;
