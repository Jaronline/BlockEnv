import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const Title = 'BlockEnv';
const Description = 'Minecraft Java testing environment for modpacks';
const Email = 'info@jaronline.dev';
const BaseUrl = 'https://blockenv.jaronline.dev';
const GithubUrl = 'https://github.com/Jaronline/BlockEnv';

const config: Config = {
	title: Title,
	tagline: Description,
	favicon: 'icons/favicon.ico',
	future: {
		v4: true,
	},
	url: BaseUrl,
	baseUrl: '/',
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
					  `${GithubUrl}/edit/main/apps/website/`,
				},
				blog: false,
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],
	themeConfig: {
		image: 'icons/opengraph.jpg',
		colorMode: {
			defaultMode: 'dark',
			respectPrefersColorScheme: true
		},
		metadata: [
			{ name: 'apple-mobile-web-app-capable', content: 'yes' },
			{ name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
			{ name: 'apple-mobile-web-app-title', content: Title },
			{ name: 'application-name', content: Title },
			{ name: 'author', content: `Jaronline, ${Email}` },
			{ name: 'description', content: Description },
			{ name: 'theme-color', content: "#5BA358" },
			{ name: 'url', content: BaseUrl },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ property: 'og:description', content: Description },
			{ property: 'og:email', content: Email },
			{ property: 'og:image:alt', content: 'OpenGraphImage' },
			{ property: 'og:image:height', content: '630' },
			{ property: 'og:image:width', content: '1200' },
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
					to: "docs/getting-started",
					label: "Docs",
					"aria-label": "Documentation",
					position: "right"
				},
				{
					href: GithubUrl,
					"aria-label": 'GitHub repository',
					className: 'github-link',
					position: 'right',
				},
			],
		},
		footer: {
			links: [
				{
					title: "Docs",
					items: [
						{
							label: "Getting Started",
							to: "/docs/getting-started",
						}
					]
				},
				{
					title: "More",
					items: [
						{
							label: "Github",
							href: GithubUrl,
						},
						{
							label: "NPM",
							href: "https://npmjs.com/package/@jaronline/blockenv",
						},
						{
							label: "Discord",
							href: "https://discord.gg/VXUYxrB5dJ"
						}
					]
				}
			],
			logo: {
				alt: `${Title} Logo`,
				src: 'img/logo-text.svg',
				height: 50,
			},
			copyright: `Copyright © ${new Date().getFullYear()} Jaronline.`,
		},
		prism: {
			defaultLanguage: 'bash',
			additionalLanguages: ["json", "json5"],
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
		algolia: {
			appId: "8T72EBPMSX",
			apiKey: "c00001cf92664dc960eb315f434eb3e8",
			indexName: "BlockEnv Docs"
		}
	} satisfies Preset.ThemeConfig,
	plugins: [
		[
			"@docusaurus/plugin-pwa",
			{
				debug: true,
				offlineModeActivationStrategies: [
					'appInstalled',
					'standalone',
					'queryString',
				],
				pwaHead: [
					{
						tagName: "link",
						rel: "icon",
						type: "image/png",
						href: "/icons/favicon-96.png",
						sizes: "96x96"
					},
					{
						tagName: "link",
						rel: "icon",
						type: "image/svg+xml",
						href: "/icons/favicon.svg"
					},
					{
						tagName: "link",
						rel: "shortcut icon",
						href: "/icons/favicon.ico"
					},
					{
						tagName: "link",
						rel: "apple-touch-icon",
						href: "/icons/apple-touch-icon.png",
						sizes: "180x180"
					},
					{
						tagName: "link",
						rel: "manifest",
						href: "/manifest.json"
					},
					{
						tagName: "meta",
						name: "theme-color",
						content: "#5BA358"
					}
				]
			}
		]
	]
};

export default config;
