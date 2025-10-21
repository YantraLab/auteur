import React, { useState, useMemo, useCallback, useRef } from 'react';
import { PlusIcon, TrashIcon, ImageIcon } from '../icons';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';

type CrewMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  imageUrl?: string;
};

export const CrewContactListBoard = ({ board, updateBoard }: BoardComponentProps) => {
  const initialContacts = useMemo<CrewMember[]>(() => {
    try {
      const content = board.content || '[]';
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }, [board.content]);

  const [contacts, setContacts] = useState<CrewMember[]>(initialContacts);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contactIdForUpload, setContactIdForUpload] = useState<string | null>(null);

  const handleUpdate = useCallback((newContacts: CrewMember[]) => {
    setContacts(newContacts);
    updateBoard(board.id, { content: JSON.stringify(newContacts) });
  }, [board.id, updateBoard]);

  const addContact = () => {
    const newContact: CrewMember = {
      id: `crew-${Date.now()}`,
      name: '',
      role: '',
      email: '',
      phone: '',
      imageUrl: '',
    };
    handleUpdate([...contacts, newContact]);
  };

  const removeContact = (id: string) => {
    handleUpdate(contacts.filter(c => c.id !== id));
  };

  const handleItemChange = (id: string, field: keyof Omit<CrewMember, 'id'>, value: string) => {
    const newContacts = contacts.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
    handleUpdate(newContacts);
  };

  const triggerUpload = (contactId: string) => {
    setContactIdForUpload(contactId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && contactIdForUpload) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            handleItemChange(contactIdForUpload, 'imageUrl', imageUrl);
        };
        reader.readAsDataURL(file);
    }
    if(event.target) event.target.value = '';
    setContactIdForUpload(null);
  };


  return (
    <div className="text-sm">
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      <div className="space-y-3">
        {contacts.map((contact) => (
          <div key={contact.id} className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-3 items-center group bg-brand-bg/50 p-2 rounded-md border border-brand-muted/70">
            <button onClick={() => triggerUpload(contact.id)} className="w-12 h-12 rounded-full group bg-brand-bg border border-brand-muted hover:border-brand-primary flex items-center justify-center flex-shrink-0">
                {contact.imageUrl ? (
                <img src={contact.imageUrl} alt={contact.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                <ImageIcon className="w-5 h-5 text-brand-text-dim" />
                )}
            </button>
            <input
              type="text"
              value={contact.name}
              onChange={(e) => handleItemChange(contact.id, 'name', e.target.value)}
              placeholder="Name"
              className="w-full bg-brand-surface p-2 rounded border border-brand-muted/80 focus:outline-none focus:ring-1 focus:ring-brand-primary/50"
            />
            <input
              type="text"
              value={contact.role}
              onChange={(e) => handleItemChange(contact.id, 'role', e.target.value)}
              placeholder="Role (e.g., Director)"
              className="w-full bg-brand-surface p-2 rounded border border-brand-muted/80 focus:outline-none focus:ring-1 focus:ring-brand-primary/50"
            />
            <input
              type="email"
              value={contact.email}
              onChange={(e) => handleItemChange(contact.id, 'email', e.target.value)}
              placeholder="Email"
              className="w-full bg-brand-surface p-2 rounded border border-brand-muted/80 focus:outline-none focus:ring-1 focus:ring-brand-primary/50"
            />
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => handleItemChange(contact.id, 'phone', e.target.value)}
              placeholder="Phone"
              className="w-full bg-brand-surface p-2 rounded border border-brand-muted/80 focus:outline-none focus:ring-1 focus:ring-brand-primary/50"
            />
            <button onClick={() => removeContact(contact.id)} className="text-red-500/70 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      <button onClick={addContact} className="text-xs font-semibold text-brand-primary hover:text-brand-secondary mt-4 flex items-center gap-1 px-1 py-2">
        <PlusIcon className="w-4 h-4"/> Add Crew Member
      </button>
    </div>
  );
};
