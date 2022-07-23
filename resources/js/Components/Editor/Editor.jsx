import React, { useContext, useEffect, useState, useMemo } from 'react';
import { createReactEditorJS } from 'react-editor-js'
import { EDITOR_JS_TOOLS } from './tools'

export default function Editor( {blocks, getInstance }) {

  const ReactEditorJS = createReactEditorJS()

  const editorCore = React.useRef(null);

  const handleInitialize = React.useCallback((instance) => {
    editorCore.current = instance
    getInstance(instance);
  }, []);

  const data = useMemo(() => {
    // console.log('Memo: ', Date());
    try {
      return JSON.parse(blocks);
    } catch (e) {
      // empty value
      return {
        "blocks" : [
          {
            "id" : "WjS0gyKv-U",
            "type" : "paragraph",
            "data" : {
              "text" : blocks
            }
          },
        ],
      };
    }
  }, [blocks]);

  return (
    <ReactEditorJS onInitialize={handleInitialize} defaultValue={ data } tools={EDITOR_JS_TOOLS}/>
  );
};
