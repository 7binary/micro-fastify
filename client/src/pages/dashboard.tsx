import Head from 'next/head';

import { DashboardPanel } from '@/features/profile/DashboardPanel';
import { LoggedLayout } from '@/layouts/LoggedLayout';
import { selectLoggedUser, useSelector } from '@/store';

const DashboardPage = () => {
  const user = useSelector(selectLoggedUser);

  return (
    <>
      <Head>
        <title>Dashboard | MicroFastify</title>
      </Head>
      <LoggedLayout>
        <DashboardPanel user={user} />
      </LoggedLayout>
    </>
  );
};

export default DashboardPage;
