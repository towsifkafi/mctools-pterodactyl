import React, { useEffect, useRef, useState } from 'react';
import TextPreview from './TextPreview';

import useLocalStorage from '../../../lib/useLocalStorage';

interface OutputPaneProps {
  inputText: string;
}

interface WebSocketResponse {
  parseResult: {
    success: boolean;
    dom: string;
  };
}

const OutputPane: React.FC<OutputPaneProps> = ({ inputText }) => {
  const [outputHtml, setOutputHtml] = useLocalStorage<string>('minimessage_preview', '');
  const [activeTab, setActiveTab] = useLocalStorage<number>('minimessage_tab', 0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    wsRef.current = new WebSocket('wss://webui.advntr.dev/api/mini-to-html');

    wsRef.current.onopen = () => {
      // Send initial placeholders message
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({ type: 'placeholders' }));
      }
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data: WebSocketResponse = JSON.parse(event.data);
        if (data.parseResult?.success) {
          setOutputHtml(data.parseResult.dom);
        } else {
          console.error('WebSocket response error:', data);
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup WebSocket on component unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    // Send updated miniMessage whenever inputText changes
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'call', miniMessage: inputText }));
    }
  }, [inputText]);

  return (
    <div className="w-full flex-1">
      <TextPreview activeTab={activeTab} setActiveTab={setActiveTab} previewText={outputHtml} />
    </div>
  );
};

export default OutputPane;