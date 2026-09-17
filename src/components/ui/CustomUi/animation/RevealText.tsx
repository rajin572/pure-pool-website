
export function RevealText({ text, className }: { text: string; className?: string }) {
    const words = text.split(" ");

    return (
        <p className={className}>
            {words.map((word, i) => (
                <span key={`${word}-${i}`}>
                    <span className="reveal-word text-[#e4e2e2] transition-colors">{word}</span>
                    {i !== words.length - 1 && " "}
                </span>
            ))}
        </p>
    );
}
