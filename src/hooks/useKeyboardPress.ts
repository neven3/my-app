import { useEffect } from "react";

const useKeyboardPress = (keyUpHandler: (e: KeyboardEvent) => void, keyDownHandler: (e: KeyboardEvent) => void) => {
    useEffect(() => {
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);

        return (() => {
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
        });
    });
};

export default useKeyboardPress;
