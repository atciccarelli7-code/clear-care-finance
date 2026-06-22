import { useCallback, useState } from "react";

export const useCalculatorFields = <T extends Record<string, string>>(defaults: T) => {
  const [fields, setFields] = useState<T>(defaults);

  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFields((current) => ({ ...current, [field]: value }));
  }, []);

  const reset = useCallback(() => setFields(defaults), [defaults]);

  return { fields, updateField, reset };
};
