import React, { FocusEventHandler, MouseEventHandler} from 'react';

import Button from '../Button';
import readableDateTime from '../../utils/readableDateTime';

import { TodoItem } from '../../types';

import './ListItem.scss';

interface IListItemProps {
    item: TodoItem;
    onEditBtnClick: MouseEventHandler<HTMLButtonElement>;
    onToggleDoneBtnClick: MouseEventHandler<HTMLButtonElement>;
    onDeleteBtnClick: MouseEventHandler<HTMLButtonElement>;
    onFocus: FocusEventHandler<HTMLLIElement>;
}

const ListItem: React.FC<IListItemProps> = ({
    item,
    onEditBtnClick,
    onToggleDoneBtnClick,
    onDeleteBtnClick,
    onFocus,
}) => {
    return (
        <li
            className="todo-item--item"
            onFocus={onFocus}
            tabIndex={0}
        >
            <span className="todo-item__text--name">{item.name}</span>
            <span className="todo-item__text">{item.isDone ? 'Done' : 'Not done'}</span>
            {item.dueDate && <span className="todo-item__text">Due by: {readableDateTime(item.dueDate)}</span>}
            <span className="todo-item__btn-group">
                <Button
                   className="todo-item__btn"
                   text="Edit"
                   onClick={onEditBtnClick}
                />
                <Button
                    className="todo-item__btn"
                    text={`Mark as ${item.isDone ? 'not' : ''} done`}
                    onClick={onToggleDoneBtnClick}
                />
                <Button
                    className="todo-item__btn"
                    text="Delete"
                    onClick={onDeleteBtnClick}
                />
            </span>
        </li>
    );
};

export default ListItem;
