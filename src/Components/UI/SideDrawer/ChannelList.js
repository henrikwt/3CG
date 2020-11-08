import React from 'react';
import {
  useChannelStore,
  useScaleStore,
  useInspectStore,
} from '../../../Store';
import { dataService } from '../../../Services/DataService';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import SelectAllOrNoneBtns from '../Buttons/SelectAllOrNoneBtns';
import FormHelperText from '@material-ui/core/FormHelperText';
import SettingsCheck from '../Settings/SettingsCheck';
import SettingsSlider from '../Settings/SettingsSlider';

const channelNames = dataService.getChannelNamesArray();

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
  chip: {
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

const ChannelList = () => {
  const [
    activeChannels,
    toggleChannel,
    toggleAllChannels,
  ] = useChannelStore((state) => [
    state.activeChannels,
    state.toggleChannel,
    state.toggleAllChannels,
  ]);

  const [
    vChannelScaling,
    toggleVChannelScaling,
    vChannelScaleFactor,
    setVChannelScaleFactor,
  ] = useScaleStore((state) => [
    state.vChannelScaling,
    state.toggleVChannelScaling,
    state.vChannelScaleFactor,
    state.setVChannelScaleFactor,
  ]);

  const inspected = useInspectStore((state) => state.inspected);

  const classes = useStyles();

  console.log(
    '%c [Checlist] is rendering (sideDrawer child)',
    'background: #111; color: #ebd31c'
  );

  return (
    <div className={classes.root}>
      <FormHelperText>
        Click on checkbox to toggle channel on/off
      </FormHelperText>

      <FormControl
        component='fieldset'
        className={classes.formControl}
        disabled={inspected !== -1}
      >
        <FormGroup>
          {activeChannels.map((state, i) => (
            <FormControlLabel
              key={channelNames[i]}
              control={
                <Checkbox
                  checked={state}
                  onChange={() => toggleChannel(i)}
                  name={channelNames[i]}
                />
              }
              label={channelNames[i]}
            />
          ))}
        </FormGroup>

        {/* Buttons with select all or none functionality */}
        <SelectAllOrNoneBtns
          toggleAll={toggleAllChannels}
          type='channels'
          disabled={inspected !== -1}
        />
      </FormControl>

      <SettingsCheck
        state={vChannelScaling}
        onClick={toggleVChannelScaling}
        name='vScaling-checkbox'
        label='Scale V-channels'
        description={
          'Scale V1-V6 channels down by a factor of ' + vChannelScaleFactor
        }
      />

      <SettingsSlider
        title={'V-channels scale factor'}
        description={
          'Use the slider to select the factor by which the V-channels should be scaled by, if the option is enabled'
        }
        value={vChannelScaleFactor}
        minValue={5}
        maxValue={100}
        stepSize={5}
        disabled={!vChannelScaling}
        onChange={(e, v) => setVChannelScaleFactor(v)}
      />
    </div>
  );
};

export default ChannelList;
