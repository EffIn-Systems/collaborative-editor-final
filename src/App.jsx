import React, { useState, useEffect } from 'react';
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import Editor from './Editor';
import './App.css';

function Loading() {
  return <div style={{ padding: '20px', textAlign: 'center' }}>Loading collaborative editor...</div>;
}

function ErrorFallback({ error }) {
  return (
    <div style={{ padding: 20, background: '#ffe6e6', border: '1px solid #ff0000' }}>
      <strong>Liveblocks Error:</strong> {error.message}
    </div>
  );
}

function App() {
  const [roomId, setRoomId] = useState('my-room');
  const [publicApiKey, setPublicApiKey] = useState(import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY || '');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Read URL parameters just like your original code
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('roomId');
    const userParam = params.get('userName');
    
    if (roomParam) {
      setRoomId(roomParam);
    }
    
    // Generate anonymous user if none provided
    const anonymousId = `anonymous-${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userParam || anonymousId,
      name: userParam || "Anonymous User",
      avatar: "",
      color: "#5371F7"
    };
    setCurrentUser(user);
    
    console.log('🔧 App component rendering with:', { 
      roomId: roomParam || 'my-room', 
      publicApiKey: publicApiKey?.substring(0, 10) + '...',
      user: user.name
    });
  }, []);
  
  if (!publicApiKey || publicApiKey.trim() === '') {
    return (
      <div style={{ padding: 20, background: '#ffe6e6', border: '1px solid #ff0000' }}>
        <strong>Error:</strong> Liveblocks Public API Key is required.
        <br />
        <small>Please enter your public API key (starts with pk_) in the .env file.</small>
      </div>
    );
  }

  // Validate API key format
  if (!publicApiKey.startsWith('pk_')) {
    return (
      <div style={{ padding: 20, background: '#ffe6e6', border: '1px solid #ff0000' }}>
        <strong>Error:</strong> Invalid API Key format. Liveblocks public keys should start with "pk_"
        <br />
        <small>Current key: {publicApiKey.substring(0, 10)}...</small>
      </div>
    );
  }

  if (!currentUser) {
    return <Loading />;
  }

  try {
    return (
      <LiveblocksProvider 
        publicApiKey={publicApiKey}
        throttle={100}
      >
        <RoomProvider 
          id={roomId}
          initialPresence={{}}
          initialStorage={{}}
        >
          <ClientSideSuspense fallback={<Loading />}>
            {() => {
              try {
                return <Editor currentUser={currentUser} />;
              } catch (error) {
                console.error('Error rendering editor:', error);
                return <ErrorFallback error={error} />;
              }
            }}
          </ClientSideSuspense>
        </RoomProvider>
      </LiveblocksProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return <ErrorFallback error={error} />;
  }
}

export default App;