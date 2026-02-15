import React, { useState, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import * as ReactModule from 'react';
import * as reactTela from 'react-tela';
import * as reactTelaRender from 'react-tela/render';
import { registerModule, transpileAndEval } from './transpile';
import { Preview } from './Preview';
import { DEFAULT_CODE } from './default-code';

// Register modules available to playground code
registerModule('react', ReactModule);
registerModule('react-tela', reactTela);
registerModule('react-tela/render', reactTelaRender);

export function App() {
  const [component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (!value) return;

    // Debounce compilation
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        const result = transpileAndEval(value);
        if (result) {
          setComponent(() => result);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message || String(err));
      }
    }, 300);
  }, []);

  // Initial compilation
  useEffect(() => {
    handleCodeChange(DEFAULT_CODE);
  }, [handleCodeChange]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        background: '#1e1e1e',
      }}
    >
      {/* Editor panel */}
      <div
        style={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #333',
        }}
      >
        <div
          style={{
            padding: '8px 16px',
            background: '#252526',
            color: '#ccc',
            fontSize: 13,
            fontWeight: 600,
            borderBottom: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>🎨</span>
          <span>react-tela Playground</span>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 11,
              color: '#888',
              fontWeight: 400,
            }}
          >
            Edit code below • Changes render live
          </span>
        </div>
        <Editor
          defaultLanguage="typescript"
          defaultValue={DEFAULT_CODE}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12 },
          }}
        />
      </div>

      {/* Preview panel */}
      <div
        style={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '8px 16px',
            background: '#252526',
            color: '#ccc',
            fontSize: 13,
            fontWeight: 600,
            borderBottom: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>🖼️</span>
          <span>Canvas Preview</span>
        </div>
        <Preview component={component} error={error} />
      </div>
    </div>
  );
}
