// src/components/global-alert-dialog/GlobalAlertDialogContext.tsx

import React, {createContext, useState, useContext, type ReactNode} from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

// ---------------------------
// 1. TYPES
// ---------------------------
interface DialogState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

interface AlertDialogContextProps {
  showDialog: (options: Omit<DialogState, 'isOpen'>) => void;
  hideDialog: () => void;
}

// ---------------------------
// 2. CONTEXT & INITIAL STATE
// ---------------------------
const initialDialogState: DialogState = {
  isOpen: false,
  title: '',
  description: '',
  onConfirm: () => {
  },
  confirmText: 'Continue',
  cancelText: 'Cancel',
  isDestructive: false,
};

const AlertDialogContext = createContext<AlertDialogContextProps | undefined>(undefined);

// ---------------------------
// 3. PROVIDER COMPONENT
// ---------------------------
export const GlobalAlertDialogProvider: React.FC<{
  children: ReactNode
}> = ({children}) => {
  const [dialogState, setDialogState] = useState<DialogState>(initialDialogState);

  const showDialog = (options: Omit<DialogState, 'isOpen'>) => {
    setDialogState({
      ...initialDialogState, // Reset to defaults first
      ...options,
      isOpen: true,
    });
  };

  const hideDialog = () => {
    setDialogState(prev => ({...prev, isOpen: false}));
    // Optional: Reset content after a short delay for animation
    setTimeout(() => setDialogState(initialDialogState), 300);
  };

  const handleConfirm = () => {
    dialogState.onConfirm();
    hideDialog();
  };

  return (
      <AlertDialogContext.Provider value={{showDialog, hideDialog}}>
        {children}
        <AlertDialog open={dialogState.isOpen} onOpenChange={hideDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dialogState.title}</AlertDialogTitle>
              <AlertDialogDescription>{dialogState.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={hideDialog}>
                {dialogState.cancelText}
              </AlertDialogCancel>
              <AlertDialogAction
                  onClick={handleConfirm}
                  className={dialogState.isDestructive ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {dialogState.confirmText}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AlertDialogContext.Provider>
  );
};

// ---------------------------
// 4. CUSTOM HOOK
// ---------------------------
export const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (context === undefined) {
    throw new Error('useAlertDialog must be used within a GlobalAlertDialogProvider');
  }
  return context;
};