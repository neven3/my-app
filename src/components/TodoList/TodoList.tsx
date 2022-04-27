import React, { FocusEventHandler, MouseEventHandler} from 'react';

import { Link } from 'react-router-dom';

import Button from '../Button';

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
            style={{ marginBottom: '10px' }}
            onFocus={onFocus}
            tabIndex={0}
        >
            <Link to={`/list/${list.id}`} style={{ margin: '10px' }}>
                {list.name}
            </Link>
            <span style={{ margin: '10px' }}>{doneStatusText}</span>
            <Button text="Edit" onClick={onEditBtnClick} />
            <Button
                renderCondition={list.items.length > 0}
                text={`Mark all as ${allItemsAreDone(list) ? 'not' : ''} done`} 
                onClick={onToggleDoneBtnClick}
            />
            <Button text="Delete" onClick={onDeleteBtnClick} />
        </li>
    );
};

export default TodoList;
