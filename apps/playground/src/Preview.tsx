import React, { useRef, useEffect, useCallback, useState } from 'react';
import { render } from 'react-tela/render';

interface PreviewProps {
  component: React.ComponentType | null;
  error: string | null;
}

export function Preview({ component: Component, error }: PreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<any>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 680, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize canvas to fill container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setCanvasSize({
          width: Math.floor(width),
          height: Math.floor(height),
        });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Render react-tela component to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !Component) return;

    // Update canvas resolution
    canvas.width = canvasSize.width * (window.devicePixelRatio || 1);
    canvas.height = canvasSize.height * (window.devicePixelRatio || 1);

    try {
      // Clean up previous render
      if (rootRef.current) {
        rootRef.current.clear();
      }

      const element = React.createElement(Component);
      rootRef.current = render(element, canvas);
    } catch (err: any) {
      console.error('Render error:', err);
    }
  }, [Component, canvasSize]);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#1e1e1e',
        overflow: 'hidden',
      }}
    >
      {error ? (
        <div
          style={{
            padding: 16,
            color: '#f87171',
            fontFamily: 'monospace',
            fontSize: 13,
            whiteSpace: 'pre-wrap',
            overflow: 'auto',
            background: '#1a0000',
            borderLeft: '3px solid #ef4444',
            margin: 8,
            borderRadius: 4,
          }}
        >
          {error}
        </div>
      ) : null}
      <canvas
        ref={canvasRef}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
