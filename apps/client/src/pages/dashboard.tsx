import Head from 'next/head';

import { DashboardPanel } from '@/features/profile/DashboardPanel';
import { LoggedLayout } from '@/layouts/LoggedLayout';

const DashboardPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard | MicroFastify</title>
      </Head>
      <LoggedLayout>
        <DashboardPanel />
      </LoggedLayout>
    </>
  );
};

export default DashboardPage;
