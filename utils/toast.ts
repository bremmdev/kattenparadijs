type ToastType = "error" | "loading";

export type ToastItem = {
    id: string;
    message: string;
    type: ToastType;
};

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
let listeners: Listener[] = [];

const notify = () => listeners.forEach((l) => l([...toasts]));

const remove = (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
};

const add = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).slice(2);
    toasts = [...toasts, { id, message, type }];
    notify();
    setTimeout(() => remove(id), 3000);
};

export const subscribe = (listener: Listener) => {
    listeners.push(listener);
    return () => {
        listeners = listeners.filter((l) => l !== listener);
    };
};

export const toast = {
    error: (message: string) => add(message, "error"),
};