type Props = {
    message: string;
    type: "error";
};

export default function Toast({ message }: Props) {
    return (
        <div
            className="rounded-lg p-4 text-red-600 bg-red-100 border-red-600 border-2 font-medium"
        >
            Error: {message}
        </div>
    );
}