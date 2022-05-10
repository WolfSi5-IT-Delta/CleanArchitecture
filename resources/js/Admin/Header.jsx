import React, { Fragment, useReducer, useState, useEffect } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  AcademicCapIcon,
  BellIcon, BookOpenIcon,
  CalendarIcon, ClipboardListIcon,
  HomeIcon,
  MenuAlt2Icon, QuestionMarkCircleIcon,
  XIcon,
  UsersIcon,
  TemplateIcon,
  LibraryIcon,
  BriefcaseIcon
} from '@heroicons/react/outline';
import { SearchIcon } from '@heroicons/react/solid';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { AdminContext, initialState, adminReducer, resetState } from './reducer.jsx';
import Accordion from '../Components/Accordion';

export default function Header({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState, resetState);
  // const dispatch = (...actions) => {
  //   actions.forEach((action) => disp(action));
  // };

  const { auth, userMenu } = usePage().props;
  const user = auth.user;

  /**
   * NOTE
   * I bind this useEffects to auth
   * because I want to run it on every page change
   * and auth receive updates on every page change
   */
  useEffect(() => {
    const curLoc = window.location.href;
    const regURLParse = /lessons(\/)?(?<lesson>\d*)?(\/questions)?(\/)?(?<question>\d*)?/g;
    const parsedURL = regURLParse.exec(curLoc);
    const { groups: { course, lesson, question } } = parsedURL ?? {
      groups: {
        lesson: undefined,
        question: undefined,
      }};

    if (lesson !== undefined) { dispatch({ type: 'CHOSE_LESSON', payload: { id: lesson } }); }
    if (question !== undefined) { dispatch({ type: 'CHOSE_QUESTION', payload: { id: question } }); }
  }, [auth]);

  const leftMenu = [
    {
      name: 'Learning Center',
      items: [
        {
          name: 'Программы обучения',
          icon: null,
          href: route('admin.curriculums'),
          current: true,
          // action: () => {
          //   dispatch({
          //     type: 'CHANGE_HEADER',
          //     payload: 'Программы обучения'
          //   })
          // },
        },
        {
          name: 'Курсы',
          icon: null,
          href: route('admin.courses'),
          current: true,
          active: true,
          // action: () => {
          //   dispatch({
          //     type: 'CHANGE_HEADER',
          //     payload: 'Курсы'
          //   })
          // },
        },
        {
          name: 'Уроки',
          icon: null,
          href: route('admin.lessons'),
          current: true,
          // action: () => {
          //   dispatch({
          //     type: 'CHANGE_HEADER',
          //     payload: 'Уроки'
          //   })
          // },
        },
        {
          name: 'Ответы учеников',
          icon: null,
          href: route('admin.teacher.lessons'),
          current: true,
          // action: () => {
          //   dispatch({
          //     type: 'CHANGE_HEADER',
          //     payload: 'Ответы учеников'
          //   })
          // },
        },
      ],
    },
    {
      name: 'Org Board',
      items: [
        {
          name: 'Департаменты',
          // icon:  LibraryIcon,
          href: route('admin.departments'),
          current: true,
          // action: () => {
          //   dispatch({
          //     type: 'CHANGE_HEADER',
          //     payload: 'Департаменты'
          //   })
          // },
        },
      ],
    },
    {
      name: 'Команды',
      icon:  LibraryIcon,
      href: route('admin.teams'),
      current: true,
      // action: () => {
      //   dispatch({
      //     type: 'CHANGE_HEADER',
      //     payload: 'Команды'
      //   })
      // },
    },
    {
      name: 'Пользователи',
      icon: UsersIcon,
      href: route('admin.users'),
      current: true,
      // action: () => {
      //   dispatch({
      //     type: 'CHANGE_HEADER',
      //     payload: 'Пользователи'
      //   })
      // },
    },

  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentLocation = location.href;

  const setCurrentNavItem = (navArr) => {
    navArr.forEach((navItem) => {
      if (Array.isArray(navItem.items)) { setCurrentNavItem(navItem.items); } else {
        navItem.href === currentLocation
          ? navItem.current = true
          : navItem.current = false;
      }
    });
  };
  setCurrentNavItem(leftMenu);

  const NavItems = ({ items }) => {
    return (
      items.map((navItem) => {
        if (Array.isArray(navItem.items)) {
          return (
            <Accordion title={navItem.name} key={navItem.name}>
              <NavItems items={navItem.items}/>
            </Accordion>
          );
        }
        else {
          return (
            <InertiaLink
              key={navItem.name}
              href={navItem.href}
              className={
                `${navItem.current
                  ? 'bg-indigo-800 text-white'
                  : navItem.active === undefined || navItem.active
                    ? 'text-indigo-100 hover:bg-indigo-600'
                    : 'text-gray-500 cursor-default'
                }
                        group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
              onClick={navItem.action}
            >

              {navItem.icon && <navItem.icon className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300" aria-hidden="true"/>}
              {navItem.name}
            </InertiaLink>
          );
        }
      })
    );
  };

  return (
      <div className="h-screen flex overflow-hidden bg-gray-100">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75"/>
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-indigo-700">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 flex items-center px-4">
                  <InertiaLink href="/">
                    <img
                      className="h-8 w-auto"
                      src="/img/logo_white.svg"
                      alt="Company Policy"
                    />
                  </InertiaLink>
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    <NavItems items={leftMenu} />
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden bg-indigo-700 md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <InertiaLink href="/">
                  <img
                    className="h-8 w-auto"
                    src="/img/logo_white.svg"
                    alt="Company Policy"
                  />
                </InertiaLink>
              </div>
              <div className="mt-5 flex-1 flex flex-col">
                <nav className="flex-1 px-2 space-y-1">
                  <NavItems items={leftMenu} />
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* header */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden h-full">
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              {/*<MenuAlt2Icon className="h-6 w-6" aria-hidden="true"/>*/}
              <img
                className="block lg:hidden h-8 w-auto"
                src="/img/logo_mobile.svg"
                alt="Company Policy"
              />
            </button>
            <div className="flex-1 px-4 flex justify-between">
              <header className="flex-1 flex w-full">
                {/*<h1*/}
                {/*  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-2 text-xl md:text-3xl font-bold leading-tight text-gray-900 text-center flex items-center">{state.pageHeader}</h1>*/}
              </header>
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true"/>
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button
                      className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-50">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatar ? user.avatar : '/img/no-user-photo.jpg'}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userMenu.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <InertiaLink
                              href={item.href}
                              className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                            >
                              {item.name}
                            </InertiaLink>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <div className="flex flex-col relative h-full overflow-y-auto = p-4 sm:p-6 md:p-8 focus:outline-none">
            {children}
          </div>
        </div>
      </div>
  );
}
