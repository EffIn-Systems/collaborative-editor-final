import React, { useEffect } from 'react';
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";

export default function Editor({ currentUser }) {
  const liveblocks = useLiveblocksExtension();
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      liveblocks,
    ],
    content: '<h2>Welcome to your collaborative space ✨</h2><p>Start typing to collaborate in real-time with your team!</p>',
    editorProps: {
      attributes: {
        class: 'editor-content-area',
      },
    },
  });

  useEffect(() => {
    if (editor) {
      // Expose editor API globally just like your original
      window.editorApi = {
        getText: () => editor.getText() || '',
        getHTML: () => editor.getHTML() || '',
        getJSON: () => editor.getJSON() || {},
        getRoomId: () => window.location.pathname.split('/').pop() || 'default-room'
      };
      
      console.log('Editor API exposed on window.editorApi');
    }
    
    return () => {
      if (window.editorApi) {
        delete window.editorApi;
        console.log('Editor API cleaned up');
      }
    };
  }, [editor]);

  const buttonStyle = {
    marginRight: '6px',
    padding: '8px 14px',
    border: '1px solid rgba(83, 113, 247, 0.2)',
    borderRadius: '6px',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    color: '#0E0146',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 1px 2px rgba(14, 1, 70, 0.05)'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    background: '#5371F7',
    color: '#fff',
    borderColor: '#5371F7',
    boxShadow: '0 2px 4px rgba(83, 113, 247, 0.2)'
  };

  const hoverStyle = `
    .editor-button:hover:not(:disabled) {
      background: rgba(83, 113, 247, 0.05);
      border-color: #5371F7;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(83, 113, 247, 0.15);
    }
    .editor-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      width: '100%',
      background: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '2px solid #0E0146',
      boxShadow: '0 4px 12px rgba(14, 1, 70, 0.1)'
    }}>
      {/* Header Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #0E0146 0%, #1a0a5e 100%)',
        padding: '12px 20px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ 
          width: '8px', 
          height: '8px', 
          background: '#5371F7',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'pulse 2s infinite'
        }}></span>
        Collaborative Editor
        <span style={{ marginLeft: 'auto', fontSize: '12px' }}>
          👤 {currentUser?.name || 'Anonymous'}
        </span>
      </div>
      
      {/* Toolbar */}
      <div style={{ 
        padding: '10px 16px',
        borderBottom: '1px solid rgba(14, 1, 70, 0.08)',
        background: 'rgba(83, 113, 247, 0.02)',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '4px'
      }}>
        <style>{hoverStyle}</style>
        {editor && (
          <>
            <button
              className="editor-button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              style={editor.isActive('bold') ? activeButtonStyle : buttonStyle}
              title="Bold (Cmd+B)"
            >
              <strong>B</strong>
            </button>
            
            <button
              className="editor-button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              style={editor.isActive('italic') ? activeButtonStyle : buttonStyle}
              title="Italic (Cmd+I)"
            >
              <em>I</em>
            </button>
            
            <button
              className="editor-button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              style={editor.isActive('code') ? activeButtonStyle : buttonStyle}
              title="Code"
            >
              {'</>'}
            </button>
            
            <div style={{ 
              width: '1px', 
              height: '24px', 
              background: 'rgba(14, 1, 70, 0.1)', 
              margin: '0 8px' 
            }} />
            
            <button
              className="editor-button"
              onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
              style={editor.isActive('heading', { level: 2 }) ? activeButtonStyle : buttonStyle}
              title="Heading"
            >
              H2
            </button>
            
            <button
              className="editor-button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              style={editor.isActive('bulletList') ? activeButtonStyle : buttonStyle}
              title="Bullet List"
            >
              • List
            </button>
            
            <button
              className="editor-button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              style={editor.isActive('orderedList') ? activeButtonStyle : buttonStyle}
              title="Numbered List"
            >
              1. List
            </button>
            
            <div style={{ 
              width: '1px', 
              height: '24px', 
              background: 'rgba(14, 1, 70, 0.1)', 
              margin: '0 8px' 
            }} />
            
            <button
              className="editor-button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              style={buttonStyle}
              title="Undo"
            >
              ↶
            </button>
            
            <button
              className="editor-button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              style={buttonStyle}
              title="Redo"
            >
              ↷
            </button>
          </>
        )}
      </div>
      
      {/* Editor Content Area */}
      <div style={{ 
        flex: 1,
        overflow: 'auto',
        padding: '24px',
        background: '#fff'
      }}>
        <EditorContent 
          editor={editor} 
          style={{
            height: '100%',
            outline: 'none'
          }}
        />
      </div>
    </div>
  );
}

// Add the same styles from your original
if (typeof window !== 'undefined' && !window.__editorBrandedStylesAdded) {
  window.__editorBrandedStylesAdded = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
    
    .editor-content-area {
      min-height: 200px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 16px;
      line-height: 1.7;
      color: #0E0146;
    }
    
    .editor-content-area:focus {
      outline: none;
    }
    
    .editor-content-area p {
      margin: 0 0 1em 0;
    }
    
    .editor-content-area h1,
    .editor-content-area h2,
    .editor-content-area h3 {
      margin: 1.2em 0 0.6em 0;
      font-weight: 600;
      color: #0E0146;
    }
    
    .editor-content-area h2 {
      color: #5371F7;
      border-bottom: 2px solid rgba(83, 113, 247, 0.1);
      padding-bottom: 0.3em;
    }
    
    .editor-content-area code {
      background: rgba(83, 113, 247, 0.08);
      color: #5371F7;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 0.9em;
    }
    
    .editor-content-area ul,
    .editor-content-area ol {
      padding-left: 1.5em;
      margin: 0.5em 0;
    }
    
    .editor-content-area li {
      margin: 0.25em 0;
    }
    
    .ProseMirror-focused {
      outline: none;
    }
    
    .collaboration-cursor__caret {
      border-color: #5371F7;
    }
    
    .collaboration-cursor__label {
      background: #5371F7;
      color: white;
      font-size: 12px;
      font-weight: 500;
    }
  `;
  document.head.appendChild(style);
}