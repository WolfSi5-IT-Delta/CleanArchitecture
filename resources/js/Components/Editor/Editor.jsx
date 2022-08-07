import React, { useContext, useEffect, useState, useMemo } from "react";
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./tools";

export default function Editor({
  blocks,
  getEditorInstance,
  readOnly = false,
  holder = "editor_element",
}) {
  const ReactEditorJS = createReactEditorJS();

  const editorCore = React.useRef(null);

  const handleInitialize = React.useCallback((instance) => {
    editorCore.current = instance;
    if (typeof getEditorInstance === "function") {
      getEditorInstance(instance);
    }
  }, []);

  const data = useMemo(() => {
    const emptyBlocks = {
      blocks: [
        {
          id: "WjS0gyKv-U",
          type: "paragraph",
          data: {
            text: blocks,
          },
        },
      ],
    };

    if (typeof blocks === "object") return blocks;

    try {
      let res = JSON.parse(blocks);
      if (typeof res !== "object") return emptyBlocks;
      return res;
    } catch (e) {
      return emptyBlocks;
    }
  }, []);

  return (
    <div className={"prose max-w-none"}>
      <ReactEditorJS
        onInitialize={handleInitialize}
        defaultValue={data}
        tools={EDITOR_JS_TOOLS}
        readOnly={readOnly}
        holder={holder}
      />
    </div>
  );
}
