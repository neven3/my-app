const localStorageStackId = (type: 'undo' | 'redo', listId: string) => `${listId}${type}stack`;

export default localStorageStackId;
