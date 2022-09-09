import React from "react";

import { InertiaLink } from "@inertiajs/inertia-react";
import {
  ArrowCircleRightIcon,
  DotsCircleHorizontalIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  BanIcon,
  BadgeCheckIcon,
} from "@heroicons/react/outline";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({
  lessons,
  course,
  statuses,
  isCourseCompleted,
  lessonId,
  template,
}) {
  const isCoursePage = route().current() === "course";
  const isSuccessPage = route().current() === "success";

  const getStatusIndicator = (lesson) => {
    const data = statuses.find((item) => item.id === lesson.id);
    const status = data === undefined ? "undefined" : data.status;
    switch (status) {
      case "done":
        return {
          statusBg: "bg-green-500",
          statusIcon: (
            <CheckCircleIcon
              className="h-5 w-5 text-white"
              aria-hidden="true"
            />
          ),
        };
      case "pending":
        return {
          statusBg: "bg-yellow-500",
          statusIcon: (
            <ClockIcon className="h-5 w-5 text-white" aria-hidden="true" />
          ),
        };
      case "fail":
        return {
          statusBg: "bg-red-500",
          statusIcon: (
            <ExclamationCircleIcon
              className="h-5 w-5 text-white"
              aria-hidden="true"
            />
          ),
        };
      case "blocked":
        return {
          statusBg: "bg-gray-500",
          statusIcon: (
            <BanIcon className="h-5 w-5 text-white" aria-hidden="true" />
          ),
        };
      default:
        return {
          statusBg: "bg-indigo-500",
          statusIcon: (
            <ArrowCircleRightIcon
              className="h-5 w-5 text-white"
              aria-hidden="true"
            />
          ),
        };
    }
  };

  const SuccessWithoutLink = () => (
    <div
      className={classNames(
        isSuccessPage ? "bg-gray-200" : "hover:bg-gray-100",
        "relative flex space-x-3 cursor-pointer"
      )}
    >
      <div>
        <span
          className={classNames(
            isCourseCompleted ? "bg-green-500" : "bg-gray-500",
            "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
          )}
        >
          <BadgeCheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
        </span>
      </div>
      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
        <p className="text-sm font-medium text-gray-800 hover:text-gray-900">
          SuccessScreen
        </p>
      </div>
    </div>
  );

  const SuccessWithLink = () => (
    <InertiaLink href={route("success", course.id)}>
      <SuccessWithoutLink />
    </InertiaLink>
  );

  const NavbarTemplate = () => (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        <li key="intro">

          <div className="relative pb-8">
            {course.lessons.length !== 0 && (
              <span
                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                aria-hidden="true"
              />
            )}

            <InertiaLink href={route("course", course.id)}>
              <div
                className={classNames(
                  isCoursePage ? "bg-gray-200" : "hover:bg-gray-100",
                  "relative flex space-x-3"
                )}
              >
                <div>
                  <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-green-500">
                    <DotsCircleHorizontalIcon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <p className="text-sm font-medium text-gray-800 hover:text-gray-900">
                    Course intro
                  </p>
                </div>
              </div>
            </InertiaLink>
          </div>
        </li>
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <div className="relative pb-8">
              <span
                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                aria-hidden="true"
              />

              <InertiaLink href={route("lesson", [course.id, lesson.id])}>
                <div
                  className={classNames(
                    lesson.id === lessonId
                      ? "bg-gray-200"
                      : "hover:bg-gray-100",
                    "relative flex space-x-3"
                  )}
                >
                  <div>
                    <span
                      className={classNames(
                        getStatusIndicator(lesson).statusBg,
                        "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                      )}
                    >
                      {getStatusIndicator(lesson).statusIcon}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800 hover:text-gray-900">
                        {lesson.name}
                      </p>
                    </div>
                  </div>
                </div>
              </InertiaLink>
            </div>
          </li>
        ))}
        {course.lessons.length !== 0 && (
          <li key="success">
            <div className="relative pb-8">
              {isCourseCompleted ? <SuccessWithLink /> : <SuccessWithoutLink />}
            </div>
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <>
      <NavbarTemplate />
    </>
  );
}
