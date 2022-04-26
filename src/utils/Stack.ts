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
    // private _instance: Action[];

    constructor(instance: Action[] = []) {
        this.instance = instance;
        // this._instance = instance;
    }

    public push(action: Action) {
        this.instance.push(action);
        // this._instance.push(action);
    }

    protected pop() {
        return this.instance.pop();
        // return this._instance.pop();
    }

    public get isEmpty() {
        return this.instance.length === 0;
        // return this._instance.length === 0;
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

export class UndoStack extends Stack {
    // private _redoStack: Stack;
    private _receiver: TReceiver;

    // constructor(redoStack: Stack, receiver: TReceiver) {
    constructor(receiver: TReceiver, stack: Action[] = []) {
        super(stack);

        // this._redoStack = redoStack;
        this._receiver = receiver;
    }

    public undo() {
        console.log('$'.repeat(40))
        console.log('undoing');
        console.log({ stack: this.isEmpty });

        if (!this.isEmpty) {
            const action = this.pop();
            console.log({ action });
            if (!action) return;

            this._receiver[action.type].undo(action);

            // push the action to redo stack
            // this._redoStack.push(action);
        }
    }
}

export default Stack;
