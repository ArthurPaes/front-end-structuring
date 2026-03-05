/**
 * @file RegisterForm organism — complete registration form.
 *
 * Handles name / email / password / confirm-password with client-side
 * validation before calling the register mutation.
 */
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { useRegister } from '@/features/auth';
import { ROUTES } from '@/constants';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();
  const { mutate: register, isPending, error } = useRegister();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidationError('');

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    register(
      { name, email, password },
      { onSuccess: () => navigate(ROUTES.DASHBOARD, { replace: true }) },
    );
  }

  const displayError = validationError || (error instanceof Error ? error.message : error ? 'Registration failed. Please try again.' : '');

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField
        label="Full name"
        type="text"
        name="name"
        id="name"
        autoComplete="name"
        required
        placeholder="Jane Smith"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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
          autoComplete="new-password"
          required
          placeholder="Min. 8 characters"
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

      <FormField
        label="Confirm password"
        type={showPassword ? 'text' : 'password'}
        name="confirmPassword"
        id="confirmPassword"
        autoComplete="new-password"
        required
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {displayError && (
        <p
          className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
          role="alert"
        >
          {displayError}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isPending}
        className="w-full"
      >
        {isPending ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}
