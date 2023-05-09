import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect } from 'react';

import { useActions } from '@/store';
import { authHttp, Http } from '@/network';
import { Loader } from '@/ui/Loader';
import { LoggedLayout } from '@/layouts/LoggedLayout';

const SignOutPage = () => {
  const { resetAuth } = useActions();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      resetAuth();
      authHttp.logout();
      Http.setToken(null);
      router.replace('/');
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Sign out | MicroFastify</title>
      </Head>
      <LoggedLayout>
        <div className="flex justify-center items-center py-10">
          <Loader />
        </div>
      </LoggedLayout>
    </>
  );
};

export default SignOutPage;
