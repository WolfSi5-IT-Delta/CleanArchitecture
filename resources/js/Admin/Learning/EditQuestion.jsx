import React, {useContext, useEffect, useState} from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm, usePage } from '@inertiajs/inertia-react';
import { RadioGroup, Switch } from '@headlessui/react';
import { AdminContext } from '../reducer.jsx';
import Header from '../../Components/Header.jsx';

export default function EditQuestion({ question, lid }) {
  // const { state, dispatch } = useContext(AdminContext);
  const {errors} = usePage().props

  const { data, setData, post } = useForm({
    name: question?.name ?? '',
    hint: question?.hint ?? '',
    active: question?.active ?? '',
    type: question?.type ?? 'radio',
    point: question?.point ?? '',
  });

  const [showAnswersButton, setShowAnswersButton] = useState(question.type !== 'text');

  const handleTypeChange = (e) => {
    setData('type', e);
    setShowAnswersButton(e !== 'text');
  }

  return (
    <main>
      <div className="bg-white shadow overflow-hidden rounded-xl">
        <div className="border-t border-gray-200">
          <Header title={question?.id === undefined
          ? "Создание вопроса"
          : `Редактирование вопроса`}/>
          <ul>
            <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">Вопрос</span>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
              />
              {errors.name && <div className="text-sm font-medium text-red-500 text-red-600 col-end-3">{errors.name}</div>}
            </li>
            <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">Подсказка для учителя</span>
              <input
                type="text"
                value={data.hint}
                onChange={(e) => setData('hint', e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
              />
            </li>
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">Активность</span>
              <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 block">
                  <Switch
                    checked={Boolean(data.active)}
                    onChange={(e) => {
                      setData('active', Number(e));
                    }}
                    className={`
                    ${Boolean(data.active) ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    `}
                  >
                    <span className="sr-only">Question state</span>
                    <span
                      className={`
                      ${Boolean(data.active) ? 'translate-x-5' : 'translate-x-0'}
                        'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                        `}
                    >
                      <span
                        className={`
                        ${Boolean(data.active) ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'}
                        absolute inset-0 h-full w-full flex items-center justify-center transition-opacity
                        `}
                        aria-hidden="true"
                      >
                        <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
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
                        className={`${Boolean(data.active) ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'} absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                        aria-hidden="true"
                      >
                        <svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
                          <path
                            d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"/>
                        </svg>
                      </span>
                    </span>
                  </Switch>
                </span>
            </li>
            <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">Тип вопроса</span>
              <RadioGroup
                value={data.type}
                onChange={handleTypeChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
              >
                <div className="relative bg-white rounded-md -space-y-px">
                  {['text', 'radio', 'checkbox'].map((questionType, Idx) => (
                    <RadioGroup.Option
                      key={questionType}
                      value={questionType}
                      className={({ checked }) =>
                        (`${Idx === 0 ? 'rounded-tl-md rounded-tr-md' : ''}
                            ${Idx === 2 ? 'rounded-bl-md rounded-br-md' : ''},
                            ${checked ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200'}
                            relative border p-4 flex flex-col cursor-pointer md:pl-4 md:pr-6 md:grid md:grid-cols-3 focus:outline-none
                            `)
                      }
                    >
                      {({ active, checked }) => (
                        <div className="flex items-center text-sm">
                            <span
                              className={`
                                  ${checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300'}
                                  ${active ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}
                                  h-4 w-4 rounded-full border flex items-center justify-center
                              `}
                              aria-hidden="true"
                            >
                              <span className="rounded-full bg-white w-1.5 h-1.5"/>
                            </span>
                          <RadioGroup.Label
                            as="span"
                            className={`${checked ? 'text-indigo-900' : 'text-gray-900'} ml-3 font-medium`}
                          >
                            {questionType}
                          </RadioGroup.Label>
                        </div>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </li>
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">Баллы за правильный ответ</span>
              <input
                type="number"
                value={data.point}
                min={0}
                max={100}
                step={10}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-md sm:text-sm border-gray-300"
                onChange={(e) => setData('point', e.target.value)}
              />
            </li>
          </ul>
        </div>
      <div className="mt-8 sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-3 sm:grid-flow-row-dense pb-4 px-4">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-3 sm:text-sm"
          onClick={() => {
            if (question?.id) {
              post(route('admin.question.edit', [lid, question?.id]), { data });
            } else {
              post(route('admin.question.create', lid));
            }
          }}
        >
          Сохранить
        </button>
        {question?.id && showAnswersButton &&
          <button
            type="button"
            className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
            onClick={() => Inertia.get(route('admin.answers', [lid, question?.id]))}
          >
            Показать ответы
          </button>
        }
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          onClick={() => {
            Inertia.get(route('admin.questions', [lid]));
          }}
        >
          Отмена
        </button>
      </div>
      </div>
    </main>
  );
};
