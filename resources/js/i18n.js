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
          date: 'Date',
        },
        team: {
          createTeam: 'Create team',
          editTeam: 'Edit team',
          addTeam: 'Add team',
          teams: 'Teams',
        },
        common: {
          name: 'Name',
          description: 'Description',
          status: 'Status',
          active: 'Active',
          image: 'Image',
          email: 'Email',
          phone: 'Phone',
          settings: 'Settings',
          users: 'Users',
          addUser: 'Add user',
          started: 'Started',
          finished: 'Finished',
          all: 'All',

          add: 'Add',
          save: 'Save',
          cancel: 'Cancel'
        },
        lc: {
          curriculum: 'Curriculum',
          curriculums: 'Curriculums',
          addCurriculum: 'Add curriculum',
          createCurriculum: 'Create curriculum',
          editCurriculum: 'Edit curriculum',
          curriculumTitle: 'Curriculum name',
          curriculumDescription: 'Curriculum description',
          curriculumAvailableFor: 'Curriculum available for',
          listOfCurriculums: 'List of curriculums',
          sorting: 'Sorting',

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
          searchByCourses: 'Search by courses',

          lesson: 'Lesson',
          lessons: 'Lessons',
          selectLesson: 'Select lesson',
          addLesson: 'Add lesson',
          createLesson: 'Create lesson',
          editLesson: 'Edit lesson',
          listOfQuestions: 'List of questions',
          listOfLessons: 'List of lessons',
          detailedText: 'Detailed text',

          studentsAnswers: 'Student\' answers',
          student: 'Student',
          selectStudent: 'Select student',

          learningCenter: 'Learning center',
          searchByPrograms: 'Search by programs',
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
          date: 'Дата',
        },
        team: {
          createTeam: 'Создать команду',
          editTeam: 'Редактировать команду',
          addTeam: 'Добавить команду',
          teams: 'Команды',
        },
        common: {
          name: 'Название',
          description: 'Описание',
          status: 'Статус',
          active: 'Включен',
          image: 'Изображение',
          settings: 'Параметры',
          users: 'Пользователи',
          addUser: 'Добавить пользователя',
          email: 'Почта',
          phone: 'Телефон',
          started: 'Начатые',
          finished: 'Пройденные',
          all: 'Все',

          add: 'Добавить',
          save: 'Сохранить',
          cancel: 'Отмена'
        },
        lc: {
          curriculum: 'Программа обучения',
          curriculums: 'Программы обучения',
          addCurriculum: 'Добавить программу обучения',
          createCurriculum: 'Создать программу',
          editCurriculum: 'Изменить программу',
          curriculumTitle: 'Название программы',
          curriculumDescription: 'Описание программы',
          curriculumAvailableFor: 'Программа доступна для',
          listOfCurriculums: 'Список программ',
          sorting: 'Сортировка',
          listOfCourses:'Список курсов',
          course: 'Курс',
          courses: 'Курсы',
          selectCourse: 'Выберите курс',
          addCourse: 'Добавить курс',
          createCourse: 'Создать курс',
          editCourse: 'Редактирование курса',
          group: 'Группа',
          courseImage: 'Изображение курса',
          timeBetweenAttempts: 'Время между попытками',
          availableFor: 'Доступен для',
          searchByCourses: 'Поиск по курсам',

          lesson: 'Урок',
          lessons: 'Уроки',
          selectLesson: 'Выберите урок',
          addLesson: 'Добавить урок',
          createLesson: 'Создать урок',
          editLesson: 'Редактирование урока',
          listOfQuestions: 'Список вопросов',
          listOfLessons: 'Список уроков',
          detailedText: 'Детальный текст',

          studentsAnswers: 'Ответы учеников',
          student: 'Ученик',
          selectStudent: 'Выберите ученика',

          learningCenter: 'Учебный центр',
          searchByPrograms: 'Поиск по программам',
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
