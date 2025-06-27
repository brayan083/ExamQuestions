import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Importa la configuración de Firebase
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase.ts"; // Asegúrate de que la ruta sea correcta

// Inicializa Firebase
initializeApp(firebaseConfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
