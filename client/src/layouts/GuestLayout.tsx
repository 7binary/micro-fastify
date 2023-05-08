import { PropsWithChildren } from 'react';

interface Props {
  title: string;
}

export const GuestLayout = ({ children, title }: PropsWithChildren<Props>) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between gradient-form bg-neutral-200 dark:bg-neutral-700">
      <div className="container h-full p-10">
        <div
          className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="w-full">
            <div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
              <div className="g-0 lg:flex lg:flex-wrap">
                <div className="px-4 md:px-0 lg:w-6/12">
                  <div className="mx-auto max-w-md px-10">
                    <div className="text-center">
                      <img
                        className="mx-auto w-48"
                        src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                        alt="logo" />
                      <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                        {title}
                      </h4>
                    </div>
                  </div>
                  <div className="mx-auto max-w-md px-10">
                    {children}
                  </div>
                </div>
                <div className="flex bg-gradient-to-r from-orange-500 via-red-600 to-fuchsia-600 items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none">
                  <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                    <h4 className="mb-6 text-xl font-semibold">
                      We are more than just a company
                    </h4>
                    <p className="text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipisicing
                      elit, sed do eiusmod tempor incididunt ut labore et
                      dolore magna aliqua. Ut enim ad minim veniam, quis
                      nostrud exercitation ullamco laboris nisi ut aliquip ex
                      ea commodo consequat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
