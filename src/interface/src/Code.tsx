import * as React from "react";
import Editor from "@monaco-editor/react";

export interface CodeProps {
  code: string;
}

const Code: React.FC<CodeProps> = ({ code }) => {
  return (
    <div>
      <Editor value={code} />
    </div>
  );
};

export default Code;
