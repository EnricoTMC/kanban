import { useEffect } from 'react';
import { Button } from './Button';

export function Modal({ isOpen, title, children, onClose, size = 'medium' }) {
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="overlay-modal" onClick={onClose} role="presentation">
      <div
        className={`modal-tarefa modal-${size}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="cabecalho-modal">
          <h3 id="modal-title">{title}</h3>
          <Button
            className="botao-fechar"
            onClick={onClose}
            aria-label="Fechar modal"
            title="Fechar (ESC)"
          >
            ✕
          </Button>
        </div>

        <div className="conteudo-modal">{children}</div>
      </div>
    </div>
  );
}
