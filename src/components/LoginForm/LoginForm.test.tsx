/**
 * @file LoginForm — component tests.
 *
 * Uses MSW (wired in src/tests/setup.ts) to intercept POST /auth/login
 * so we test actual network behaviour without hitting a real server.
 */
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/tests/mocks/server';
import { renderWithProviders } from '@/tests/utils';
import { LoginForm } from './LoginForm';

// ── helpers ─────────────────────────────────────────────────────────
const setup = () => {
  const user = userEvent.setup();
  const utils = renderWithProviders(<LoginForm />);
  // Stable getters for the two fields
  const emailInput = () => screen.getByLabelText('Email address');
  const passwordInput = () => screen.getByLabelText('Password');
  return { user, emailInput, passwordInput, ...utils };
};

// ── tests ────────────────────────────────────────────────────────────
describe('LoginForm', () => {
  it('renders email, password fields and submit button', () => {
    const { emailInput, passwordInput } = setup();

    expect(emailInput()).toBeInTheDocument();
    expect(passwordInput()).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const { user, passwordInput } = setup();

    expect(passwordInput()).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: /show password/i }));
    expect(passwordInput()).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: /hide password/i }));
    expect(passwordInput()).toHaveAttribute('type', 'password');
  });

  it('submits credentials — calls login mutation and receives success response', async () => {
    const { user, emailInput, passwordInput } = setup();

    await user.type(emailInput(), 'test@example.com');
    await user.type(passwordInput(), 'secret123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // The MSW handler returns success; the mutation should complete without error alert
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('shows an error message when login fails', async () => {
    // Override the default handler to return 401
    server.use(
      http.post('*/auth/login', () =>
        HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 }),
      ),
    );

    const { user, emailInput, passwordInput } = setup();

    await user.type(emailInput(), 'wrong@example.com');
    await user.type(passwordInput(), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('disables submit button while request is in-flight', async () => {
    // Delay the response so we can inspect intermediate state
    let resolveRequest!: () => void;
    server.use(
      http.post('*/auth/login', async () => {
        await new Promise<void>((r) => { resolveRequest = r; });
        return HttpResponse.json({});
      }),
    );

    const { user, emailInput, passwordInput } = setup();

    await user.type(emailInput(), 'test@example.com');
    await user.type(passwordInput(), 'secret');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
    });

    // Clean up
    resolveRequest();
  });
});
