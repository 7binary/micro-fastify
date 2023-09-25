import { AuthBackground } from '@/features/auth/AuthBackground';
import { LoginForm } from '@/features/auth/LoginForm';
import { GuestLayout } from '@/layouts/GuestLayout';

const SigninPage = () => {
  return (
    <GuestLayout>
      <section className="relative z-10 overflow-hidden pb-15 md:pb-20 lg:pb-28">
        <div className="container">
          <LoginForm />
        </div>
        <AuthBackground />
      </section>
    </GuestLayout>
  );
};

export default SigninPage;
