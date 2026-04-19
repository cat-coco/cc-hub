import type { ReactNode } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import Tweaks from './Tweaks';

interface LayoutProps {
  active?: string;
  children: ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
  showTweaks?: boolean;
}

export default function Layout({
  active,
  children,
  showNav = true,
  showFooter = true,
  showTweaks = true,
}: LayoutProps) {
  return (
    <>
      {showNav && <Nav active={active} />}
      {children}
      {showFooter && <Footer />}
      {showTweaks && <Tweaks />}
    </>
  );
}
