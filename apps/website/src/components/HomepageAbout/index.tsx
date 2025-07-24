import Heading from '@theme/Heading';
import styles from './styles.module.css';
import type {ReactNode} from "react";
import clsx from 'clsx';

type AboutItem = {
    title: string;
    description: ReactNode;
};

const AboutList: AboutItem[] = [
    {
        title: "What is BlockEnv?",
        description: (
            <>
                BlockEnv is a tool designed for testing Minecraft modpacks in production-like environments.
                Allowing you to create and manage isolated environments in which you can run Minecraft with different modpacks and configurations.
            </>
        )
    },
];

function About({title, description}: AboutItem) {
    return (
        <div className={clsx('col col--6')}>
            <div className="text--center padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageAbout() {
    return (
        <section className={styles.about}>
            <div className="container">
                <div className={clsx('row', styles.rowCenter)}>
                    {AboutList.map((props, idx) => (
                        <About key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
