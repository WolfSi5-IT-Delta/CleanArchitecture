import React, { useContext } from "react";
import { Inertia } from "@inertiajs/inertia";
import { useForm } from "@inertiajs/inertia-react";
import { Switch } from "@headlessui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import {useTranslation} from "react-i18next";
import Editor from "../../Components/Editor/Editor";

import Header from "../../Components/AdminPages/Header.jsx";
import Page, { ActionButton, Button, ButtonsRow, CancelButton, UserNameAndAvatar } from '../../Components/AdminPages/Page';
import { OptionsList, 
  OptionItem, 
  OptionItemName, 
  OptionItemInputField, 
  OptionItemErrorText, 
  OptionItemSwitchField,
  OptionItemTextAreaField,
  OptionItemAccessField
 } from '../../Components/AdminPages/OptionsList';

export default function TeacherLesson({ answer }) {
  const { t } = useTranslation(['common', 'lc']);

  const studentAnswers = Object.values(JSON.parse(answer.answers) ?? {});
  console.log(studentAnswers);

  const obj = {};

  studentAnswers.forEach((e) => {
    obj[e.question_id] = {
      question_id: e.question_id,
      question: e.question,
      answer: e.answer,
      type: e.type,
      hint: e.hint ?? "",
      comment: e.comment ?? "",
      done: e.done ?? 0,
    };
  });

  const { data, setData, post } = useForm(obj);

  const RowItem = ({label, text}) => (
    <div className="border-t border-gray-200 px-1 py-1 sm:p-0">
      <dl className="sm:divide-y sm:divide-gray-200">
        <div className="py-2 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">{label}</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {text}
          </dd>
        </div>
      </dl>
    </div>
  )

  return (
    <Page>
      <Header title={'Проверка урока'}/>

      <UserNameAndAvatar
          name={`${answer.user.name} ${answer.user.last_name}`}
          avatar={answer.user.avatar}
        />

      <RowItem label={'Урок'} text={answer.lesson.name} />

      <RowItem label={'Курс'} text={answer.course.name} />

      <RowItem label={'Попытка'} text={answer.course.name} />

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Попытка</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {answer.tries}
              </dd>
            </div>
          </dl>
        </div>

        {Object.values(data)
          .filter((e) => e.type == "text")
          .map((item) => {
            return (
              <ul
                key={item.question_id}
                role="list"
                className="border border-gray-200 rounded-md divide-y divide-gray-200 mx-3 mb-4"
              >

                <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="flex-1 flex items-center">
                    <QuestionMarkCircleIcon className="flex-shrink-0 h-5 w-5 text-gray-400"/>
                    <span className="ml-2 flex-1 w-0 truncate text">
                      <b>Question:&nbsp;</b>{item.question}
                    </span>
                  </div>
                </li>

                <li className="pl-3 pr-4 py-3 grid grid-col-1 text-sm">
                  <div className="flex-1 flex items-center pb-2">
                    <QuestionMarkCircleIcon className="flex-shrink-0 h-5 w-5 text-gray-400"/>
                    <span className="ml-2 flex-1 w-0 truncate text">
                      <b>Answer:&nbsp;</b>
                    </span>
                  </div>

                  <div className="flex-1 flex items-center">
                    <Editor 
                        blocks={item.answer}
                        holder={`ed${item.question_id}`}
                        readOnly={true}
                      />                      
                    </div>
                </li>

                {/* <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <br />
                    <span className="mr-2 text-sm font-medium text-gray-500">
                      Answer:&nbsp;
                    </span>

                    <Editor 
                      blocks={item.answer}
                      holder={`ed${item.question_id}`}
                      readOnly={true}
                    />
                    {item.answer}
                  </div>
                </li> */}

                <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <br />
                    <span className="mr-2 text-sm font-medium text-gray-500">
                      Hint:&nbsp;
                    </span>
                    {item.hint}
                  </div>
                </li>

                <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <span className="mr-4 text-sm font-medium text-gray-500">
                      Комментарий для ученика
                    </span>
                    <textarea
                      className="mr-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
                      value={item.comment}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          [item.question_id]: {
                            ...item,
                            comment: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <dl className="sm:divide-y sm:divide-gray-200">
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Зачет
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 block">
                            <Switch
                              checked={Boolean(item.done)}
                              onChange={(e) =>
                                setData((d) => ({
                                  ...d,
                                  [item.question_id]: {
                                    ...item,
                                    done: Number(e),
                                  },
                                }))
                              }
                              className={`
                                ${
                                  Boolean(item.done)
                                    ? "bg-indigo-600"
                                    : "bg-gray-200"
                                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                              `}
                            >
                              <span className="sr-only">Зачёт</span>
                              <span
                                className={`
                                  ${
                                    Boolean(data.done)
                                      ? "translate-x-5"
                                      : "translate-x-0"
                                  }
                                    'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                                    `}
                              >
                                <span
                                  className={`
                                      ${
                                        Boolean(item.done)
                                          ? "opacity-0 ease-out duration-100"
                                          : "opacity-100 ease-in duration-200"
                                      }
                                      absolute inset-0 h-full w-full flex items-center justify-center transition-opacity
                                  `}
                                  aria-hidden="true"
                                >
                                  <svg
                                    className="h-3 w-3 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 12 12"
                                  >
                                    <path
                                      d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </span>
                                <span
                                  className={`${
                                    Boolean(item.done)
                                      ? "opacity-100 ease-in duration-200"
                                      : "opacity-0 ease-out duration-100"
                                  } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                                  aria-hidden="true"
                                >
                                  <svg
                                    className="h-3 w-3 text-indigo-600"
                                    fill="currentColor"
                                    viewBox="0 0 12 12"
                                  >
                                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                  </svg>
                                </span>
                              </span>
                            </Switch>
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </li>
              </ul>
            );
          })}

      <ButtonsRow>
        <CancelButton className='sm:col-start-1' label={t('common:cancel')} onClick={() => Inertia.get(route("admin.teacher.lessons"))}/>
        <ActionButton className='sm:col-start-3' label={t('common:save')} onClick={(e) => post(route("admin.teacher.lesson", answer.id))}/>
      </ButtonsRow>
    </Page>
  );
}
