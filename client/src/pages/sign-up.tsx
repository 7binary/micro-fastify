import { GuestLayout } from '@/layouts/GuestLayout';
import { RegisterForm } from '@/features/auth/RegisterForm';

export default function SignUpPage() {
  return (
    <GuestLayout title="Sign up right now!">
      <RegisterForm />
    </GuestLayout>
  );
}
