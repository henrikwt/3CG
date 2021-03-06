import FormHelperText from '@material-ui/core/FormHelperText';
import React from 'react';
import { useRenderTypeStore } from '../../../Store';
import Dropdown from '../Dropdown';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/core/styles';
import SelectBetween from '../Settings/SelectBetween';
import Typography from '@material-ui/core/Typography';
import SettingsCheck from '../Settings/SettingsCheck';
import IconButton from '@material-ui/core/IconButton';

const Wrapper = styled.div`
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 15px;
  align-items: end;
`;

const MarginWrapper = styled.div`
  margin: 24px;
`;

const MAX_NUM_OF_RENDER_VIEWS = 3;

const useStyles = makeStyles((theme) => ({
  button: {
    background: '#93bc6e',
    color: 'white',
    '&:hover': {
      background: '#7aab4f',
      color: 'white',
      filter: 'brightness(0.9)',
    },
  },
  deleteIcon: {
    color: '#555',
    // margin: '8px',
    cursor: 'pointer',
    '&:hover': {
      color: '#333',
    },
  },
}));

const RenderTypeOptions = () => {
  const store = useRenderTypeStore();

  const classes = useStyles();

  const handleChange = (e, index) => {
    store.editRender(e.target.value, index || 0);
  };

  const handleClick = () => {
    // Default new render to be added to split view is the first
    let newRender = store.renderNames[0];

    // Try to find a render that is not already active in the rendernames list
    for (let i = 1; i < store.renderNames.length; i++) {
      if (!store.activeRenders.includes(store.renderNames[i])) {
        newRender = store.renderNames[i];
        break;
      }
    }

    // Add the new render to the split view
    store.addActiveRender(newRender);
  };

  return (
    <>
      <MarginWrapper>
        <Typography
          id='split-orientation-title'
          gutterBottom
          style={{ marginTop: '40px' }}
        >
          Visualizations
        </Typography>
        <Wrapper>
          <FormHelperText>
            Change or add more visualizations below. Several visualizations will
            be displayed with a split view. Visualizations can also be removed.
          </FormHelperText>
        </Wrapper>

        {/* Render dropdown for each active render */}
        {store.activeRenders.map(
          (a, i) =>
            a && (
              <Wrapper key={a + i}>
                <Dropdown
                  items={store.renderNames.sort()}
                  value={a}
                  title={'Visualization ' + (i + 1)}
                  handleChange={handleChange}
                  index={i}
                  aria-label='Choose visualization'
                />
                {store.activeRenders.length > 1 && (
                  <IconButton
                    onClick={() => store.removeActiveRender(i)}
                    aria-label='Clear visualization'
                  >
                    <ClearIcon className={classes.deleteIcon} />
                  </IconButton>
                )}
              </Wrapper>
            )
        )}

        <Button
          variant='contained'
          className={classes.button}
          startIcon={<AddIcon />}
          size='small'
          onClick={() => handleClick()}
          disabled={store.activeRenders.length === MAX_NUM_OF_RENDER_VIEWS}
          aria-label='Add visualization'
        >
          Add visualization
        </Button>

        {store.activeRenders.length === MAX_NUM_OF_RENDER_VIEWS && (
          <FormHelperText style={{ color: 'rgba(247, 152, 29, 1)' }}>
            Maximum number of visualizations allowed are{' '}
            {MAX_NUM_OF_RENDER_VIEWS}
          </FormHelperText>
        )}
        {store.activeRenders.length > 1 && (
          <>
            <Typography
              id='split-orientation-title'
              gutterBottom
              style={{ marginTop: '40px' }}
            >
              Split orientation
            </Typography>

            <FormHelperText>
              Change orientation of the split view if several visualizations are
              active.
            </FormHelperText>

            <SelectBetween
              selectTexts={['Vertical', 'Horizontal']}
              active={store.orientation}
              onClick={store.toggleOrientation}
              disabled={store.activeRenders.length < 2}
            />
          </>
        )}
      </MarginWrapper>

      {store.activeRenders.length > 1 && (
        <SettingsCheck
          state={store.showRenderviewIndex}
          onClick={store.toggleShowRenderviewIndex}
          name='showrenderviewindex-checkbox'
          label='Show render index'
          description={
            'Show the index of each visualization in the corner to easily distinguish the difference between them'
          }
        />
      )}
      {store.activeRenders.includes('Vcg') && (
        <MarginWrapper>
          <Typography
            id='split-orientation-title'
            gutterBottom
            style={{ marginTop: '40px' }}
          >
            VCG Conversion method
          </Typography>

          <FormHelperText>
            The VCG representation is a transformation of the 12-lead ecg
            signals, different transform methods will give different results.
            More info.
          </FormHelperText>

          <SelectBetween
            selectTexts={store.vcgMethodNames}
            active={store.vcgMethod}
            onClick={store.setVcgMethod}
            disabled={!store.activeRenders.includes('Vcg')}
          />
        </MarginWrapper>
      )}
    </>
  );
};

export default RenderTypeOptions;
