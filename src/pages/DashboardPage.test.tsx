/**
 * @file DashboardPage — page-level tests.
 *
 * Verifies that the dashboard renders the stat cards and activity feed
 * when a user is authenticated.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/utils';
import { useAuthStore } from '@/features/auth';
import DashboardPage from './DashboardPage';

const MOCK_USER = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'admin' as const,
};

beforeEach(() => {
  useAuthStore.setState({
    user: MOCK_USER,
    isAuthenticated: true,
    isLoading: false,
  });
});

describe('DashboardPage', () => {
  it('renders the welcome banner with the user name', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText(/Good to see you/i)).toBeInTheDocument();
    expect(screen.getByText(/Test/i)).toBeInTheDocument();
  });

  it('renders all four stat cards', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
    expect(screen.getByText('Active Sessions')).toBeInTheDocument();
    expect(screen.getByText('Tickets Resolved')).toBeInTheDocument();
  });

  it('renders the recent activity section', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  });
});
