import { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';

import { selectUser, useSelector } from '@/store';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { ScrollToTop } from '@/layouts/ScrollToTop';

const guestOnlyRoutes = ['/signup', '/signin'];

export const GuestLayout = ({ children }: PropsWithChildren<{}>) => {
  const router = useRouter();
  const user = useSelector(selectUser);

  if (user && guestOnlyRoutes.includes(router.asPath)) {
    router.replace('/dashboard');
  }

  return (
    <>
      <Header user={null} />
      <section className="pt-[120px] pb-[120px]">
        <div className="container">
          {children}
        </div>
      </section>
      <Footer />
      <ScrollToTop />
    </>
  )
};
