import Link from 'next/link';

import { selectUser, useSelector } from '@/store';
import { OutlinedButton } from '@/ui/buttons/OutlinedButton';

export const DashboardPanel = () => {
  const user = useSelector(selectUser);

  return (
    <div className="mb-10">
      <pre className="block text-xs">
        {JSON.stringify(user, null, 2)}
      </pre>
      <div className="mt-10">
        <Link href="/sign-out">
          <OutlinedButton>Sign out</OutlinedButton>
        </Link>
      </div>
    </div>
  );
};
