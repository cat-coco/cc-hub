import type { ReactNode } from 'react';
import { useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import '../styles/admin.css';
import '../styles/admin-pages.css';

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminShell({ title, subtitle, actions, children }: Props) {
  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => document.body.classList.remove('admin-body');
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="amain">
        <div className="admin-page">
          <div className="admin-page-head" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
            <div>{actions}</div>
          </div>
          <div className="admin-page-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
