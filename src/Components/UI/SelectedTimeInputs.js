import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';
import { useTimeStore, useMarkStore } from '../../Store';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import NumberFormat from 'react-number-format';

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
`;

const WarningWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-gap: 10px;
  margin-top: 20px;
`;

const useStyles = makeStyles((theme) => ({
  button: {
    width: '100%',
    display: 'block',
    color: '#fff',
    backgroundColor: '#00a8ff',
    '&:hover': {
      backgroundColor: '#0793db',
    },
    margin: 'auto',
    margiBottom: 20,
  },
}));

const NumberFormatCustom = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      decimalScale={3}
      allowNegative={false}
      fixedDecimalScale={true}
    />
  );
};

const SelectedTimeInputs = (props) => {
  const classes = useStyles();

  const [
    startSelected,
    setStartSelected,
    endSelected,
    setEndSelected,
  ] = useMarkStore((state) => [
    state.startSelected,
    state.setStartSelected,
    state.endSelected,
    state.setEndSelected,
  ]);

  const [startTime, endTime] = useTimeStore((state) => [
    state.startTime,
    state.endTime,
  ]);

  const onChange = (e, type) => {
    // Set state based on type
    if (type.toLowerCase() === 'start') setStartSelected(e.target.value);
    else if (type.toLowerCase() === 'end') setEndSelected(e.target.value);
  };

  const handleButtonClick = () => {
    // Set start- and end-selected times to start- and end times in store
    setStartSelected(Number(startTime));
    setEndSelected(Number(endTime));
  };

  console.log('startSelected', startSelected, 'endSelected', endSelected);

  const InputProps = {
    inputComponent: NumberFormatCustom,
    step: 0.1,
  };

  return (
    <>
      <InputWrapper>
        <TextField
          id='outlined-basic'
          label='Start time'
          variant='outlined'
          error={endSelected - startSelected < 0}
          disabled={startSelected === -1}
          value={startSelected === -1 ? null : Number(startSelected)}
          onChange={(e) => onChange(e, 'start')}
          InputProps={InputProps}
        />

        <TextField
          id='outlined-basic'
          label='End time'
          variant='outlined'
          error={endSelected - startSelected < 0}
          disabled={startSelected === -1}
          value={endSelected === -1 ? null : Number(endSelected)}
          onChange={(e) => onChange(e, 'end')}
          InputProps={InputProps}
        />
      </InputWrapper>

      {/* Show warning if start time is after end time */}
      {endSelected - startSelected < 0 && (
        <div style={{ marginTop: 10 }}>
          <FormHelperText style={{ color: '#f44236' }}>
            End time must be after start time!
          </FormHelperText>
        </div>
      )}

      {/* Show warning and button-option if area is not selected in 3D */}
      {(startSelected === -1 || endSelected === -1) && (
        <WarningWrapper>
          <FormHelperText style={{ color: 'rgba(247, 152, 29, 1)' }}>
            Start- and end-time for annotation is not selected, do you want to
            use start- and end-time selected in timeline for annotation?
          </FormHelperText>
          <Button
            size='medium'
            color='primary'
            onClick={() => handleButtonClick()}
            className={classes.button}
          >
            Use timeline start- and end-time
          </Button>
        </WarningWrapper>
      )}
    </>
  );
};

export default SelectedTimeInputs;