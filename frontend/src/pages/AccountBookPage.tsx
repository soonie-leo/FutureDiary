import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import {
  DataGridPro,
  GridColDef,
  GridCellParams,
  GridSortDirection,
  GridSelectionModel,
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

import { IRow } from '../components/AccountBook/Interface';
import { getNumberWithComma } from '../components/common/utils';

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

const sampleData = [
  {
    id: 1,
    date: new Date('2021.09.11 14:32:12'),
    content: '점심',
    income: 0,
    expense: 8000,
    category: '식사',
    memo: '순대국',
  },
  {
    id: 2,
    date: new Date('2021.09.11 19:35:11'),
    content: '저녁',
    income: 0,
    expense: 12000,
    category: '식사',
    memo: '돈까스 세트',
  },
  {
    id: 3,
    date: new Date('2021.09.12 09:59:55'),
    content: '프로젝터 판매',
    income: 350000,
    expense: 0,
    category: '중고',
    memo: '당근마켓',
  },
  {
    id: 4,
    date: new Date('2021.09.12 12:02:03'),
    content: '점심',
    income: 0,
    expense: 4500,
    category: '식사',
    memo: '우동 곱빼기',
  },
  {
    id: 5,
    date: new Date('2021.09.13 18:22:30'),
    content: '캠핑장 예약',
    income: 0,
    expense: 80000,
    category: '캠핑',
    memo: '2박 3일',
  },
];

const AccountBookPage: React.FC = () => {
  const classes = useStyles();
  const apiRef = useGridApiRef();

  const [rows, setRows] = React.useState<Array<IRow>>([]);
  const [selectRows, setSelectRows] = React.useState<Array<IRow>>([]);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const [lastId, setLastId] = React.useState(5);

  interface RowMenuProps {
    api: GridApi;
    id: GridRowId;
  }

  const RowMenuCell = (props: RowMenuProps) => {
    const { api, id } = props;
    const isInEditMode = api.getRowMode(id) === 'edit';

    const handleEditClick = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      api.setRowMode(id, 'edit');
    };

    const handleSaveClick = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      api.commitRowChange(id);
      api.setRowMode(id, 'view');

      const row = api.getRow(id);
      api.updateRows([{ ...row, isNew: false }]);
      // TODO: update 호출
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      api.updateRows([{ id, _action: 'delete' }]);
      // TODO: delete 호출
    };

    const handleCancelClick = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      api.setRowMode(id, 'view');

      const row = api.getRow(id);
      if (row?.isNew) {
        api.updateRows([{ id, _action: 'delete' }]);
      }
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
    { field: 'date', headerName: 'Date', width: 200, type: 'dateTime', editable: true },
    {
      field: 'content',
      headerName: 'Name',
      width: 200,
      editable: true,
    },
    {
      field: 'income',
      headerName: '수입',
      width: 120,
      type: 'number',
      renderCell: (params: GridCellParams) => (
        <Typography className={(params.value as number) > 0 ? classes.income : ''}>
          {getNumberWithComma(params.value as number) + '원'}
        </Typography>
      ),
      align: 'right',
      editable: true,
    },
    {
      field: 'expense',
      headerName: '지출',
      width: 120,
      type: 'number',
      renderCell: (params: GridCellParams) => (
        <Typography className={(params.value as number) > 0 ? classes.expense : ''}>
          {getNumberWithComma(params.value as number) + '원'}
        </Typography>
      ),
      align: 'right',
      editable: true,
    },
    { field: 'category', headerName: '카테고리', width: 140, align: 'center', editable: true },
    { field: 'memo', headerName: '메모', width: 200, editable: true },
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

      apiRef.current.updateRows([{ id: newId, date: new Date(), isNew: true }]);
      apiRef.current.setRowMode(newId, 'edit');
      apiRef.current.setCellFocus(newId, 'content');
      // TODO: post 호출
    };

    return (
      <GridToolbarContainer className={classes.toolbarContainer}>
        <Button className={classes.toolbarAddBtn} startIcon={<AddIcon />} onClick={handleAddClick}>
          Add Row
        </Button>
        {selectRows.length > 0 && ( // TODO: 삭제 기능 추가
          <Button className={classes.toolbarDeleteBtn} startIcon={<DeleteIcon />}>
            Delete
          </Button>
        )}
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
    setRows(sampleData);
  }, []);

  return (
    <Box height={1000} width="100%">
      <Box height="100%" display="flex">
        <Box flexGrow={1}>
          <DataGridPro
            rows={rows}
            columns={columns}
            apiRef={apiRef}
            sortModel={[{ field: 'date', sort: 'desc' as GridSortDirection }]}
            checkboxSelection
            disableSelectionOnClick
            selectionModel={selectionModel}
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
              const target = [];
              for (const row of rows) {
                if (newSelectionModel.includes(row.id)) target.push(row);
              }
              setSelectRows(target);
            }}
            editMode="row"
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
  );
};

export default AccountBookPage;
