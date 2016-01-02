import React, { PropTypes as _ } from 'react';
import { createDevTools } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
import FilterMonitor from 'redux-devtools-filter-actions';
import LogMonitor from 'redux-devtools-log-monitor';
import SliderMonitor from 'redux-slider-monitor';
import {QUEUE} from '../middleware/taskMiddleware';

//TODO: filter monitor on those queues(and skip them)! Also it needs to filter the computed states as well
//TODO: think about the consequences of skiping actions like SPAWN, SUBSCRIBE.
//TODO: make devtools more performant, so that it doesn't needs to loop trough every single action, every time
//why request animation frame it's 5x times slower when I got the devtools on? quite unexpected...
export default
  createDevTools(
    <DockMonitor
      defaultSize={0.135}
      defaultPosition='bottom'
      toggleVisibilityKey='H'
      changePositionKey='Q'>
      <SliderMonitor
        theme = 'solarized'
      />
    </DockMonitor>
  );
// export default
//   createDevTools(
//     <SliderMonitor
//       theme = 'solarized'
//     />
//   );
