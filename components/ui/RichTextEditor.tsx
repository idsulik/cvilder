import React, { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline, List } from 'lucide-react';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ label, value, onChange, className }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Sync value to innerHTML when value changes externally, but ONLY if not focused.
  useEffect(() => {
    if (contentRef.current) {
        // We check if the values differ to avoid unnecessary assignments
        if (contentRef.current.innerHTML !== value) {
             // If we are focused, we assume the user is typing and the DOM is the source of truth.
             // We do NOT want to overwrite the DOM with the 'value' prop (which is just an echo) 
             // because that resets the cursor.
             if (!isFocused) {
                 contentRef.current.innerHTML = value;
             }
        }
    }
  }, [value, isFocused]);

  const handleInput = () => {
    if (contentRef.current) {
      const html = contentRef.current.innerHTML;
      if (html !== value) {
        onChange(html);
      }
    }
  };

  const execCommand = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    if (contentRef.current) {
        contentRef.current.focus();
    }
  };

  return (
    <div className={`flex flex-col gap-1 mb-3 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div 
        className={`border rounded-md overflow-hidden bg-white transition-colors flex flex-col ${isFocused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'}`}
      >
        <div className="flex items-center gap-1 p-2 border-b bg-gray-50 text-gray-600">
          <button 
            type="button"
            onClick={() => execCommand('bold')}
            className="p-1 hover:bg-gray-200 rounded"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button 
            type="button"
            onClick={() => execCommand('italic')}
            className="p-1 hover:bg-gray-200 rounded"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button 
            type="button"
            onClick={() => execCommand('underline')}
            className="p-1 hover:bg-gray-200 rounded"
            title="Underline"
          >
            <Underline size={16} />
          </button>
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          <button 
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            className="p-1 hover:bg-gray-200 rounded"
            title="Bullet List"
          >
            <List size={16} />
          </button>
        </div>
        
        <div
          ref={contentRef}
          className="p-3 min-h-[100px] text-sm focus:outline-none max-h-[500px] overflow-auto resize-y [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  );
};
