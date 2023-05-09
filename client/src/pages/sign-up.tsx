import Head from 'next/head';
import { NextPage } from 'next';

import { RegisterForm } from '@/features/auth/RegisterForm';
import { GuestLayout } from '@/layouts/GuestLayout';

const SignUpPage: NextPage<{}> = () => {
  return (
    <>
      <Head>
        <title>Sign up | MicroFastify</title>
      </Head>
      <GuestLayout title="Sign up right now!">
        <RegisterForm />
      </GuestLayout>
    </>
  );
};

export default SignUpPage;
