import { useEffect, useState } from "react";
import { subscribe, type ToastItem } from "@/utils/toast";
import Toast from "./Toast";

export default function Toaster() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => subscribe(setToasts), []);

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2">
            {toasts.map((t) => (
                <Toast key={t.id} message={t.message} type="error" />
            ))}
        </div>
    );
}