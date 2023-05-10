import Head from 'next/head';
import { NextPage } from 'next';

import { DashboardPanel } from '@/features/profile/DashboardPanel';
import { LoggedLayout } from '@/layouts/LoggedLayout';
import { authHttp, authIngressHttp } from '@/network';
import { User } from '@/types';

interface Props {
  user: User | null;
}

const DashboardPage: NextPage<Props> = ({ user }) => {
  return (
    <>
      <Head>
        <title>Dashboard | MicroFastify</title>
      </Head>
      <LoggedLayout>
        {user && <DashboardPanel user={user} />}
      </LoggedLayout>
    </>
  );
};

DashboardPage.getInitialProps = async ({ req }) => {
  let user: User | null;

  if (typeof window === 'undefined') {
    user = await authIngressHttp.loadUser({ headers: req?.headers, withCredentials: true });
  } else {
    user = await authHttp.loadUser();
  }

  return { user };
};

export default DashboardPage;
