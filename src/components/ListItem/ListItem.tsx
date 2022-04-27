import React, { FocusEventHandler, MouseEventHandler} from 'react';

import Button from '../Button';

import { TodoItem } from '../../pages/Home/Home';

interface IListItemProps {
    item: TodoItem;
    onEditBtnClick: MouseEventHandler<HTMLButtonElement>;
    onToggleDoneBtnClick: MouseEventHandler<HTMLButtonElement>;
    onDeleteBtnClick: MouseEventHandler<HTMLButtonElement>;
    onFocus: FocusEventHandler<HTMLLIElement>;
}

const formatDateTime = (date: string) => date.replaceAll('-', '/').split('T').join(' at ');

const ListItem: React.FC<IListItemProps> = ({
    item,
    onEditBtnClick,
    onToggleDoneBtnClick,
    onDeleteBtnClick,
    onFocus,
}) => {
    return (
        <li
            style={{ marginBottom: '10px' }}
            onFocus={onFocus}
            tabIndex={0}
        >
            <span style={{ margin: '10px' }}>{item.name}</span>
            <span style={{ margin: '10px' }}>{item.isDone ? 'Done' : 'Not done'}</span>
            {item.dueDate && <span style={{ margin: '10px' }}>Due by: {formatDateTime(item.dueDate)}</span>}
            <Button text="Edit" onClick={onEditBtnClick} />
            <Button
                text={`Mark as ${item.isDone ? 'not' : ''} done`}
                onClick={onToggleDoneBtnClick}
            />
            <Button text="Delete" onClick={onDeleteBtnClick} />
        </li>

    );
};

export default ListItem;
