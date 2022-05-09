/* This example requires Tailwind CSS v2.0+ */
import React from 'react';
import Navigation from './Navigation.jsx';

// const user = {
//   name: 'Tom Cook',
//   email: 'tom@example.com',
//   imageUrl:
//     'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
// };

// const userNavigation = [
//   { name: 'Профайл', href: '#' },
//   { name: 'Настройки', href: '#' },
//   { name: 'Выход', href: '/logout' },
// ];

export default function Layout(children) {
  return (
    <Navigation>
      {children}
    </Navigation>
  );
}
