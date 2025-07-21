import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const Title = 'BlockEnv';
const Description = 'Minecraft Java testing environment for modpacks';
const Email = 'info@jaronline.dev';
const BaseUrl = 'https://jaronline.github.io';

const config: Config = {
	title: Title,
	tagline: Description,
	favicon: 'img/favicon.ico',
	future: {
		v4: true,
	},
	url: BaseUrl,
	baseUrl: '/BlockEnv/',
	organizationName: 'Jaronline',
	projectName: 'BlockEnv',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},
	presets: [
		[
			'classic',
			{
				docs: {
					sidebarPath: './sidebars.ts',
					editUrl:
					  'https://github.com/Jaronline/BlockEnv/edit/main/apps/website/',
				},
				blog: false,
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],
	themeConfig: {
		// Replace with your project's social card
		image: 'img/docusaurus-social-card.jpg',
		colorMode: {
			defaultMode: 'dark',
			respectPrefersColorScheme: true
		},
		metadata: [
			{ name: 'application-name', content: Title },
			{ name: 'author', content: `Jaronline, ${Email}` },
			{ name: 'description', content: Description },
			{ name: 'url', content: BaseUrl },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ property: 'og:description', content: Description },
			{ property: 'og:email', content: Email },
			{ property: 'og:locale', content: "en_US" },
			{ property: 'og:site_name', content: Title },
			{ property: 'og:title', content: Title },
			{ property: 'og:type', content: "website" },
			{ property: 'og:url', content: BaseUrl }
		],
		navbar: {
			title: Title,
			logo: {
				alt: `${Title} Logo`,
				src: 'img/logo.svg',
			},
			items: [
				{
					href: 'https://github.com/Jaronline/BlockEnv',
					label: 'GitHub',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [],
			copyright: `Copyright © ${new Date().getFullYear()} Jaronline.`,
		},
		prism: {
			defaultLanguage: 'bash',
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,
};

export default config;
