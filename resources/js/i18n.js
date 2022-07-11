import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        groups: {
          title: 'User`s groups',
          add: 'Add group',
          create: 'Create group',
          edit: 'Edit group'
        },
        table: {
          name: 'Name',
          description: 'Description',
          status: 'Status',
          courses: 'Courses',
          actions: 'Actions',
        },
        common: {
          name: 'Name',
          description: 'Description',
          status: 'Status',

          save: 'Save',
          cancel: 'Cancel'
        },
        lc: {
          curriculum: 'Curriculum',
          curriculums: 'Curriculums',
            addCurriculum: 'Add curriculum',

          course: 'Course',
          courses: 'Courses',
          selectCourse: 'Select Course',
          addCourse: 'Add Course',

          lessons: 'Lessons',
          addLesson: 'Add lesson',
        },
      },
      ru: {
        groups: {
          title: 'Группы пользователей',
          add: 'Добавить группу',
        },
        table: {
          name: 'Наименование',
          description: 'Описание',
          status: 'Статус',
          courses: 'Курсы',
          actions: 'Действия',
        },
        lc: {
          curriculum: 'Программа обучения',
          curriculums: 'Программы обучения',
          addCurriculum: 'Добавить программу обучения',

          course: 'Курс',
          courses: 'Курсы',
          selectCourse: 'Выбрать курс...',
          addCourse: 'Добавить курс',

          lessons: 'Уроки',
          addLesson: 'Добавить урок',
        },

      }
    }
  });

export default i18n;
