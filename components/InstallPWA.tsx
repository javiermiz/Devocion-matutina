'use client';

import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

const InstallPWA = () => {
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      // Prevenir que Chrome muestre automáticamente el diálogo de instalación
      e.preventDefault();
      // Guardar el evento para usarlo después
      deferredPrompt = e as BeforeInstallPromptEvent;
      // Actualizar el estado de la UI
      setInstallable(true);
    });

    window.addEventListener('appinstalled', () => {
      // Limpiar el prompt guardado
      deferredPrompt = null;
      // Ocultar el botón de instalación
      setInstallable(false);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostrar el diálogo de instalación
    deferredPrompt.prompt();

    // Esperar la selección del usuario
    const { outcome } = await deferredPrompt.userChoice;

    // Optionally, send analytics event with outcome
    console.log(`User response to the install prompt: ${outcome}`);

    // Usamos el prompt, así que no podemos usarlo de nuevo
    deferredPrompt = null;
    // Ocultar el botón
    setInstallable(false);
  };

  if (!installable) return null;

  return (
    <button
      onClick={handleInstallClick}
      className='fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors'
    >
      <Download className='w-5 h-5' />
      <span>Instalar App</span>
    </button>
  );
};

export default InstallPWA;
