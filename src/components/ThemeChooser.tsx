import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t as translateText } from '../i18n';

export type ThemeType = 'dark' | 'violet' | 'light';

interface ThemeOption {
  id: ThemeType;
  name: string;
  subtitle: string;
  icon: string;
  bgPreview: string;
  accentPreview: string;
  secondaryPreview: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'dark',
    name: 'Cyber Obsidian',
    subtitle: 'Deep Tech Navy & Electric Cyan',
    icon: 'fa-solid fa-moon',
    bgPreview: '#060D17',
    accentPreview: '#00F0FF',
    secondaryPreview: '#10B981'
  },
  {
    id: 'violet',
    name: 'Galactic Violet',
    subtitle: 'Cosmic Nebula & Neon Orchid',
    icon: 'fa-solid fa-atom',
    bgPreview: '#090514',
    accentPreview: '#C084FC',
    secondaryPreview: '#F43F5E'
  },
  {
    id: 'light',
    name: 'Arctic Light',
    subtitle: 'Architectural Daylight & Oceanic Teal',
    icon: 'fa-solid fa-sun',
    bgPreview: '#F5F9FA',
    accentPreview: '#006E80',
    secondaryPreview: '#152C35'
  }
];

interface ThemeChooserProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

export default function ThemeChooser({ currentTheme, onThemeChange }: ThemeChooserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const activeOption = THEME_OPTIONS.find((t) => t.id === currentTheme) || THEME_OPTIONS[0];

  return (
    <div className="theme-chooser-container" ref={containerRef}>
      {/* Trigger Button in Header */}
      <button
        type="button"
        className={`theme-chooser-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={translateText(`Theme: ${activeOption.name}`)}
        title={translateText("Select Theme")}
        id="theme-palette-button"
      >
        <span
          className="theme-trigger-swatch-ring"
          style={{ borderColor: activeOption.accentPreview }}
        >
          <span
            className="theme-trigger-swatch-dot"
            style={{ background: activeOption.accentPreview }}
          />
        </span>
        <i className={activeOption.icon} aria-hidden="true" />
        <i className="fa-solid fa-chevron-down theme-trigger-caret" />
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="theme-chooser-popover"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            role="dialog"
            aria-label={translateText("Select Theme")}
          >
            <div className="theme-chooser-header">
              <span className="theme-chooser-kicker">
                <i className="fa-solid fa-palette" style={{ marginRight: '6px' }} />
                {translateText("Select Theme")}
              </span>
              <span className="theme-chooser-count">3 {translateText("Palettes")}</span>
            </div>

            <div className="theme-options-list" role="radiogroup">
              {THEME_OPTIONS.map((option) => {
                const isSelected = option.id === currentTheme;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`theme-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      onThemeChange(option.id);
                      setIsOpen(false);
                    }}
                    id={`theme-option-${option.id}`}
                  >
                    {/* Visual miniature theme palette swatch */}
                    <div
                      className="theme-option-preview"
                      style={{
                        background: option.bgPreview,
                        borderColor: isSelected ? option.accentPreview : 'rgba(255, 255, 255, 0.15)'
                      }}
                    >
                      <span
                        className="theme-preview-dot main"
                        style={{ background: option.accentPreview }}
                      />
                      <span
                        className="theme-preview-dot sec"
                        style={{ background: option.secondaryPreview }}
                      />
                    </div>

                    <div className="theme-option-info">
                      <div className="theme-option-title-row">
                        <span className="theme-option-title">{translateText(option.name)}</span>
                        {isSelected && (
                          <span
                            className="theme-active-tag"
                            style={{
                              color: option.accentPreview,
                              borderColor: `${option.accentPreview}66`,
                              background: `${option.accentPreview}18`
                            }}
                          >
                            <i className="fa-solid fa-check" style={{ marginRight: '4px' }} />
                            {translateText("Active")}
                          </span>
                        )}
                      </div>
                      <span className="theme-option-subtitle">{translateText(option.subtitle)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
