'use babel';

import { isFunction } from 'lodash';
import React from 'react';
import { compose, withHandlers } from 'recompose';

function GutterResize({children, onMouseDown}) {
  return (
    <div className="resize-container">
      {children}
      <div
        className="resize"
        onMouseDown={onMouseDown}
      />
    </div>
  );
}

export default compose(
  withHandlers({
    onMouseDown({ onResizeStart }) {
      return function (e) {
        return isFunction(onResizeStart) && onResizeStart(e.nativeEvent);
      };
    },
  })
)(GutterResize);
