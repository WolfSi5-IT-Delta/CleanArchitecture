import React, { useContext, useEffect, useState, useMemo } from 'react';
import { createReactEditorJS } from 'react-editor-js'
import { EDITOR_JS_TOOLS } from './tools'

export default function Editor( {blocks, getEditorInstance, readOnly = false }) {

  const ReactEditorJS = createReactEditorJS()

  const editorCore = React.useRef(null);

  const handleInitialize = React.useCallback((instance) => {
    editorCore.current = instance
    if (typeof getEditorInstance === 'function') {
      getEditorInstance(instance);
    }
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
    <div className={"prose max-w-none"}>
      <ReactEditorJS
        onInitialize={handleInitialize}
        defaultValue={ data }
        tools={EDITOR_JS_TOOLS}
        readOnly = {readOnly}
      />
    </div>
  );
};
