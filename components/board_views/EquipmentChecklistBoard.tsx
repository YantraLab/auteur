import React, { useMemo } from 'react';
import type { GearItem, GearType } from '../../types';
import { GEAR_CATEGORIES } from '../../constants';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';

export const EquipmentChecklistBoard = ({ board, gear, updateBoard, setGearModalOpen }: BoardComponentProps) => {
    if (gear.items.length === 0) {
      return (
        <div className="text-center text-brand-text-dim p-4 flex flex-col items-center justify-center h-full">
          <p className="mb-3">You haven't added any gear yet.</p>
          <button 
            onClick={() => setGearModalOpen(true)} 
            className="text-sm font-semibold text-brand-primary hover:text-brand-secondary bg-brand-primary/10 px-4 py-2 rounded-md transition-colors"
          >
            Add Gear to Inventory
          </button>
        </div>
      );
    }

    const checkedItemIds = useMemo(() => {
      try {
        const content = board.content || '[]';
        const ids = JSON.parse(content);
        return new Set<string>(Array.isArray(ids) ? ids : []);
      } catch (e) {
        return new Set<string>();
      }
    }, [board.content]);

    const handleToggleCheck = (itemId: string) => {
      const newCheckedIds = new Set(checkedItemIds);
      if (newCheckedIds.has(itemId)) {
        newCheckedIds.delete(itemId);
      } else {
        newCheckedIds.add(itemId);
      }
      updateBoard(board.id, { content: JSON.stringify(Array.from(newCheckedIds)) });
    };

    const groupedGear = useMemo(() => gear.items.reduce((acc, item) => {
      (acc[item.type] = acc[item.type] || []).push(item);
      return acc;
    }, {} as Record<GearType, GearItem[]>), [gear.items]);

    return (
      <div className="space-y-6">
        {GEAR_CATEGORIES.map(category => {
          const items = groupedGear[category];
          if (!items || items.length === 0) return null;
          
          return (
            <div key={category}>
              <h3 className="text-base font-semibold mb-3 text-brand-text-dim border-b border-brand-muted pb-2">{category}s</h3>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item.id}>
                    <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-brand-bg transition-colors">
                      <input
                        type="checkbox"
                        checked={checkedItemIds.has(item.id)}
                        onChange={() => handleToggleCheck(item.id)}
                        className="h-4 w-4 rounded border-brand-muted/80 text-brand-primary focus:ring-brand-primary focus:ring-offset-brand-surface"
                      />
                      <span className="text-sm text-brand-text">{item.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
};
