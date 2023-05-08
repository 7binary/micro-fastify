import Head from 'next/head';
import { LoginForm } from '@/features/auth/LoginForm';
import { GuestLayout } from '@/layouts/GuestLayout';

const HomePage = () => {
  return (
    <>
      <Head>
        <title>MicroFastify</title>
      </Head>
      <GuestLayout title="Sign in to your account">
        <LoginForm />
      </GuestLayout>
    </>
  );
};

export default HomePage;
