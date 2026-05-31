import toast from 'react-hot-toast';

// Toast tabanlı confirm — native confirm() yerine kullanılır.
// Promise<boolean> döner.
export function confirmDialog({ title, description, confirmText = 'Onayla', cancelText = 'Vazgeç', danger = false } = {}) {
  return new Promise((resolve) => {
    const id = toast.custom((tInstance) => (
      <div
        className={`max-w-sm w-full bg-white border border-zinc-200 rounded-2xl shadow-lg p-5 transition-all ${
          tInstance.visible ? 'animate-in fade-in zoom-in-95' : 'animate-out fade-out zoom-out-95'
        }`}
      >
        <h3 className="font-medium text-base mb-1">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => { toast.dismiss(id); resolve(false); }}
            className="px-4 py-2 text-sm rounded-lg border border-zinc-200 hover:bg-accent"
          >
            {cancelText}
          </button>
          <button
            onClick={() => { toast.dismiss(id); resolve(true); }}
            className={`px-4 py-2 text-sm rounded-lg text-white ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: 'top-center' });
  });
}
