import React, { FocusEventHandler, MouseEventHandler} from 'react';

import { Link } from 'react-router-dom';

import Button from '../Button';

import './TodoList.scss';

import { TodoList as TTodoList } from '../../pages/Home/Home';
import { allItemsAreDone, getDoneRatio } from '../../utils/getTodoListDoneStatus';

interface ITodoListProps {
    list: TTodoList;
    onEditBtnClick: MouseEventHandler<HTMLButtonElement>;
    onToggleDoneBtnClick: MouseEventHandler<HTMLButtonElement>;
    onDeleteBtnClick: MouseEventHandler<HTMLButtonElement>;
    onFocus: FocusEventHandler<HTMLLIElement>;
}

const TodoList: React.FC<ITodoListProps> = ({
    list,
    onEditBtnClick,
    onToggleDoneBtnClick,
    onDeleteBtnClick,
    onFocus,
}) => {
    const doneStatusText = list.items.length
        ? `Done items: ${getDoneRatio(list).join('/')}`
        : 'Empty';

    return (
        <li
            onFocus={onFocus}
            tabIndex={0}
            className="todo-item--lists"
        >
            <Link className="todo-item__link" to={`/list/${list.id}`}>
                {list.name}
            </Link>
            <span className="todo-item__text">{doneStatusText}</span>
            <span className="todo-item__btn-group">
                <Button
                    className="todo-item__btn"
                    text="Edit"
                    onClick={onEditBtnClick}
                />
                <Button
                    renderCondition={list.items.length > 0}
                    text={`Mark all as ${allItemsAreDone(list) ? 'not' : ''} done`}
                    className="todo-item__btn"
                    onClick={onToggleDoneBtnClick}
                />
                <Button
                    text="Delete"
                    onClick={onDeleteBtnClick}
                    className="todo-item__btn"
                />
            </span>
        </li>
    );
};

export default TodoList;
