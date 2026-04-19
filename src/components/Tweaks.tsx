import { useEffect, useState } from 'react';
import { IconClose, IconTweaks } from './Icon';

const VALUES = ['sharp', 'soft', 'round'] as const;
type RadiusValue = (typeof VALUES)[number];

function readRadius(): RadiusValue {
  const v = localStorage.getItem('cch.radius');
  return (VALUES as readonly string[]).includes(v ?? '') ? (v as RadiusValue) : 'soft';
}

export default function Tweaks() {
  const [open, setOpen] = useState(false);
  const [radius, setRadius] = useState<RadiusValue>(readRadius);

  useEffect(() => {
    document.documentElement.setAttribute('data-radius', radius);
    localStorage.setItem('cch.radius', radius);
  }, [radius]);

  return (
    <>
      <button
        type="button"
        className="tweaks-fab"
        style={{ display: 'flex' }}
        title="Tweaks"
        onClick={() => setOpen((v) => !v)}
      >
        <IconTweaks />
      </button>
      <div className={`tweaks-panel${open ? ' open' : ''}`}>
        <div className="tweaks-header">
          <h4>Tweaks</h4>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{ color: 'var(--ink-3)' }}
            aria-label="Close"
          >
            <IconClose />
          </button>
        </div>
        <div className="tweaks-row">
          <div className="tweaks-label">圆角风格</div>
          <div className="tweaks-seg">
            {VALUES.map((v) => (
              <button
                key={v}
                type="button"
                className={radius === v ? 'on' : ''}
                onClick={() => setRadius(v)}
              >
                {v === 'sharp' ? '尖锐' : v === 'soft' ? '柔和' : '圆润'}
              </button>
            ))}
          </div>
        </div>
        <div className="tweaks-row">
          <div className="tweaks-label">当前主色</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 10px',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-md)',
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                background: 'var(--brand)',
              }}
            />
            <code
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--ink-2)',
              }}
            >
              #B54A3A 砖红
            </code>
          </div>
        </div>
      </div>
    </>
  );
}
