'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  LayoutDashboard, 
  Plus, 
  Settings, 
  FileText,
  Video,
  Image,
  Sparkles,
  X,
  Command
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CommandItem[];
}

/**
 * Command Palette Component (Cmd+K)
 * Inspired by shadcn/ui Command
 * Provides quick navigation and actions
 */
export function CommandPalette({ isOpen, onClose, items }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const defaultItems: CommandItem[] = [
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      description: 'View your main dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      shortcut: 'G D',
      action: () => { router.push('/dashboard'); onClose(); },
      category: 'Navigation',
    },
    {
      id: 'create',
      title: 'Create Campaign',
      description: 'Start a new marketing campaign',
      icon: <Plus className="w-4 h-4" />,
      shortcut: 'G C',
      action: () => { router.push('/create'); onClose(); },
      category: 'Navigation',
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure your preferences',
      icon: <Settings className="w-4 h-4" />,
      shortcut: 'G S',
      action: () => { router.push('/settings'); onClose(); },
      category: 'Navigation',
    },
    {
      id: 'ai-script',
      title: 'Generate AI Script',
      description: 'Create a new ad script',
      icon: <Sparkles className="w-4 h-4" />,
      action: () => { router.push('/create'); onClose(); },
      category: 'Actions',
    },
    {
      id: 'video-studio',
      title: 'Video Studio',
      description: 'Create video content',
      icon: <Video className="w-4 h-4" />,
      action: () => { router.push('/create'); onClose(); },
      category: 'Create',
    },
    {
      id: 'image-studio',
      title: 'Image Studio',
      description: 'Create image assets',
      icon: <Image className="w-4 h-4" />,
      action: () => { router.push('/create'); onClose(); },
      category: 'Create',
    },
  ];

  const allItems = items || defaultItems;

  const filteredItems = allItems.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description?.toLowerCase().includes(query.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    const group = item.category || 'Actions';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const flatFilteredItems = filteredItems;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        // Open with Cmd+K or Ctrl+K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          // Parent should handle opening
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, flatFilteredItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (flatFilteredItems[selectedIndex]) {
            flatFilteredItems[selectedIndex].action();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatFilteredItems, selectedIndex, onClose]);

  const handleSelect = useCallback((item: CommandItem) => {
    item.action();
    onClose();
  }, [onClose]);

  let currentIndex = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="command-overlay"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="command-dialog"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-[#A1A1AA]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search..."
                className="command-input flex-1"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-[#A1A1AA] bg-white/5 rounded">
                esc
              </kbd>
            </div>

            {/* Results */}
            <div className="command-results">
              {Object.entries(groupedItems).map(([group, groupItems]) => (
                <div key={group} className="command-group">
                  <div className="command-group-title">{group}</div>
                  {groupItems.map((item) => {
                    currentIndex++;
                    const itemIndex = currentIndex;
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'command-item',
                          selectedIndex === itemIndex && 'bg-white/5 border border-[rgba(255,218,185,0.3)]'
                        )}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(itemIndex)}
                      >
                        {item.icon && (
                          <div className="command-item-icon text-[#FFDAB9]">
                            {item.icon}
                          </div>
                        )}
                        <div className="command-item-text">
                          <div className="command-item-title">{item.title}</div>
                          {item.description && (
                            <div className="command-item-description">{item.description}</div>
                          )}
                        </div>
                        {item.shortcut && (
                          <div className="command-shortcut">
                            <span className="text-xs">{item.shortcut}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="p-8 text-center text-[#A1A1AA]">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No results found for "{query}"</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-[#A1A1AA]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/5 rounded">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white/5 rounded">↓</kbd>
                  <span className="ml-1">navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/5 rounded">↵</kbd>
                  <span className="ml-1">select</span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Command className="w-3 h-3" />
                <span>K to open</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to manage command palette state
 */
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
}
