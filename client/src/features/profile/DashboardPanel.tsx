import Link from 'next/link';

import { Button } from '@/ui/buttons/Button';
import { selectLoggedUser, useSelector } from '@/store';

export const DashboardPanel = () => {
  const user = useSelector(selectLoggedUser);

  return (
    <div className="mb-10">
      <pre className="block text-xs">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
};
