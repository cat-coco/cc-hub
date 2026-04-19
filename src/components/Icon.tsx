import type { ReactNode, SVGProps } from 'react';

type Size = 'sm' | 'md' | 'lg';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: Size;
  children: ReactNode;
}

export default function Icon({ size = 'md', children, className = '', ...rest }: IconProps) {
  const cls = ['ic'];
  if (size === 'sm') cls.push('ic-sm');
  if (size === 'lg') cls.push('ic-lg');
  if (className) cls.push(className);
  return (
    <svg className={cls.join(' ')} viewBox="0 0 24 24" {...rest}>
      {children}
    </svg>
  );
}

export const IconSearch = (p: { size?: Size }) => (
  <Icon size={p.size ?? 'sm'}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

export const IconCopy = (p: { size?: Size }) => (
  <Icon size={p.size ?? 'sm'}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </Icon>
);

export const IconClose = (p: { size?: Size }) => (
  <Icon size={p.size ?? 'sm'}>
    <path d="m6 6 12 12" />
    <path d="m18 6-12 12" />
  </Icon>
);

export const IconTweaks = (p: { size?: Size }) => (
  <Icon size={p.size ?? 'md'}>
    <path d="M4 7h10" />
    <path d="M20 7h-2" />
    <path d="M4 17h6" />
    <path d="M20 17h-6" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="12" cy="17" r="2" />
  </Icon>
);
