import React, { useState, useCallback, useRef, useEffect } from 'react';
import Editor, { loader, type Monaco } from '@monaco-editor/react';
import * as monacoAll from 'monaco-editor';
import type { editor as MonacoEditor } from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { configureMonaco } from './monaco-setup';

// Use locally installed monaco-editor instead of CDN.
// This ensures monaco-vim's KeyCode imports match the editor instance.
loader.config({ monaco: monacoAll });

// Configure Monaco workers for IntelliSense (required when using local bundle)
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};
import * as ReactModule from 'react';
import * as reactTela from 'react-tela';
import * as reactTelaRender from 'react-tela/render';
import * as reactTelaFlex from 'react-tela/flex';
import * as reactTelaTerminal from '@react-tela/terminal';
import yogaInit from 'yoga-wasm-web/asm';
import { registerModule, transpileAndEval } from './transpile';
import { Preview } from './Preview';
import { DEFAULT_CODE } from './default-code';

// Register modules available to playground code
registerModule('react', ReactModule);
registerModule('react-tela', reactTela);
registerModule('react-tela/render', reactTelaRender);
registerModule('react-tela/flex', reactTelaFlex);
registerModule('@react-tela/terminal', reactTelaTerminal);
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
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const vimAdapterRef = useRef<{ dispose: () => void } | null>(null);
  const vimEnabledRef = useRef(vimMode);

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

  // Keep ref in sync for use in async callback
  vimEnabledRef.current = vimMode;

  // Persist vim preference
  useEffect(() => {
    try {
      localStorage.setItem('react-tela-vim', String(vimMode));
    } catch {}
  }, [vimMode]);

  // Apply or remove vim mode
  const applyVimMode = useCallback(async (enable: boolean) => {
    // Always dispose existing first
    if (vimAdapterRef.current) {
      vimAdapterRef.current.dispose();
      vimAdapterRef.current = null;
    }
    const statusNode = document.getElementById('vim-status');
    if (statusNode) statusNode.textContent = '';

    if (!enable || !editorRef.current) return;

    try {
      const { initVimMode } = await import('monaco-vim');
      // Check the ref hasn't changed while we were loading
      if (!vimEnabledRef.current || !editorRef.current) return;
      if (statusNode) {
        vimAdapterRef.current = initVimMode(editorRef.current, statusNode);
      }
    } catch (err) {
      console.error('Failed to load monaco-vim:', err);
    }
  }, []);

  // Re-apply when vimMode changes (after editor is mounted)
  useEffect(() => {
    if (editorRef.current) {
      applyVimMode(vimMode);
    }
    return () => {
      if (vimAdapterRef.current) {
        vimAdapterRef.current.dispose();
        vimAdapterRef.current = null;
      }
    };
  }, [vimMode, applyVimMode]);

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
            <span id="vim-status" style={{ color: '#6366f1', fontFamily: 'monospace', minWidth: vimMode ? 60 : 0 }} />
          </span>
        </div>
        <Editor
          defaultLanguage="typescript"
          defaultPath="file:///playground.tsx"
          defaultValue={DEFAULT_CODE}
          onChange={handleCodeChange}
          beforeMount={configureMonaco}
          onMount={(editor) => {
            editorRef.current = editor;
            // Apply vim mode if it was enabled before mount
            if (vimMode) {
              applyVimMode(true);
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
