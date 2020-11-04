import MuiAccordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useState } from 'react';
import MenuBtn from '../Buttons/MenuBtn';
import AnnotationMenu from './AnnotationMenu';
import ChannelList from './ChannelList';
import FileUpload from './FileUpload';
import GeneralOptions from './GeneralOptions';
import RenderTypeOptions from './RenderTypeOptions';
import TimeLineOptions from './TimeLineOptions';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
  drawerPaper: {
    width: '300px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const Accordion = withStyles({
  root: {
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {
    margin: 0,
  },
})(MuiAccordion);

const MenuItems = [
  {
    title: 'General',
    component: <GeneralOptions />,
  },
  {
    title: 'Render view',
    component: <RenderTypeOptions />,
  },
  {
    title: 'Channels',
    component: <ChannelList />,
  },
  {
    title: 'Annotations',
    component: <AnnotationMenu />,
  },
  {
    title: 'Timeline',
    component: <TimeLineOptions />,
  },
];

const SideDrawer = () => {
  const [show, setShow] = useState(false);
  const classes = useStyles();
  console.log(
    '%c [SideDrawer] is rendering',
    'background: #111; color: #ebd31c'
  );

  // Toggle between showing and hiding menu
  const toggleMenu = () => setShow(!show);

  return (
    <>
      <MenuBtn onClick={toggleMenu} />
      <Drawer
        anchor={'right'}
        open={show}
        onClose={() => toggleMenu()}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        {MenuItems.map((item, i) => (
          <Accordion TransitionProps={{ unmountOnExit: true }} key={i}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography className={classes.heading}>{item.title}</Typography>
            </AccordionSummary>

            <AccordionDetails style={{ display: 'block' }}>
              {item.component}
            </AccordionDetails>
          </Accordion>
        ))}
        <FileUpload />
      </Drawer>
    </>
  );
};

export default SideDrawer;
