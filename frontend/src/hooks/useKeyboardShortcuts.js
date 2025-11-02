import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key, ctrlKey, altKey, shiftKey } = event;
      
      shortcuts.forEach(({ keys, action, preventDefault = true }) => {
        const [modifier, mainKey] = keys.split('+');
        
        let modifierMatch = false;
        if (modifier === 'ctrl') modifierMatch = ctrlKey;
        else if (modifier === 'alt') modifierMatch = altKey;
        else if (modifier === 'shift') modifierMatch = shiftKey;
        
        if (modifierMatch && key.toLowerCase() === mainKey.toLowerCase()) {
          if (preventDefault) event.preventDefault();
          action();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}