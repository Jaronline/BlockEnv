import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'One-Time Configuration',
    description: (
      <>
        BlockEnv allows you to configure your testing environments in a single configuration file,
        allowing you to easily share your modpack configurations with your team and ensure that everyone is testing the same modpack under the same conditions.
      </>
    ),
  },
  {
    title: 'Production-like Environments',
    description: (
      <>
        BlockEnv environments are designed to be like production environments,
        allowing you to test your modpacks as if they were running in a real
        Minecraft client or server.
      </>
    ),
  },
  {
    title: 'Discover Issues Early',
    description: (
      <>
          Running your server and client locally gives you full access to debug logs, crash reports, and configurations,
          making it easier to find and fix issues before reaching production.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
        {Svg &&
            (<div className="text--center">
                <Svg className={styles.featureSvg} role="img"/>
            </div>)
        }
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
