import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Providers } from '@/layouts/Providers';

const CustomApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
};

export default CustomApp;
