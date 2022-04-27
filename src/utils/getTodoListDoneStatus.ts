import { TodoList } from '../pages/Home/Home';

export const getDoneRatio = (list: TodoList) => {
    const doneItemsCount = list.items.filter((item) => item.isDone).length;

    return [doneItemsCount, list.items.length];
};

export const allItemsAreDone = (list: TodoList) => {
    const [doneCount, allCount] = getDoneRatio(list);

    return doneCount === allCount;
};
