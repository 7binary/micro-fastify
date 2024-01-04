import Image from 'next/image';

export const Logo = () => (
  <div className="flex">
    <div className="w-9">
      <Image
        src="/images/logo/logo-2.svg"
        alt="logo"
        width={34}
        height={27}
        className="w-full dark:hidden"
      />
      <Image
        src="/images/logo/logo.svg"
        alt="logo"
        width={34}
        height={27}
        className="hidden w-full dark:block"
      />
    </div>
    <div className="px-2 text-2xl text-blue-800 dark:hidden">MicroFastify</div>
    <div className="px-2 text-2xl text-white hidden dark:block">MicroFastify</div>
  </div>
);
