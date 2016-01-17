import React, { PropTypes as _ } from 'react';
import { createDevTools } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
import LogMonitor from 'redux-devtools-log-monitor';
import SliderMonitor from 'redux-slider-monitor';

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
