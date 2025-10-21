import React, { useState, useMemo, useCallback } from 'react';
import { BUDGET_TEMPLATE_STRUCTURE } from '../../constants';
import { ChevronDownIcon, PlusIcon, TrashIcon } from '../icons';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';

export const BudgetBoard = ({ board, updateBoard }: BoardComponentProps) => {
    // Local types for budget structure
    type BudgetItem = { id: string; description: string; quantity: number; rate: number; isCustom: boolean; };
    type BudgetCategory = { title: string; items: BudgetItem[]; };
    type Budget = { categories: BudgetCategory[]; contingencyPercentage: number; };
    
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
        const initialState: Record<string, boolean> = {};
        BUDGET_TEMPLATE_STRUCTURE.forEach(cat => initialState[cat.category] = true);
        return initialState;
    });

    const initialBudget = useMemo<Budget>(() => {
        try {
            const content = board.content || '{}';
            const parsed = JSON.parse(content);
            if (parsed && Array.isArray(parsed.categories)) {
                return parsed;
            }
        } catch (e) { /* Fallback to default */ }
        
        return {
            categories: BUDGET_TEMPLATE_STRUCTURE.map(cat => ({
                title: cat.category,
                items: cat.items.map(item => ({
                    id: `item-${Date.now()}-${Math.random()}`,
                    description: item.name,
                    quantity: 1,
                    rate: 0,
                    isCustom: false,
                }))
            })),
            contingencyPercentage: 10,
        };
    }, [board.content]);

    const [budget, setBudget] = useState<Budget>(initialBudget);

    const handleUpdate = useCallback((newBudget: Budget) => {
        setBudget(newBudget);
        updateBoard(board.id, { content: JSON.stringify(newBudget) });
    }, [board.id, updateBoard]);

    const totals = useMemo(() => {
        let subtotal = 0;
        const categoryTotals: Record<string, number> = {};

        budget.categories.forEach(category => {
            const categoryTotal = category.items.reduce((acc, item) => {
                const itemTotal = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                return acc + itemTotal;
            }, 0);
            categoryTotals[category.title] = categoryTotal;
            subtotal += categoryTotal;
        });

        const contingencyAmount = subtotal * ((Number(budget.contingencyPercentage) || 0) / 100);
        const grandTotal = subtotal + contingencyAmount;
        return { subtotal, grandTotal, contingencyAmount, categoryTotals };
    }, [budget]);

    const handleItemChange = (catIndex: number, itemIndex: number, field: 'description' | 'quantity' | 'rate', value: string | number) => {
        const newBudget = { ...budget, categories: [...budget.categories] };
        const newCategory = { ...newBudget.categories[catIndex], items: [...newBudget.categories[catIndex].items] };
        newCategory.items[itemIndex] = { ...newCategory.items[itemIndex], [field]: value };
        newBudget.categories[catIndex] = newCategory;
        handleUpdate(newBudget);
    };

    const addCustomItem = (catIndex: number) => {
        const newBudget = { ...budget, categories: [...budget.categories] };
        const newCategory = { ...newBudget.categories[catIndex], items: [...newBudget.categories[catIndex].items] };
        newCategory.items.push({
            id: `item-${Date.now()}`,
            description: '',
            quantity: 1,
            rate: 0,
            isCustom: true,
        });
        newBudget.categories[catIndex] = newCategory;
        handleUpdate(newBudget);
    };

    const removeItem = (catIndex: number, itemIndex: number) => {
        const newBudget = { ...budget, categories: [...budget.categories] };
        const newCategory = { ...newBudget.categories[catIndex], items: [...newBudget.categories[catIndex].items] };
        newCategory.items.splice(itemIndex, 1);
        newBudget.categories[catIndex] = newCategory;
        handleUpdate(newBudget);
    };
    
    const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    return (
        <div className="text-sm">
            <div className="space-y-4">
                {budget.categories.map((category, catIndex) => (
                    <div key={category.title} className="bg-brand-bg/50 rounded-md border border-brand-muted/70">
                        <button
                            className="w-full flex justify-between items-center p-3 text-left font-semibold"
                            onClick={() => setOpenCategories(prev => ({...prev, [category.title]: !prev[category.title]}))}
                        >
                            <span>{category.title}</span>
                             <span className="flex items-center gap-4">
                                <span className="text-brand-text-dim font-medium">{currencyFormatter.format(totals.categoryTotals[category.title] || 0)}</span>
                                <ChevronDownIcon className={`w-5 h-5 transition-transform ${openCategories[category.title] ? 'rotate-180' : ''}`} />
                            </span>
                        </button>
                        {openCategories[category.title] && (
                            <div className="p-3 border-t border-brand-muted/70">
                                <div className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-x-4 text-xs text-brand-text-dim font-bold mb-2 px-2">
                                    <span>Description</span>
                                    <span className="text-right">Qty</span>
                                    <span className="text-right">Rate</span>
                                    <span className="text-right">Total</span>
                                    <span></span>
                                </div>
                                {category.items.map((item, itemIndex) => (
                                    <div key={item.id} className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-x-4 items-center group hover:bg-brand-muted/50 rounded p-1">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(catIndex, itemIndex, 'description', e.target.value)}
                                            readOnly={!item.isCustom}
                                            placeholder="Custom item..."
                                            className={`w-full bg-transparent p-1 rounded ${item.isCustom ? 'border border-transparent focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/30' : 'font-medium'}`}
                                        />
                                        <input type="number" value={item.quantity} onChange={e => handleItemChange(catIndex, itemIndex, 'quantity', parseFloat(e.target.value))} className="w-full bg-brand-surface border border-brand-muted/80 p-1 rounded text-right focus:outline-none focus:ring-1 focus:ring-brand-primary/50" />
                                        <input type="number" value={item.rate} onChange={e => handleItemChange(catIndex, itemIndex, 'rate', parseFloat(e.target.value))} className="w-full bg-brand-surface border border-brand-muted/80 p-1 rounded text-right focus:outline-none focus:ring-1 focus:ring-brand-primary/50" />
                                        <span className="text-right p-1 text-brand-text-dim">{currencyFormatter.format((item.quantity || 0) * (item.rate || 0))}</span>
                                        <button onClick={() => removeItem(catIndex, itemIndex)} className="text-red-500/70 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                <button onClick={() => addCustomItem(catIndex)} className="text-xs font-semibold text-brand-primary hover:text-brand-secondary mt-2 flex items-center gap-1 px-1 py-2">
                                    <PlusIcon className="w-4 h-4"/> Add Custom Item
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 border-t-2 border-brand-muted pt-4 space-y-2 text-right">
                <div className="flex justify-end items-center gap-4">
                    <span className="font-semibold text-brand-text-dim">Subtotal</span>
                    <span className="font-bold w-40 text-lg">{currencyFormatter.format(totals.subtotal)}</span>
                </div>
                 <div className="flex justify-end items-center gap-4">
                    <label className="font-semibold text-brand-text-dim flex items-center gap-2">
                        Contingency
                        <input type="number" value={budget.contingencyPercentage} onChange={e => handleUpdate({...budget, contingencyPercentage: parseFloat(e.target.value)})} className="w-16 bg-brand-surface border border-brand-muted/80 p-1 rounded text-right focus:outline-none focus:ring-1 focus:ring-brand-primary/50" />
                        %
                    </label>
                    <span className="font-medium w-40">{currencyFormatter.format(totals.contingencyAmount)}</span>
                </div>
                 <div className="flex justify-end items-center gap-4 pt-2 border-t border-brand-muted mt-2">
                    <span className="font-extrabold text-brand-text text-xl">Grand Total</span>
                    <span className="font-extrabold w-40 text-xl text-brand-primary">{currencyFormatter.format(totals.grandTotal)}</span>
                </div>
            </div>
        </div>
    );
};
