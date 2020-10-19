import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Rnd } from 'react-rnd';
import AnnotationMark from './AnnotationMark';
import TimeGraph from './TimeGraph';
import TimePopper from './TimePopper';
import { useTimeStore } from '../../../Store';
import { dataService } from '../../../Services/DataService';
import { useAnnotationStore } from '../../../Store';

const dataLength = dataService.getDuration();

const Container = styled.div`
  width: 60%;
  max-width: 1000px;
  height: 30px;
  border-radius: 5px 5px 0px 0px;
  // border-bottom: solid 10px #cdcdcd;
  position: relative;
  bottom: 80px;
  left: 0;
  right: 0;
  margin: auto;
  background: #fff;
`;

const TimeLine = () => {
  const containerRef = useRef();
  const rndRef = useRef();
  const [containerWidth, setContainerWidth] = useState(500);
  const [rndWidth, setRndWidth] = useState(0);
  const [middlePopperOpen, setMiddlePopperOpen] = useState(false);
  const [startPopperOpen, setStartPopperOpen] = useState(false);
  const [endPopperOpen, setEndPopperOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);

  console.log('%c [Timeline] is rendering', 'background: #111; color: #ebd31c');

  const [startTime, setStartTime] = useTimeStore((state) => [
    state.startTime,
    state.setStartTime,
  ]);
  const [endTime, setEndTime] = useTimeStore((state) => [
    state.endTime,
    state.setEndTime,
  ]);

  // Fetch initial time state
  const startTimeRef = useRef(useTimeStore.getState().startTime);
  const endTimeRef = useRef(useTimeStore.getState().endTime);

  // Fetch annotations
  const annotations = useAnnotationStore((state) => state.annotations);

  useEffect(() => {
    // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
    useTimeStore.subscribe(
      (startTime) => (startTimeRef.current = startTime),
      (state) => state.startTime
    );

    useTimeStore.subscribe(
      (endTime) => (endTimeRef.current = endTime),
      (state) => state.endTime
    );

    setAnchor(rndRef.current.resizableElement.current);

    // Remove all listeners on unmount
    // return () => useTimeStore.destroy();
  }, []);

  useEffect(() => {
    // Handle reisizing of the window
    const handleResize = () => {
      // Update containerwidth
      setContainerWidth(containerRef.current.offsetWidth);

      // Set width of rnd drag component based on containerwidth
      setRndWidth(
        (endTimeRef.current - startTimeRef.current) *
          (containerRef.current.offsetWidth / dataLength)
      );
      updateRnd();
    };

    // Run handleresize to set initial width of rnd and containerWidth states
    if (containerRef.current) handleResize();

    // Update states on resize
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const updateRnd = (e) => {
    // if (containerRef) {
    console.log('updating rnd...');
    let width =
      (endTimeRef.current - startTimeRef.current) *
      (containerRef.current.offsetWidth / dataLength);
    console.log('width', width);

    rndRef.current.updatePosition({ x: startTimeRef.current / ratio, y: 0 });
    rndRef.current.updateSize({
      width: width,
      height: '100%',
    });
    // }
  };

  // Ratio used to make dimensions correct according to data size
  let ratio = dataLength / containerWidth;

  const handleResize = (e, dir, ref, delta, position) => {
    // Calculate new start time based on x position and window width
    let newStartTime = ratio * position.x;

    // Update global start time state
    setStartTime(newStartTime);

    // Update global end time state based on scroller width and new start time
    setEndTime(
      newStartTime + ratio * Number.parseInt(ref.style.width.split('px')[0])
    );
    console.log('new Endtime:', endTimeRef.current);
  };

  const resizeStart = (e, dir, ref, delta, position) => {
    if (dir === 'left') {
      toggleStartPopper();
    } else if (dir === 'right') {
      toggleEndPopper();
    }
  };

  const resizeStop = (e, dir, ref, delta, position) => {
    if (dir === 'left') {
      toggleStartPopper();
    } else if (dir === 'right') {
      toggleEndPopper();
    }
  };

  const handleDrag = (e, data) => {
    // Calculate new start time based on x position and window width
    let newStartTime = ratio * data.x;

    // Update global start time state
    setStartTime(newStartTime);
    console.log('new startTime:', startTimeRef.current);

    // Update global end time state based on scroller width and new start time
    setEndTime(newStartTime + ratio * data.node.scrollWidth);
  };

  const toggleMiddlePopper = () => {
    setMiddlePopperOpen(!middlePopperOpen);
  };
  const toggleStartPopper = () => {
    setStartPopperOpen(!startPopperOpen);
  };
  const toggleEndPopper = () => {
    setEndPopperOpen(!endPopperOpen);
  };

  console.log(
    'startTime',
    startTimeRef.current,
    'endtime',
    endTimeRef.current,
    'posiion',
    startTimeRef.current / ratio
  );

  const style = {
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '5px',
  };
  console.log('ratio', ratio);
  return (
    <Container ref={containerRef}>
      {annotations.map((ann, i) => (
        <AnnotationMark ann={ann} ratio={ratio} key={i} />
      ))}

      <Rnd
        ref={rndRef}
        bounds="parent"
        style={style}
        // default={{
        //   width:
        //     (startTime * containerWidth) / dataLength +
        //     (endTime * containerWidth) / dataLength,
        //   height: "100%",
        // }}
        enableResizing={{
          left: true,
          right: true,
          top: false,
          bottom: false,
          bottomLeft: false,
          bottomRight: false,
          topLeft: false,
          topRight: false,
        }}
        onResize={handleResize}
        onResizeStart={resizeStart}
        onResizeStop={resizeStop}
        onDrag={handleDrag}
        onDragStart={toggleMiddlePopper}
        onDragStop={toggleMiddlePopper}
        position={{ x: startTimeRef.current / ratio, y: 0 }}
      />
      <TimePopper
        anchor={anchor}
        open={middlePopperOpen}
        placement={'bottom'}
        text={
          ((startTimeRef.current + endTimeRef.current) / 2).toFixed(2) + 's'
        }
      />

      <TimePopper
        anchor={anchor}
        open={startPopperOpen}
        placement={'bottom-start'}
        text={startTimeRef.current.toFixed(2) + 's'}
      />

      <TimePopper
        anchor={anchor}
        open={endPopperOpen}
        placement={'bottom-end'}
        text={endTimeRef.current.toFixed(2) + 's'}
      />
      <TimeGraph ratio={ratio} intervals={12} />
    </Container>
  );
};

export default TimeLine;
