import { AuthBackground } from '@/features/auth/AuthBackground';
import { RegisterForm } from '@/features/auth/RegisterForm';
import { GuestLayout } from '@/layouts/GuestLayout';

const SignupPage = () => {
  return (
    <GuestLayout>
      <section className="relative z-10 overflow-hidden pb-15 md:pb-20 lg:pb-28">
        <div className="container">
          <RegisterForm />
        </div>
        <AuthBackground />
      </section>
    </GuestLayout>
  );
};

export default SignupPage;
