/**
 * @file LoginForm organism — a complete, self-contained login form.
 *
 * ATOMIC DESIGN: Organisms are complex UI blocks composed of molecules/atoms.
 * They handle local form state + validation, then delegate to hooks for side effects.
 *
 * PATTERN: Render props / custom hook extraction — the form logic could
 * be extracted into a `useLoginForm` hook if it grows beyond ~30 lines.
 */
import { type FormEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { useLogin } from '@/features/auth';
import { ROUTES } from '@/constants';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: login, isPending, error } = useLogin();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.DASHBOARD;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login(
      { email, password },
      { onSuccess: () => navigate(from, { replace: true }) },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField
        label="Email address"
        type="email"
        name="email"
        id="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="relative">
        <FormField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          id="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 text-xs select-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
          <input type="checkbox" className="rounded border-gray-300 text-indigo-600" />
          Remember me
        </label>
        <a href="#" className="text-indigo-600 hover:underline">
          Forgot password?
        </a>
      </div>

      {error && (
        <p
          className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
          role="alert"
        >
          {error instanceof Error ? error.message : 'Login failed. Please try again.'}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isPending}
        className="w-full"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
