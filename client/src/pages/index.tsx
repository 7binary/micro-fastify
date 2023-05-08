import { GuestLayout } from '@/layouts/GuestLayout';
import { LoginForm } from '@/features/auth/LoginForm';

export default function SignInPage() {
  return (
    <GuestLayout title="Sign in to your account">
      <LoginForm />
    </GuestLayout>
  );
}
