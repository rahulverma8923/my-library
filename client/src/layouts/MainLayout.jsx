import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Navbar } from '../components/common/Navbar';
import { MobileBottomNav } from '../components/common/MobileBottomNav';
import { AddBookModal } from '../components/books/AddBookModal';
import { ImportBooksModal } from '../components/books/ImportBooksModal';

export const MainLayout = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-parchment-50 dark:bg-ink-950 text-ink-800 dark:text-ink-50">
      {/* Desktop & Tablet Sidebar */}
      <Sidebar
        onAddBook={() => setAddModalOpen(true)}
        onImportBooks={() => setImportModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Mobile Navbar */}
        <Navbar onAddBook={() => setAddModalOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
          <Outlet
            context={{
              openAddBookModal: () => setAddModalOpen(true),
              openImportModal: () => setImportModalOpen(true)
            }}
          />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onAddBook={() => setAddModalOpen(true)} />

      {/* Global Add Book Modal */}
      <AddBookModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      {/* Global Excel Import Modal */}
      <ImportBooksModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
      />
    </div>
  );
};

