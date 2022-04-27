import { TodoItem, TodoList } from '../pages/Home/Home';

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

class Stack {
    public instance: Action[];

    constructor(instance: Action[] = []) {
        this.instance = instance;
    }

    public push(action: Action) {
        this.instance.push(action);
    }

    protected pop() {
        return this.instance.pop();
    }

    public get isEmpty() {
        return this.instance.length === 0;
    }

    public peek() {
        return this.instance.at(-1);
    }
}

abstract class Command {
    abstract execute(action: Action): void;
    abstract undo(action: Action): void;
}

export type TReceiver = Record<EActions, Command>;

class UndoStack extends Stack {
    private _receiver: TReceiver;

    constructor(receiver: TReceiver, stack: Action[] = []) {
        super(stack);

        this._receiver = receiver;
    }

    public undo() {
        if (!this.isEmpty) {
            const action = this.pop();

            if (!action) return;

            this._receiver[action.type].undo(action);
        }
    }
}

class RedoStack extends Stack {
    private _receiver: TReceiver;

    constructor(receiver: TReceiver, stack: Action[] = []) {
        super(stack);

        this._receiver = receiver;
    }

    public redo() {
        if (!this.isEmpty) {
            const action = this.pop();

            if (!action) return;

            this._receiver[action.type].execute(action);
        }
    }

    public empty() {
        this.instance = [];
    }
}

export class UndoRedo {
    private _undoStack: UndoStack;
    private _redoStack: RedoStack;

    constructor(receiver: TReceiver, undoStack: Action[] = [], redoStack: Action[] = []) {
        this._undoStack = new UndoStack(receiver, undoStack);
        this._redoStack = new RedoStack(receiver, redoStack);
    }

    public get undoStack() {
        return this._undoStack;
    }

    public get redoStack() {
        return this._redoStack;
    }

    public pushNewUndoAction(action: Action) {
        this._undoStack.push(action);
    }

    public undo() {
        const action = this._undoStack.peek();

        if (action) {
            this._undoStack.undo();
            this._redoStack.push(action);
        }
    }

    public redo() {
        const action = this._redoStack.peek();

        if (action) {
            this._redoStack.redo();
            this._undoStack.push(action);
        }
    }

    public emptyRedo() {
        this._redoStack.empty();
    }
}
