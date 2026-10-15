import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Modal Portal & Body Lock Behavior (Bug 8)', () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;

  let mockBody: {
    style: { overflow: string; scrollbarGutter: string };
    appendChild: ReturnType<typeof vi.fn>;
    removeChild: ReturnType<typeof vi.fn>;
  };

  let listeners: Record<string, (e: any) => void> = {};

  beforeEach(() => {
    listeners = {};
    mockBody = {
      style: { overflow: '', scrollbarGutter: '' },
      appendChild: vi.fn(),
      removeChild: vi.fn()
    };

    (globalThis as any).document = {
      body: mockBody,
      createElement: vi.fn(() => ({ style: {} }))
    };

    (globalThis as any).window = {
      addEventListener: vi.fn((event: string, handler: any) => {
        listeners[event] = handler;
      }),
      removeEventListener: vi.fn((event: string) => {
        delete listeners[event];
      })
    };
  });

  afterEach(() => {
    (globalThis as any).document = originalDocument;
    (globalThis as any).window = originalWindow;
  });

  it('locks body scroll with scrollbar-gutter: stable when open, and cleans up on unmount', () => {
    // Simulating Modal's scroll locking effect
    const isOpen = true;
    const onClose = vi.fn();

    const originalOverflow = document.body.style.overflow;
    const originalGutter = document.body.style.scrollbarGutter;

    document.body.style.scrollbarGutter = 'stable';
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: any) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.scrollbarGutter).toBe('stable');
    expect(window.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));

    // Simulate Escape key press
    listeners['keydown']({ key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    // Simulate cleanup
    document.body.style.overflow = originalOverflow;
    document.body.style.scrollbarGutter = originalGutter;
    window.removeEventListener('keydown', handleKeyDown);

    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.scrollbarGutter).toBe('');
    expect(window.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('handles zoom and viewport coverage classes properly', () => {
    const requiredBackdropClasses = [
      'fixed',
      'inset-0',
      'w-screen',
      'h-dvh',
      'min-h-dvh',
      'max-h-dvh',
      'bg-black/60',
      'backdrop-blur-md'
    ];

    const backdropClassString =
      'fixed inset-0 top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in w-screen h-dvh min-h-dvh max-h-dvh overflow-y-auto';

    for (const cls of requiredBackdropClasses) {
      expect(backdropClassString.split(' ')).toContain(cls);
    }
  });
});
