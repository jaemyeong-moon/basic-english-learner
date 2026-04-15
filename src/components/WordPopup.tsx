"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DictDefinition {
  definition: string;
  example?: string;
}
interface DictMeaning {
  partOfSpeech: string;
  definitions: DictDefinition[];
}
interface DictEntry {
  word: string;
  phonetic?: string;
  meanings: DictMeaning[];
}

interface WordPopupProps {
  word: string;
  anchorEl: HTMLElement;
  onClose: () => void;
}

export default function WordPopup({ word, anchorEl, onClose }: WordPopupProps) {
  const [data, setData] = useState<DictEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // 팝업 위치 계산
  const rect = anchorEl.getBoundingClientRect();
  const top = rect.bottom + window.scrollY + 6;
  const left = Math.min(
    rect.left + window.scrollX,
    window.innerWidth - 300 - 8
  );

  // API 호출
  useEffect(() => {
    const controller = new AbortController();
    fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`,
      { signal: controller.signal }
    )
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((json: DictEntry[]) => {
        setData(json[0]);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, [word]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        !anchorEl.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [anchorEl, onClose]);

  const popup = (
    <div
      ref={popupRef}
      style={{ top, left }}
      className="fixed z-50 w-72 rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <span className="font-bold text-zinc-900 dark:text-zinc-50">{word}</span>
        {data?.phonetic && (
          <span className="text-sm text-zinc-400 dark:text-zinc-500">
            {data.phonetic}
          </span>
        )}
        <button
          onClick={onClose}
          className="ml-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          aria-label="팝업 닫기"
        >
          ✕
        </button>
      </div>

      {/* 내용 */}
      <div className="max-h-64 overflow-y-auto px-4 py-3 text-sm">
        {loading && (
          <p className="text-zinc-400 dark:text-zinc-500">검색 중...</p>
        )}
        {error && (
          <p className="text-zinc-400 dark:text-zinc-500">
            사전 정보를 찾을 수 없습니다.
          </p>
        )}
        {data &&
          data.meanings.slice(0, 3).map((m, mi) => (
            <div key={mi} className={mi > 0 ? "mt-3" : ""}>
              <span className="mb-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                {m.partOfSpeech}
              </span>
              {m.definitions.slice(0, 2).map((d, di) => (
                <div key={di} className={di > 0 ? "mt-2" : "mt-1"}>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {di + 1}. {d.definition}
                  </p>
                  {d.example && (
                    <p className="mt-0.5 italic text-zinc-400 dark:text-zinc-500">
                      &ldquo;{d.example}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );

  return createPortal(popup, document.body);
}
