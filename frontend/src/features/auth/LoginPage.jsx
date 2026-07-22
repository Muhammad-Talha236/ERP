import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { AuthLayout } from './components/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginSchema } from './schemas/auth.schema';
import { useLogin } from './hooks/useLogin';

/**
 * LoginPage — the sign-in screen.
 *
 * After a successful login, redirects based on the returned user's
 * role: SuperAdmin goes to the platform-level /super-admin screen,
 * Admin (factory-level) goes to the regular Dashboard at "/".
 */
export function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const { mutate: login, isPending } = useLogin();

  const onSubmit = (formData) => {
    setServerError(null);
    login(formData, {
      onSuccess: (data) => {
        if (data.user.role === 'SuperAdmin') {
          navigate({ to: '/super-admin' });
        } else {
          navigate({ to: '/' });
        }
      },
      onError: (err) => setServerError(err.message || 'Login failed.'),
    });
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your factory dashboard">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          required
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          required
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        {serverError && <p className="text-sm text-danger">{serverError}</p>}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <p className="text-sm text-text-secondary text-center mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary font-medium hover:text-primary-hover">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}