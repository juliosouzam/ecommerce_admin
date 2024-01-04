'use client';
import { useEffect } from 'react';

import { useStoreModal } from '@/hooks/store';

export default function SetupPage() {
  const { onOpen, isOpen } = useStoreModal();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
}
