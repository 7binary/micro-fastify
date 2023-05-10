import Link from 'next/link';

import { User } from '@/types';
import { OutlinedButton } from '@/ui/buttons/OutlinedButton';

interface Props {
  user: User;
}

export const DashboardPanel = ({ user }: Props) => {
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
