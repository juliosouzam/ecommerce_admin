'use client';
import { useEffect } from 'react';

import { UserButton } from '@clerk/nextjs';

import { StoreModal } from '@/components/modals/store';
import { useStoreModal } from '@/hooks/store';

const SetupPage = () => {
  const { onOpen, isOpen } = useStoreModal();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return <div className="p-4">Root page</div>;
};

export default SetupPage;
