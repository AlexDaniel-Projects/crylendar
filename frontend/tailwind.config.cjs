const colors = require('tailwindcss/colors');
const svelte_ux = require('svelte-ux/plugins/tailwind.cjs');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,svelte}', './node_modules/svelte-ux/**/*.{svelte,js}'],
	theme: {
		extend: {
			headerHeight: '10px'
		}
	},
	variants: {
		extend: {}
	},
	ux: {
		themes: {
			light: {
				'color-scheme': 'light',
				primary: 'hsl(188.7379 94.4954% 42.7451%)',
				secondary: 'hsl(217.2193 91.2195% 59.8039%)',
				accent: 'hsl(270.7407 91.0112% 65.098%)',
				'surface-100': 'hsl(220 15% 92.1569%)',
				'surface-200': 'hsl(217.5 14.8148% 89.4118%)',
				'surface-300': 'hsl(216 14.7059% 86.6667%)'
			},
			dark: {
				'header-height': '10px',
				'color-scheme': 'dark',
				primary: 'hsl(188.7379 94.4954% 42.7451%)',
				secondary: 'hsl(217.2193 91.2195% 59.8039%)',
				accent: 'hsl(270.7407 91.0112% 65.098%)',
				'surface-100': 'hsl(0 0% 9.0196%)',
				'surface-200': 'hsl(0 0% 0%)',
				'surface-300': 'hsl(0 0% 5.4902%)'
			}
		}
	},
	plugins: [svelte_ux]
};

module.exports = config;
