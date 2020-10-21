import React from 'react';

import styles from './Checkbox.module.scss';
import clsx from 'clsx';

interface CheckboxProps {
    id?: string;
    name?: string;
    checked?: boolean;
    value?: string | number;
    className?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = (props) => {
    const id = props.id ? props.id : Math.random().toString(36).substr(2, 5);
    return (
        <label
            htmlFor={id}
            className={clsx(
                "d-flex align-items-center px-1 m-0",
                styles.root,
                props.className
            )}>
            <input
                className={styles.selectionBox}
                type="checkbox"
                name={props.name}
                id={id}
                value={props.value}
                checked={props.checked}
                onChange={props.onChange}
            />
            <span
                className={styles.label}
            >
                {props.children}
            </span>
        </label>
    );
};

export default Checkbox;
