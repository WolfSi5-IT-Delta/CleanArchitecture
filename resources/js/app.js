import { createInertiaApp } from '@inertiajs/inertia-react';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { InertiaProgress } from '@inertiajs/progress';
import UserLayout from './Pages/Layout.jsx';
import AdminLayout from './Admin/Layout.jsx';

import {I18nextProvider} from "react-i18next";
import i18n from './i18n';

import PublicLayout_EN from './Public/en/Layout';
import PublicLayout_RU from './Public/ru/Layout';

let PublicLayout = PublicLayout_EN;
switch (i18n.language) {
  case 'ru': PublicLayout = PublicLayout_RU;
    break;
}

require('./bootstrap');

createInertiaApp({
  // resolve: name => require(`./Pages/${name}`),
  resolve: async (name) => {
    const page = (await import(`./${name}`)).default;
    if (name.startsWith('Admin/')) {
      page.layout = AdminLayout;
    }
    if (name.startsWith('Public/')) {
      page.layout = PublicLayout;
    }
    if (name.startsWith('Pages/')) {
      page.layout = UserLayout;
    }
    if (page.layout === undefined) {
      page.layout = PublicLayout;
    }
    return page;
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
      <I18nextProvider i18n={i18n}>
        <App {...props} />
      </I18nextProvider>
    );
  }
});

InertiaProgress.init();
