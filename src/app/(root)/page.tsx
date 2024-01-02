'use client';

import { Modal } from '@/components/ui/modal';
import { UserButton } from '@clerk/nextjs';

const SetupPage = () => {
  return (
    <div className="p-4">
      <UserButton afterSignOutUrl="/" />
      <Modal isOpen onClose={() => {}} title="TESTe" description="sadasd">
        children
      </Modal>
    </div>
  );
};

export default SetupPage;
