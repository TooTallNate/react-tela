import React, { useState, useCallback, useRef, useEffect } from 'react';
import Editor, { type Monaco } from '@monaco-editor/react';
import { configureMonaco } from './monaco-setup';
import * as ReactModule from 'react';
import * as reactTela from 'react-tela';
import * as reactTelaRender from 'react-tela/render';
import * as reactTelaFlex from 'react-tela/flex';
import yogaInit from 'yoga-wasm-web/asm';
import { registerModule, transpileAndEval } from './transpile';
import { Preview } from './Preview';
import { DEFAULT_CODE } from './default-code';

// Register modules available to playground code
registerModule('react', ReactModule);
registerModule('react-tela', reactTela);
registerModule('react-tela/render', reactTelaRender);
registerModule('react-tela/flex', reactTelaFlex);
registerModule('yoga-wasm-web/asm', yogaInit);

function VimToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      title={enabled ? 'Disable Vim keybindings' : 'Enable Vim keybindings'}
      style={{
        background: enabled ? '#6366f1' : '#3c3c3c',
        color: enabled ? '#fff' : '#999',
        border: '1px solid ' + (enabled ? '#818cf8' : '#555'),
        borderRadius: 4,
        padding: '2px 8px',
        fontSize: 11,
        cursor: 'pointer',
        fontFamily: 'monospace',
        fontWeight: 600,
        transition: 'all 0.15s',
      }}
    >
      VIM
    </button>
  );
}

export function App() {
  const [component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vimMode, setVimMode] = useState(() => {
    try {
      return localStorage.getItem('react-tela-vim') === 'true';
    } catch {
      return false;
    }
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const vimModeRef = useRef<any>(null);

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (!value) return;

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

  // Load/unload vim mode
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    try {
      localStorage.setItem('react-tela-vim', String(vimMode));
    } catch {}

    if (vimMode) {
      // Dynamically import monaco-vim
      import('monaco-vim').then((monacoVim) => {
        const statusNode = document.getElementById('vim-status');
        if (statusNode) {
          vimModeRef.current = monacoVim.initVimMode(editor, statusNode);
        }
      }).catch(() => {
        // monaco-vim not available
      });
    } else {
      if (vimModeRef.current) {
        vimModeRef.current.dispose();
        vimModeRef.current = null;
      }
      const statusNode = document.getElementById('vim-status');
      if (statusNode) statusNode.textContent = '';
    }

    return () => {
      if (vimModeRef.current) {
        vimModeRef.current.dispose();
        vimModeRef.current = null;
      }
    };
  }, [vimMode]);

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
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <VimToggle
              enabled={vimMode}
              onToggle={() => setVimMode((v) => !v)}
            />
            <span id="vim-status" style={{ color: '#6366f1', fontFamily: 'monospace', minWidth: 60 }} />
          </span>
        </div>
        <Editor
          defaultLanguage="typescript"
          defaultPath="file:///playground.tsx"
          defaultValue={DEFAULT_CODE}
          onChange={handleCodeChange}
          beforeMount={configureMonaco}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            monacoRef.current = monaco;
            // Trigger vim mode if enabled on mount
            if (vimMode) {
              setVimMode(true);
            }
          }}
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
