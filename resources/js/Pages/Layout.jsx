/* This example requires Tailwind CSS v2.0+ */
import React from 'react';
import Navigation from './Navigation.jsx';

const navigation = [
  { name: 'Учебный центр', href: route('learning'), current: true },
  { name: 'Admin', href: route('admin.index'), current: false },
];

const userNavigation = [
  { name: 'Профайл', href: '/profile' },
  { name: 'Настройки', href: '/admin' },
  { name: 'Выход', href: '/logout' },
];

export default function Layout(children) {
  const currentLocation = location.href;
  navigation.forEach((navItem) => {
    currentLocation.includes(navItem.href)
      ? navItem.current = true
      : navItem.current = false;
  });

  return (
    <Navigation navigation={navigation} userNavigation={userNavigation}>
      {typeof children.children === 'object'
        ? children.children
        : children
      }
    </Navigation>
  );
}
