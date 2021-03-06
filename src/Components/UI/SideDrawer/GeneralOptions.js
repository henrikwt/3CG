import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import SettingsSlider from '../Settings/SettingsSlider';
import SettingsCheck from '../Settings/SettingsCheck';
import {
  useCameraStore,
  useSnackbarStore,
  useStorageStore,
} from '../../../Store';
import { purge } from '../../../utils/persist';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: '15px',
    background: '#cc3a23',
    color: 'white',
    '&:hover': {
      background: '#bf2e17',
      color: 'white',
      filter: 'brightness(0.9)',
    },
  },
}));

const MarginWrapper = styled.div`
  margin: 24px;
`;

const GeneralOptions = () => {
  const [fov, setFov] = useCameraStore((state) => [state.fov, state.setFov]);
  const [showSnackbar, toggleShowSnackbar] = useSnackbarStore((state) => [
    state.showSnackbar,
    state.toggleShowSnackbar,
  ]);
  const [
    saveInLocalStorage,
    toggleSaveInLocalStorage,
  ] = useStorageStore((state) => [
    state.saveInLocalStorage,
    state.toggleSaveInLocalStorage,
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const toggleDialog = () => setShowDialog((state) => !state);

  const classes = useStyles();

  const handleDialogAction = () => {
    purge();
    toggleDialog();
  };

  const toggleStorage = () => {
    toggleSaveInLocalStorage();
    if (saveInLocalStorage) purge();
    else window.location.reload();
  };

  return (
    <>
      <SettingsSlider
        title={'Camera FOV'}
        description={'Use the slider to select the field of view of the camera'}
        value={fov}
        minValue={30}
        maxValue={140}
        stepSize={10}
        onChange={(e, v) => setFov(v)}
        aria-label='Change camera field of view'
      />

      <SettingsCheck
        state={showSnackbar}
        onClick={toggleShowSnackbar}
        name='show-snackbar-option'
        label='Show snackbar'
        description='Show snackbar popup with messages. E.g. when changing playback speed'
        aria-label='Toggle show snackbar'
      />

      <SettingsCheck
        state={saveInLocalStorage}
        onClick={toggleStorage}
        name='localstorage-option'
        label='Save preferences'
        description='When this is enabled the settings will be saved when refreshing the page on this device. NB! Enabling this setting will cause the page to refresh.'
        aria-label='Toggle save preferences'
      />

      <MarginWrapper>
        <Typography gutterBottom style={{ marginTop: '10px' }}>
          Reset preferences
        </Typography>
        <FormHelperText>
          Click on the button below to reset saved preferences
        </FormHelperText>
        <Button
          className={classes.button}
          onClick={toggleDialog}
          endIcon={<DeleteIcon />}
          aria-label='Delete preferences'
        >
          DELETE PREFERENCES
        </Button>

        <Dialog
          open={showDialog}
          onClose={toggleDialog}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>
            {'Remove preferences?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Deleting this will reset all settings and changes made to the
              application when refreshing the page.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleDialog} color='primary' aria-label='Cancel'>
              Cancel
            </Button>
            <Button
              onClick={handleDialogAction}
              color='primary'
              autoFocus
              className={classes.button}
              style={{ marginTop: 0 }}
              endIcon={<DeleteIcon />}
              aria-label='Confirm deletion of preferences'
            >
              Yes, delete
            </Button>
          </DialogActions>
        </Dialog>
      </MarginWrapper>
    </>
  );
};

export default GeneralOptions;
