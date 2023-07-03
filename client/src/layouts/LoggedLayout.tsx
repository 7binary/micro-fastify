import { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';

import { selectAppIsLoaded, selectUser, useSelector } from '@/store';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';

export const LoggedLayout = ({ children }: PropsWithChildren<{}>) => {
  const router = useRouter();
  const user = useSelector(selectUser);
  const appIsLoaded = useSelector(selectAppIsLoaded);

  if (!appIsLoaded) {
    return null;
  }

  if (!user) {
    router.replace('/');
    return null;
  }

  return (
    <>
      <Header user={user} />
      <section className="pt-[120px] pb-[120px]">
        <div className="container">
          {children}
        </div>
      </section>
      <Footer />
      <ScrollToTop />
    </>
  );
};
