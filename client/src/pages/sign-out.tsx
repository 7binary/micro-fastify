import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { GuestLayout } from '@/layouts/GuestLayout';
import { useActions } from '@/store';
import { authHttp } from '@/network';
import { Loader } from '@/ui/Loader';

export default function SignOutPage() {
  const { resetAuth, setAppLoaded } = useActions();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await authHttp.logout();
      resetAuth();
      await router.replace('/');
      setAppLoaded();
    })();
  }, []);

  return (
    <GuestLayout title="Sign out">
      <div className="flex justify-center items-center py-10">
        <Loader />
      </div>
    </GuestLayout>
  );
}
