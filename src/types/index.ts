export type TodoList = {
    name: string;
    items: TodoItem[];
    id: string;
};

export type TodoItem = {
    name: string;
    isDone: boolean;
    id: string;
    dueDate?: string;
};

export enum EActions {
    Add = 'add',
    Remove = 'remove',
    Edit = 'edit',
}

type AddAction = {
    type: EActions.Add;
    index: number;
    value: TodoItem | TodoList;
};

export type DeleteAction = {
    type: EActions.Remove;
    index: number;
    value: TodoItem | TodoList;
};

export type EditAction = {
    type: EActions.Edit;
    value: TodoItem | TodoList;
    previousValue: TodoItem | TodoList;
    index: number;
};

export type Action = AddAction | DeleteAction | EditAction;