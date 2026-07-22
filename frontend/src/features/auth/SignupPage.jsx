import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { AuthLayout } from './components/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { signupSchema } from './schemas/auth.schema';
import { useSignup } from './hooks/useSignup';

/**
 * SignupPage — creates a new factory account.
 *
 * Always creates an 'Admin' role user (Factory Admin) — SuperAdmin
 * accounts are provisioned separately, never through public signup,
 * per standard multi-tenant SaaS practice (and your DB docs).
 */
export function SignupPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const { mutate: signup, isPending } = useSignup();

  const onSubmit = (formData) => {
    setServerError(null);
    signup(formData, {
      onSuccess: () => navigate({ to: '/' }),
      onError: (err) => setServerError(err.message || 'Signup failed.'),
    });
  };

  return (
    <AuthLayout title="Create your account" subtitle="Set up your factory on NorthForge">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" required error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Last Name" required error={errors.lastName?.message} {...register('lastName')} />
        </div>

        <Input
          label="Company Name"
          required
          placeholder="e.g. NorthForge Textiles"
          error={errors.companyName?.message}
          {...register('companyName')}
        />

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
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm Password"
          type="password"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {serverError && <p className="text-sm text-danger">{serverError}</p>}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="text-sm text-text-secondary text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-medium hover:text-primary-hover">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}