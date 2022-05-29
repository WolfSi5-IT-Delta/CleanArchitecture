import React, { useState, useEffect } from 'react';
import SectionTabs from '../../Components/SectionTabs.jsx';
import SearchPanel from '../../Components/SearchPanel.jsx';
import List from '../../Components/List.jsx';
import Filter from '../../Components/Filter.jsx';
export default function Courses({ courses, courseGroups, curriculums }) {

  const [searchString, setSearchString] = useState('');
  const [sort, setSort] = useState(0);
  const [tabs, setTabs] = useState([
    {
      name: 'Курсы',
      href: route('courses'),
      current: true,
      searchPlaceholder: 'Поиск по курсам'
    },
    {
      name: 'Программы обучения',
      href: route('programs'),
      current: false,
      searchPlaceholder: 'Поиск по программам'
    }
  ]);

  const filter = (value) =>{
    if(value === 'active'){
      setSort(1);
    } if(value === 'done'){
      setSort(100);
    } if(value === 'all'){
      setSort(0);
    }
  }

  const handleSearch = (value) => setSearchString(value);

  useEffect(() => {
    const newTabs = tabs.map((tab) => {
      tab.href.includes(route().current())
        ? tab.current = true
        : tab.current = false;
      return tab;
    });
    setTabs(newTabs);
  }, []);
  return (

    <div className="bg-white py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="space-y-5">
          <header className="space-y-5 sm:space-y-4 xl:max-w-none border-b-2 border-dashed border-gray-200">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Учебный центр</h2>

            <div className="px-2 pb-1 flex-1 flex flex-wrap sm:flex-nowrap items-center justify-around sm:justify-between">
              <SectionTabs tabs={tabs} />
              <div className='flex justify-between sm:mt-4 xs:justify-start xs:min-w-full xs:flex-col lg:min-w-min'>
                <SearchPanel
                  onChange={handleSearch}
                  placeholder={tabs.find((tab) => tab.current).searchPlaceholder}
                />
                  <Filter
                  onClick={filter}
                  />
              </div>

            </div>
          </header>
          {(() => {
            switch (tabs.find((tab) => tab.current).href) {
              case route('courses'):
                return <List
                  listItems={courseGroups}
                  type="courseGroups"
                  courses={
                    courses.filter((course) => {
                      const searchFilter = course.name.toLowerCase().includes(searchString.toLowerCase());
                      const sortFilter = sort === 1 ? (course.progress >= sort && course.progress !== 100)  : course.progress >= sort;
                      return searchFilter && sortFilter;
                    })
                  }
                />;
              case route('programs'):
                return <List
                  listItems={
                    curriculums.filter((curriculum) => {
                      const searchFilter = curriculum.name.toLowerCase().includes(searchString.toLowerCase());
                      const sortFilter = sort === 1 ? (curriculum.progress >= sort && curriculum.progress !== 100)  : curriculum.progress >= sort;
                      return searchFilter && sortFilter;
                    })
                }
                  type="curriculums"
                />;
              default:
                return <List listItems={courses} type="courses" />;
            }
          })()}
        </div>
      </div>
    </div >
  );
}
