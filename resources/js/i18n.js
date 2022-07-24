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
        team: {
          createTeam: 'Create team',
          editTeam: 'Edit team',
        },
        common: {
          name: 'Name',
          description: 'Description',
          status: 'Status',
          image: 'Image',
          email: 'Email',
          phone: 'Phone',
          settings: 'Settings',
          users: 'Users',
          addUser: 'Add user',

          add: 'Add',
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
          createCourse: 'Create course',
          editCourse: 'Edit course',
          group: 'Group',
          courseImage: 'Course image',
          timeBetweenAttempts: 'Time between attempts',
          availableFor: 'Available for',

          lessons: 'Lessons',
          addLesson: 'Add lesson',
          createLesson: 'Create lesson',
          editLesson: 'Edit lesson',
          listOfQuestions: 'List of questions',
          listOfLessons: 'List of lessons',
          detailedText: 'Detailed text',
        },
        users: {
          createUser: 'Create user',
          editUser: 'Edit user',
          lastName: 'Last name',
          password: 'Password',
          repeatPassword: 'Repeat password',
          userPhoto: 'User photo',
          administrator: 'Administrator',
          accesses: 'Accesses',
          passwordError: 'Password don`t match',
        },
        departments: {
          title: 'Departments',
          addDepartment: 'Add department',
          createDepartment: 'Create department',
          editDepartment: 'Edit department',
          head: 'Head',
          parent: 'Parent',
          highLevel: 'This is high level department',
        }
      },
      ru: {
        groups: {
          title: 'Группы пользователей',
          add: 'Добавить группу',
          create: 'Создать группу',
          edit: 'Изменить группу'
        },
        table: {
          name: 'Наименование',
          description: 'Описание',
          status: 'Статус',
          courses: 'Курсы',
          actions: 'Действия',
        },
        team: {
          createTeam: 'Создать команду',
          editTeam: 'Редактировать команду',
        },
        common: {
          name: 'Название',
          description: 'Описание',
          status: 'Статус',
          image: 'Изображение',
          settings: 'Параметры',
          users: 'Пользователи',
          addUser: 'Добавить пользователя',
          email: 'Почта',
          phone: 'Телефон',

          add: 'Добавить',
          save: 'Сохранить',
          cancel: 'Отмена'
        },
        lc: {
          curriculum: 'Программа обучения',
          curriculums: 'Программы обучения',
          addCurriculum: 'Добавить программу обучения',

          course: 'Курс',
          courses: 'Курсы',
          selectCourse: 'Выбрать курс...',
          addCourse: 'Добавить курс',
          createCourse: 'Создать курс',
          editCourse: 'Редактирование курса',
          group: 'Группа',
          courseImage: 'Изображение курса',
          timeBetweenAttempts: 'Время между попытками',
          availableFor: 'Доступен для',

          lessons: 'Уроки',
          addLesson: 'Добавить урок',
          createLesson: 'Создать урок',
          editLesson: 'Редактирование урока',
          listOfQuestions: 'Список вопросов',
          listOfLessons: 'Список уроков',
          detailedText: 'Детальный текст',
        },
        users: {
          createUser: 'Создать пользователя',
          editUser: 'Редактировать пользователя',
          lastName: 'Фамилия',
          password: 'Пароль',
          repeatPassword: 'Повторите пароль',
          userPhoto: 'Фото пользователя',
          administrator: 'Администратор',
          accesses: 'Доступы',
          passwordError: 'Пароли не совпадают',
        },
        departments: {
          title: 'Департаменты',
          addDepartment: 'Добавить департамент',
          createDepartment: 'Создать департамент',
          editDepartment: 'Редактировать департамент',
          head: 'Глава',
          parent: 'Родительский департамент',
          highLevel: 'Это департамент верхнего уровня',
        }
      }
    }
  });

export default i18n;
