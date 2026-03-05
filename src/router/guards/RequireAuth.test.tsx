/**
 * @file RequireAuth — route guard tests.
 *
 * Tests that unauthenticated users are redirected and authenticated
 * users see the protected content.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { RequireAuth } from './RequireAuth';
import { ROUTES } from '@/constants';

// Reset Zustand store between tests so state doesn't bleed across
beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });
});

function renderWithRouter(isAuthenticated: boolean, isLoading = false) {
  useAuthStore.setState({ isAuthenticated, isLoading });

  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <div>Protected content</div>
            </RequireAuth>
          }
        />
        <Route path={ROUTES.LOGIN} element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequireAuth', () => {
  it('renders children when user is authenticated', () => {
    renderWithRouter(true);
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    renderWithRouter(false);
    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('shows a loading spinner while session check is in-flight', () => {
    const { container } = renderWithRouter(false, true);
    // Component renders a spinner (not null) during loading
    expect(container.querySelector('[role="status"]')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });
});
