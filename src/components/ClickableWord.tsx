import { Token } from "@/types";

interface ClickableWordProps {
  token: Token;
  isHighlighted: boolean;
}

export default function ClickableWord({ token, isHighlighted }: ClickableWordProps) {
  if (!token.isWord) {
    return <span>{token.text}</span>;
  }

  const href = `https://dict.naver.com/nsvendict/#/search?query=${encodeURIComponent(token.text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`cursor-pointer hover:underline ${
        isHighlighted
          ? "font-bold text-indigo-600 dark:text-indigo-400"
          : "text-inherit"
      }`}
    >
      {token.text}
    </a>
  );
}
