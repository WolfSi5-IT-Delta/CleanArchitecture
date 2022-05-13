import { createInertiaApp } from '@inertiajs/inertia-react';
import React from 'react';
import { render } from 'react-dom';

import { InertiaProgress } from '@inertiajs/progress';
import UserLayout from './Pages/Layout.jsx';
import AdminLayout from './Admin/Layout.jsx';
import PublicLayout from './Public/Layout';

require('./bootstrap');

createInertiaApp({
  // resolve: name => require(`./Pages/${name}`),
  resolve: (name) => {
    const page = require(`./${name}`).default;
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
    render(<App {...props} />, el);
  },
});

InertiaProgress.init();
