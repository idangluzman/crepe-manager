import type { CrepeType } from "../../types";

interface CrepeGridProps {
  crepeTypes: Record<string, CrepeType>;
  selectedKey: string | null;
  onSelect: (key: string) => void;
}

export function CrepeGrid({ crepeTypes, selectedKey, onSelect }: CrepeGridProps) {
  const entries = Object.entries(crepeTypes);

  if (entries.length === 0) {
    return (
      <p className="text-center text-chocolate-light/60 py-4 text-sm">
        No crepe types configured. Add them in the Settings collection.
      </p>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-chocolate-light">
        Crepe Type
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {entries.map(([key, crepe]) => {
          const isSelected = selectedKey === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`relative rounded-xl border-2 p-3 transition-all duration-200 active:scale-95 ${
                isSelected
                  ? "border-accent-orange bg-accent-orange/10 shadow-md"
                  : "border-cream-dark bg-white hover:border-accent-orange/40 hover:shadow-sm"
              }`}
            >
              {crepe.imageUrl ? (
                <img
                  src={crepe.imageUrl}
                  alt={crepe.name}
                  className="w-full h-20 object-cover rounded-lg mb-2"
                />
              ) : (
                <div className="w-full h-20 bg-cream-dark rounded-lg mb-2 flex items-center justify-center text-3xl">
                  🥞
                </div>
              )}
              <p className="font-medium text-sm text-center truncate">{crepe.name}</p>
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-accent-orange rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
