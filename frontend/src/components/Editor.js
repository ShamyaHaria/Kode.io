import React, {useRef} from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({code,onChange,language}) {
    const editorRef = useRef(null);
    function handleEditorDidMount(editor, monaco) {
        editorRef.current=editor;
    }

    function handleEditorChange(value) {
        onChange(value);
    }

    return (
        <Editor
            height="100%"
            defaultLanguage={language}
            defaultValue={code}
            theme="vs-dark"
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
            options={{
                fontSize: 14,
                minimap: {enabled: false},
                scrollBeyondLastLine: false,
                automaticLayout: true,
            }}
        />
    );
}

export default CodeEditor;