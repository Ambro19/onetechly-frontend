// src/components/SegmentedRadioGroup.jsx
// why: reusable, accessible segmented radio with keyboard support (no ESLint warnings)

import React, { useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

function SegmentedRadioGroup({
  options,
  value,
  onChange,
  disabled = false,
  className = '',
  ariaLabel = 'Options',
}) {
  const btnRefs = useRef([]);

  const items = useMemo(
    () =>
      (options || []).map((opt) =>
        typeof opt === 'string' ? { value: opt, label: opt, disabled: false } : opt
      ),
    [options]
  );

  const enabledIndexes = useMemo(
    () => items.map((o, idx) => (!o.disabled ? idx : null)).filter((x) => x !== null),
    [items]
  );

  const currentIndex = useMemo(() => {
    const idx = items.findIndex((o) => o.value === value);
    return idx >= 0 ? idx : enabledIndexes[0] ?? 0;
  }, [items, value, enabledIndexes]);

  useEffect(() => {
    // keep ref array length in sync
    btnRefs.current = btnRefs.current.slice(0, items.length);
  }, [items.length]);

  const focusIndex = (idx) => {
    const el = btnRefs.current[idx];
    if (el && typeof el.focus === 'function') el.focus();
  };

  const nextEnabled = (idx) => {
    const all = items.length;
    for (let step = 1; step <= all; step += 1) {
      const j = (idx + step) % all;
      if (!items[j].disabled) return j;
    }
    return idx;
  };

  const prevEnabled = (idx) => {
    const all = items.length;
    for (let step = 1; step <= all; step += 1) {
      const j = (idx - step + all) % all;
      if (!items[j].disabled) return j;
    }
    return idx;
  };

  const handleKeyDown = (e) => {
    if (disabled || items.length === 0) return;

    let targetIdx = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      targetIdx = nextEnabled(currentIndex);
      e.preventDefault();
      onChange?.(items[targetIdx].value);
      focusIndex(targetIdx);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      targetIdx = prevEnabled(currentIndex);
      e.preventDefault();
      onChange?.(items[targetIdx].value);
      focusIndex(targetIdx);
    } else if (e.key === 'Home') {
      targetIdx = enabledIndexes[0] ?? currentIndex;
      e.preventDefault();
      onChange?.(items[targetIdx].value);
      focusIndex(targetIdx);
    } else if (e.key === 'End') {
      targetIdx = enabledIndexes[enabledIndexes.length - 1] ?? currentIndex;
      e.preventDefault();
      onChange?.(items[targetIdx].value);
      focusIndex(targetIdx);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.(items[currentIndex].value);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={clsx(
        'inline-flex rounded-xl border border-purple-300 bg-white p-1 shadow-sm',
        disabled && 'opacity-60 pointer-events-none',
        className
      )}
      onKeyDown={handleKeyDown}
    >
      {items.map((opt, idx) => {
        const selected = value === opt.value;
        const isDisabled = disabled || opt.disabled;

        return (
          <button
            key={opt.value}
            ref={(el) => (btnRefs.current[idx] = el)}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-disabled={isDisabled}
            tabIndex={selected ? 0 : -1}
            onClick={() => !isDisabled && onChange?.(opt.value)}
            className={clsx(
              'min-w-[72px] px-3 py-2 rounded-lg text-sm font-medium transition-colors outline-none',
              'focus-visible:ring-2 focus-visible:ring-purple-500',
              selected
                ? 'bg-purple-600 text-white'
                : 'bg-transparent text-purple-800 hover:bg-purple-100',
              idx !== 0 && 'ml-1',
              isDisabled && 'cursor-not-allowed'
            )}
            disabled={isDisabled}
          >
            {opt.label ?? opt.value}
          </button>
        );
      })}
    </div>
  );
}

SegmentedRadioGroup.propTypes = {
  name: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.node,
        disabled: PropTypes.bool,
      }),
    ])
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default SegmentedRadioGroup;
