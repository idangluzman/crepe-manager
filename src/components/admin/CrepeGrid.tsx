import type { CrepeType } from "../../types";

export type CrepeSelection = Record<string, number>;

interface CrepeGridProps {
  crepeTypes: Record<string, CrepeType>;
  selection: CrepeSelection;
  onSelectionChange: (selection: CrepeSelection) => void;
}

export function CrepeGrid({ crepeTypes, selection, onSelectionChange }: CrepeGridProps) {
  const entries = Object.entries(crepeTypes);

  if (entries.length === 0) {
    return (
      <p className="text-center text-chocolate-light/60 py-4 text-sm">
        No crepe types configured. Add them in the Settings collection.
      </p>
    );
  }

  function toggleType(key: string) {
    const next = { ...selection };
    if (next[key]) {
      delete next[key];
    } else {
      next[key] = 1;
    }
    onSelectionChange(next);
  }

  function setQuantity(key: string, qty: number) {
    if (qty <= 0) {
      const next = { ...selection };
      delete next[key];
      onSelectionChange(next);
      return;
    }
    onSelectionChange({ ...selection, [key]: qty });
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-chocolate-light">
        Crepe Types & Quantity
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {entries.map(([key, crepe]) => {
          const qty = selection[key] ?? 0;
          const isSelected = qty > 0;
          return (
            <div key={key} className="flex flex-col">
              <button
                type="button"
                onClick={() => toggleType(key)}
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
                    className="w-full h-28 object-contain rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-full h-28 bg-cream-dark rounded-lg mb-2 flex items-center justify-center text-3xl">
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
              {isSelected && (
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(key, qty - 1)}
                    className="w-8 h-8 rounded-full bg-cream-dark text-chocolate font-bold flex items-center justify-center hover:bg-accent-orange/20 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-bold text-chocolate min-w-[1.5rem] text-center">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(key, qty + 1)}
                    className="w-8 h-8 rounded-full bg-cream-dark text-chocolate font-bold flex items-center justify-center hover:bg-accent-orange/20 transition-colors"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
