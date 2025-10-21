import React, { useState, useMemo } from 'react';
import type { Gear, GearItem, GearType } from '../../types';
import { GEAR_CATEGORIES, GEAR_SUGGESTIONS } from '../../constants';
import { CameraIcon, PlusIcon, TrashIcon } from '../icons';

interface GearManagerModalProps {
  gear: Gear;
  onClose: () => void;
  onSave: (newGear: Gear) => void;
}

export const GearManagerModal = ({ gear, onClose, onSave }: GearManagerModalProps) => {
  const [localGear, setLocalGear] = useState<Gear>(gear);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<GearType>('Camera');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewItemName(value);
    if (value) {
      const normalizedSearch = value.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normalizedSearch) {
        const filtered = GEAR_SUGGESTIONS[newItemType]
          .filter(suggestion => {
            const normalizedSuggestion = suggestion.toLowerCase().replace(/[^a-z0-9]/g, '');
            return normalizedSuggestion.includes(normalizedSearch);
          })
          .slice(0, 5);
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setNewItemName(name);
    setSuggestions([]);
  };

  const addGearItem = () => {
    if (!newItemName.trim()) return;
    const newItem: GearItem = {
      id: `gear-${Date.now()}`,
      name: newItemName.trim(),
      type: newItemType
    };
    setLocalGear(prev => ({ ...prev, items: [...prev.items, newItem] }));
    setNewItemName('');
    setSuggestions([]);
  };

  const removeGearItem = (id: string) => {
     setLocalGear(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };
  
  const groupedGear = useMemo(() => {
    return localGear.items.reduce((acc, item) => {
      (acc[item.type] = acc[item.type] || []).push(item);
      return acc;
    }, {} as Record<GearType, GearItem[]>);
  }, [localGear]);


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-brand-surface rounded-lg shadow-2xl p-8 w-full max-w-3xl text-brand-text relative border border-brand-muted max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-brand-text flex items-center flex-shrink-0"><CameraIcon className="w-6 h-6 mr-2"/> Manage Your Gear</h2>
        
        <div className="mb-6 relative flex-shrink-0">
          <h3 className="text-lg font-semibold mb-3">Add New Gear</h3>
          <div className="flex items-center gap-2">
            <select
              value={newItemType}
              onChange={e => {setNewItemType(e.target.value as GearType); setSuggestions([]); setNewItemName('');}}
              className="p-2 bg-brand-bg border border-brand-muted rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
            >
              {GEAR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <div className="relative flex-grow">
              <input
                type="text"
                value={newItemName}
                onChange={handleNameChange}
                onBlur={() => setTimeout(() => setSuggestions([]), 100)}
                placeholder={`e.g., ${GEAR_SUGGESTIONS[newItemType][0]}`}
                className="w-full p-2 bg-brand-bg border border-brand-muted rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 bg-brand-surface border border-brand-muted rounded-md mt-1 z-10 shadow-lg">
                  {suggestions.map(s => (
                    <li key={s} onMouseDown={() => handleSuggestionClick(s)} className="p-2 hover:bg-brand-muted cursor-pointer">{s}</li>
                  ))}
                </ul>
              )}
            </div>
            <button onClick={addGearItem} className="py-2 px-4 rounded bg-brand-primary hover:bg-brand-secondary text-white font-semibold"><PlusIcon className="w-5 h-5"/></button>
          </div>
        </div>

        <div className="overflow-y-auto flex-grow pr-2 -mr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {GEAR_CATEGORIES.map(category => {
                    const items = groupedGear[category] || [];
                    if (items.length === 0) return null;
                    return (
                        <div key={category}>
                            <h3 className="text-lg font-semibold mb-2 text-brand-text-dim">{category}s</h3>
                            <ul className="space-y-2">
                                {items.map(item => (
                                    <li key={item.id} className="flex justify-between items-center bg-brand-bg p-2 rounded group border border-brand-muted">
                                        <span>{item.name}</span>
                                        <button onClick={() => removeGearItem(item.id)} className="text-red-500/70 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon className="w-5 h-5"/></button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                })}
            </div>
        </div>


        <div className="flex justify-end gap-4 mt-8 flex-shrink-0">
          <button onClick={onClose} className="py-2 px-4 rounded bg-brand-muted hover:bg-brand-muted/70 text-brand-text">Cancel</button>
          <button onClick={() => onSave(localGear)} className="py-2 px-4 rounded bg-brand-primary hover:bg-brand-secondary text-white font-semibold">Save Gear</button>
        </div>
      </div>
    </div>
  );
};
