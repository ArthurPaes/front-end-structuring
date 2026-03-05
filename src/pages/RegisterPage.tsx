/**
 * @file Register page — new account creation screen.
 */
import { Link } from 'react-router-dom';
import { RegisterForm } from '@/components/RegisterForm';
import { ROUTES } from '@/constants';

export default function RegisterPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
        <p className="text-gray-500 text-sm mt-1">Join us today — it&#39;s free</p>
      </div>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-indigo-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
