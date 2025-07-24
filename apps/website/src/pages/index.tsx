import type {ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageAbout from "@site/src/components/HomepageAbout";
import Heading from '@theme/Heading';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={clsx("container", styles.heroContainer)}>
        <img src="img/logo.svg" />
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.heroInstallTabsContainer}>
            <Tabs className={styles.heroInstallTabs} lazy>
              <TabItem value="npm">
                  <CodeBlock>npm install @jaronline/blockenv</CodeBlock>
              </TabItem>
              <TabItem value="yarn">
                  <CodeBlock>yarn add @jaronline/blockenv</CodeBlock>
              </TabItem>
              <TabItem value="pnpm">
                  <CodeBlock>pnpm add @jaronline/blockenv</CodeBlock>
              </TabItem>
            </Tabs>
          </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <HomepageAbout />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
