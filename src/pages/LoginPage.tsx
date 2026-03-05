/**
 * @file Login page — brought together by the router.
 *
 * ARCHITECTURE: Pages are thin glue — they compose organisms/templates
 * and wire up data fetching. Max ~50 lines.
 */
import { Link } from 'react-router-dom';
import { LoginForm } from '@/components/LoginForm';
import { ROUTES } from '@/constants';

export default function LoginPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-gray-500 text-sm mt-1">Sign in to your account to continue</p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-indigo-600 font-medium hover:underline">
          Create one
        </Link>
      </p>
    </>
  );
}
