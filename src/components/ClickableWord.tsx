"use client";

import { useCallback, useRef, useState } from "react";
import { Token } from "@/types";
import WordPopup from "./WordPopup";

interface ClickableWordProps {
  token: Token;
  isHighlighted: boolean;
}

export default function ClickableWord({ token, isHighlighted }: ClickableWordProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => setOpen(false), []);

  if (!token.isWord) {
    return <span>{token.text}</span>;
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className={`cursor-pointer rounded hover:underline focus:outline-none ${
          isHighlighted
            ? "font-bold text-indigo-600 dark:text-indigo-400"
            : "text-inherit"
        }`}
      >
        {token.text}
      </button>
      {open && btnRef.current && (
        <WordPopup
          word={token.text}
          anchorEl={btnRef.current}
          onClose={handleClose}
        />
      )}
    </>
  );
}
