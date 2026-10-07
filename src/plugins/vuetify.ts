import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { icons } from './mdi-icon'; // Import icons from separate file
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { PurpleTheme } from '@/theme/LightTheme';

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      ...icons
    },
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'PurpleTheme',
    themes: {
      PurpleTheme
    }
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
      elevation: 0,
      variant: 'flat',
      color: 'primary',
      class: 'text-none font-weight-bold tracking-tight'
    },
    VCard: {
      rounded: 'xl',
      elevation: 0,
      variant: 'flat',
      class: 'border-thin border-borderLight'
    },
    VTextField: {
      rounded: 'lg',
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      bgColor: 'surface',
      persistentPlaceholder: true
    },
    VSelect: {
      rounded: 'lg',
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      bgColor: 'surface'
    },
    VDataTable: {
      class: 'border-thin border-borderLight rounded-xl overflow-hidden'
    },
    VTooltip: {
      location: 'top'
    }
  }
});
