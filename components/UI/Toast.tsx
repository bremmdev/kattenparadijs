type Props = {
    message: string;
    type: "error" | "loading";
};

export default function Toast({ message, type }: Props) {
    const toastText = type === "error" ? `Error: ${message}` : `${message}`;

    return (
        <div
            className={`animate-fade rounded-lg p-4 ${type === "error" ? "text-red-600 bg-red-100 border-red-600 border-2" : "text-slate-900 bg-slate-100 border-slate-900 border-2"} font-medium`}
        >
            {toastText}
        </div>
    );
}