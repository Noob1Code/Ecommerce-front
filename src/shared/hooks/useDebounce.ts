import { useState, useEffect } from 'react';

/**
 * Hook customizado para fazer o debounce de um valor.
 * Útil para atrasar chamadas de API enquanto o usuário digita em um input de busca.
 * @param value O valor a ser debounced
 * @param delay O atraso em milissegundos
 * @returns O valor com debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura um timer para atualizar o valor debounced após o atraso especificado
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar antes do atraso passar
    // Isso cancela o timeout anterior, garantindo que só atualize depois que o usuário parar de digitar
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}