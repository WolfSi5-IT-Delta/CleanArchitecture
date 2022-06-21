import React, {useState, Fragment} from 'react';
import {ArrowCircleLeftIcon, ArrowCircleRightIcon} from '@heroicons/react/outline';
import { Dialog, Transition } from '@headlessui/react';
import {XIcon} from '@heroicons/react/outline';
import {useForm} from '@inertiajs/inertia-react';
import Layout from '../Layout.jsx';
import Course from './Course.jsx';
import Navbar from '../../Components/Navbar.jsx';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function RadioQuestion({question, setValues, values, done}) {
  const {answers} = question;
  const answerObject = values[question.id];
  const name = `${question.id}`;

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    setValues(values => ({
      ...values,
      [key]: {
        ...values[key],
        answer: value,
      },
    }));
  };

  return (
    <>
      <h3 className="text-xl font-bold leading-tight text-gray-900">{question.name}</h3>
      <fieldset className="space-y-5">
        <legend className="sr-only">{question.name}</legend>
        {answers.map((answer, idx) => {
          return (
            <label key={idx} className="flex flex-col cursor-pointer focus:outline-none">
              <div className="flex items-center text-sm">
                <input type="radio" name={name} value={answer.id} id={name}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  onChange={handleChange}
                  required
                  checked={(answerObject?.answer == answer.id) ? 'checked' : ''}
                  disabled={done}
                />
                {/*// <!-- Checked: "text-indigo-900", Not Checked: "text-gray-900" -->*/}
                <span className="ml-3 font-medium">{answer.name}</span>
              </div>
            </label>
          );
        })}
      </fieldset>
    </>
  );
}

function CheckBoxQuestion({question, setValues, values, done}) {
  const {answers} = question;
  const answerObject = values[question.id];
  const name = `${question.id}`;

  const handleChange = (e) => {
    const key = e.target.name;
    const value = parseInt(e.target.value);
    let arr = answerObject?.answer || [];
    if (e.target.checked) {
      arr.push(value);
    } else {
      arr = arr.filter(e => e !== value);
    }
    setValues(values => ({
      ...values,
      [key]: {
        ...values[key],
        answer: arr,
      },
    }));
  };

  return (
    <>
      <h3 className="text-xl font-bold leading-tight text-gray-900">{question.name}</h3>
      <fieldset className="space-y-5">
        <legend className="sr-only">{question.name}</legend>
        {answers.map((answer, idx) => {
          const checked = answerObject?.answer?.includes(answer.id) ? 'checked' : '';
          return (
            <div className="relative flex items-start" key={idx}>
              <div className="flex items-center h-5">
                <input
                  id={name + '-' + answer.id}
                  name={name}
                  value={answer.id}
                  type="checkbox"
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  onChange={handleChange}
                  checked={checked}
                  disabled={done}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={name + '-' + answer.id} className="font-medium text-gray-700">
                  {answer.name}
                </label>
                {/*<p id="comments-description" className="text-gray-500">*/}
                {/*  Get notified when someones posts a comment on a posting.*/}
                {/*</p>*/}
              </div>
            </div>
          );
        })}
      </fieldset>
    </>
  );
}

function TextQuestion({question, setValues, values, done}) {
  const id = `q${question.id}`;

  const answer = values[question.id];

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    setValues(values => ({
      ...values,
      [key]: {
        ...values[key],
        answer: value,
      },
    }));
  };

  return (
    <>
      <h3 className="text-xl font-bold leading-tight text-gray-900">{question.name}</h3>
      <legend className="sr-only">{question.name}</legend>
      <textarea
        key={question.id}
        rows="4"
        id={id}
        name={question.id}
        onChange={handleChange}
        value={answer?.answer}
        className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md my-3"
        required
        disabled={answer?.done || done}
      />

      <div className="mt-1 max-w-2xl text-sm">
        {(answer?.done) ? <div className="text-green-600">Комментарий преподавателя: <b>OK</b></div> :
          (answer?.comment) ?
            <div className="text-red-600">Комментарий преподавателя: <b>{answer?.comment}</b></div> : ""
        }
      </div>


    </>
  );
}

const Lesson = ({course,course_id, lesson, answers, status, statuses,course_completed: isCourseCompleted,...props}) => {
  const {data, setData, post, errors, clearErrors} = useForm(answers);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let lessons = course.lessons;
  lessons = Object.values(lessons);

  function handleBack() {
    window.history.back();
  }

  function handleSubmit(e) {
    e.preventDefault();
    clearErrors();
    post(route('check-lesson', [course_id, lesson.id]));
  }

  let color = '';
  switch (status) {
    case 'done':
      color = 'text-green-600';
      break;
    case 'fail':
      color = 'text-red-600';
      break;
    case 'pending':
      color = 'text-yellow-600';
      break;
    case 'blocked':
      color = 'text-gray-600';
      break;
    default:
      break;
  }
  
  

  return (
    <div className="overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 mt-4 sm:px-6 lg:px-8">

        <div className="mt-8 lg:mt-0 flex flex-col md:flex-row">

        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden " onClose={setSidebarOpen}>
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

        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex-1 flex flex-col min-h-0 border-r-2 border-indigo-200 pl-4">
              <div className="flex-1 flex flex-col pt-5 px-2 pb-4 overflow-y-auto">
                <Navbar lessons={lessons} course={course} 
                        statuses={statuses} isCourseCompleted={isCourseCompleted} 
                        lessonId={lesson.id}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden sm:pl-3 sm:pt-3 pb-8">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-full inline-flex items-center justify-center border-indigo-500 border-b-2 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-indigo-100"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              &nbsp;Show Lessons
            </button>
          </div>
        
          <div className="text-base max-w-prose mx-auto lg:max-w-none px-8">
            <header>
              <h1 className="text-3xl leading-tight text-gray-900">{lesson.name}</h1>
              <div className={classNames('my-2 text-lg font-bold leading-tight', color)}>
                {status}
              </div>
            </header>
            <main>
              <p className="text-gray-500">
                {lesson.detail_text}
              </p>
            </main>

            <div className="my-14">
              <h2 className="text-2xl font-bold leading-tight text-gray-900">Check questions</h2>

              <form onSubmit={handleSubmit}>
                {lesson.questions.map((item, idx) => {
                  let component;
                  switch (item.type) {
                    case 'radio':
                      component = <RadioQuestion question={item} setValues={setData} values={data} done={status === 'done'}/>;
                      break;
                    case 'checkbox':
                      component = <CheckBoxQuestion question={item} setValues={setData} values={data} done={status === 'done'}/>;
                      break;
                    case 'text':
                      component = <TextQuestion question={item} setValues={setData} values={data} done={status === 'done'}/>;
                      break;
                    default:
                      break;
                  }
                  return (
                    <div className="my-3" key={idx}>
                      {component}
                    </div>
                  );
                })}

                <div className="mt-5 flex">
                  <button type="button" className="mr-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm
                    font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={handleBack}
                  >
                    <ArrowCircleLeftIcon className="h-6 w-6"/> &nbsp;
                    Back
                  </button>
                  <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm
                    font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {status === 'done' ? 'Next' : 'Check'} &nbsp;
                    <ArrowCircleRightIcon className="h-6 w-6"/>
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

Lesson.layout = (page) => (
  <Layout>
    <Course
      children={page}
      course={page.props.course}
      lessonId={page.props.lesson.id}
      statuses={page.props.statuses}
      course_completed={page.props.course_completed}
    />
  </Layout>
);

export default Lesson;
