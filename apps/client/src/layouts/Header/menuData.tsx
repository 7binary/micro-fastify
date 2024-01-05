export type Menu = {
  title: string;
  path?: string;
  newTab?: boolean;
  submenu?: Menu[];
};

export const menuData: Menu[] = [
  { title: 'Home', path: '/' },
  { title: 'About', path: '/about' },
  { title: 'Blog', path: '/blog' },
  { title: 'Support', path: '/contact' },
  {
    title: 'Pages', submenu: [
      { title: 'About Page', path: '/about' },
      { title: 'Contact Page', path: '/contact' },
      { title: 'Blog Grid Page', path: '/blog' },
      { title: 'Sign In Page', path: '/signin' },
      { title: 'Sign Up Page', path: '/signup' },
    ],
  },
];
