import React, { Fragment, useState, useLayoutEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink } from '@inertiajs/inertia-react';
import {
  XIcon,
  ArrowCircleRightIcon,
} from '@heroicons/react/outline';
import Layout from '../Layout.jsx';
import List from '../../Components/List.jsx';
import {Notification} from '../../Components/Notification.jsx';
import Navbar from '../../Components/Navbar.jsx';

const Course = ({
  course, statuses, course_completed: isCourseCompleted, ...props
}) => {
  let lessons = course.lessons;
  lessons = Object.values(lessons);
  const isCoursePage = route().current() === 'course';
  const isSuccessPage = route().current() === 'success';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [checkStatus, setCheckStatus] = useState(null);

  // useLayoutEffect(() => {
  //   return Inertia.on('success', (e) => {
  //     const { lessonCheckMessage, nextLessonId } = e.detail.page.props.flash;
  //
  //     if (lessonCheckMessage !== null) {
  //       setCheckStatus(lessonCheckMessage);
  //       setShowNotification(true);
  //       setTimeout(() => setShowNotification(false), 3000);
  //     }
  //
  //     if (nextLessonId !== null) {
  //       Inertia.get(route('lesson', [course.id, nextLessonId]));
  //     }
  //   });
  // }, []);

  // useLayoutEffect(() => {
  //   return Inertia.on('navigate', () => {
  //     let isPageWasShown = Inertia.restore('isPageWasShown');
  //     if (isPageWasShown === undefined) { isPageWasShown = false; }
  //
  //     if (isPageWasShown === false) {
  //       Inertia.remember(true, 'isPageWasShown');
  //     } else {
  //       Inertia.remember(false, 'isPageWasShown');
  //       Inertia.reload();
  //     }
  //   });
  // }, []);

  const CourseScreen = () => (
    <div className="overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8 lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="relative lg:row-start-1 lg:col-start-2">
            <div className="relative text-base mx-auto max-w-prose lg:max-w-none">
              <figure>
                <div className="aspect-w-12 aspect-h-7 lg:aspect-w-1 lg:aspect-h-1">
                  <img
                    className="rounded-lg shadow-lg object-cover object-center"
                    src={course.image ?? '/img/noimage.jpg'}
                    style={{imageRendering: '-webkit-optimize-contrast', height: 'auto'}}
                    alt={course.name}
                  />
                </div>
              </figure>
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="text-base max-w-prose mx-auto lg:max-w-none">
              <header>
                <h1 className="text-3xl font-bold leading-tight text-gray-900">{course.name}</h1>
              </header>
              <main>
                <p className="text-lg text-gray-500">
                  {course.description}
                </p>
                <List listItems={lessons} type="lessons" />
              </main>
              {lessons.length > 0
                && <InertiaLink href={route('lesson', [course.id, lessons[0].id])}>
                  <button type="button" className="my-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm
                    font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Run &nbsp;
                    <ArrowCircleRightIcon className="h-6 w-6" />
                  </button>
                </InertiaLink>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SuccessScreen = () => (
    <div className="overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8 lg:grid lg:grid-cols-2 lg:gap-8">
          Congratulations!
        </div>
      </div>
    </div>
  );


  const getCurrentContent = () => {
    if (isCoursePage) { return <CourseScreen />; }
    if (isSuccessPage) { return <SuccessScreen />; }
    return props.children;
  };

  const notificationPopup = () => {
    switch (checkStatus) {
      case 'done': return <Notification position="bottom" type="success" header="Success" message="Your answers are right" />;
      case 'pending': return <Notification position="bottom" type="info" header="Pending" message="Your answers are pending to check" />;
      case 'fail': return <Notification position="bottom" type="fail" header="Error" message="Your answers are not right" />;
      default: return false;
    }
  };
  return (
    <div className="flex flex-col w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-4">
      <div className="flex overflow-hidden bg-gray-100">
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
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
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
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
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
                      <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 px-2 pb-4 overflow-y-auto">
                  <Navbar lessons={lessons} course={course}
                          statuses={statuses} isCourseCompleted={isCourseCompleted}
                          lessonId={props.lessonId}
                  />
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex-1 flex flex-col min-h-0 border-r-2 border-indigo-200 pl-4">
              <div className="flex-1 flex flex-col pt-5 px-2 pb-4 overflow-y-auto">
                <Navbar lessons={lessons} course={course}
                        statuses={statuses} isCourseCompleted={isCourseCompleted}
                        lessonId={props.lessonId}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <div className="md:hidden sm:pl-3 sm:pt-3">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-full inline-flex items-center justify-center border-indigo-500 border-b-2 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-indigo-100"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              &nbsp;Show Lessons
            </button>
          </div>
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Replace with your content */}
                {getCurrentContent()}
                {showNotification
                  && notificationPopup()
                }
                {/* /End replace */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

Course.layout = (page) => (
  <Layout children={page} />
);

export default Course;
