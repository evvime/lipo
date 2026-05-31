import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminRoute from './AdminRoute';
import useAuthStore from '../../store/useAuthStore';

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<div>admin panel</div>} />
        </Route>
        <Route path="/login" element={<div>login page</div>} />
        <Route path="/" element={<div>home page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('AdminRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, profile: null, role: null, loading: false });
  });

  it('user yoksa /login\'e yönlendirir', () => {
    useAuthStore.setState({ user: null, loading: false });
    renderWithRouter();
    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('user_metadata.role=admin admin paneline ERİŞİM VERMEMELİ (güvenlik)', () => {
    // Kritik: client tarafından set edilebilen user_metadata kabul edilmemeli
    useAuthStore.setState({
      user: { id: '1', email: 'x@y.com', user_metadata: { role: 'admin' }, app_metadata: {} },
      loading: false,
    });
    renderWithRouter();
    expect(screen.getByText('home page')).toBeInTheDocument();
    expect(screen.queryByText('admin panel')).not.toBeInTheDocument();
  });

  it('hardcoded admin@wellnur.com erişim VERMEMELİ', () => {
    useAuthStore.setState({
      user: { id: '1', email: 'admin@wellnur.com', user_metadata: {}, app_metadata: {} },
      loading: false,
    });
    renderWithRouter();
    expect(screen.getByText('home page')).toBeInTheDocument();
  });

  it('app_metadata.role=admin erişim verir', () => {
    useAuthStore.setState({
      user: { id: '1', email: 'x@y.com', user_metadata: {}, app_metadata: { role: 'admin' } },
      loading: false,
    });
    renderWithRouter();
    expect(screen.getByText('admin panel')).toBeInTheDocument();
  });
});
