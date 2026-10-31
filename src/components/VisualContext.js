import { createContext, useContext } from 'react';
export const VisualContext = createContext({ elderly: false });
export function useVisualContext() { return useContext(VisualContext); }
