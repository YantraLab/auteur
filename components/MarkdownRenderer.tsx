import React from 'react';

export const MarkdownRenderer = ({ content }: { content: string }) => {
    const lines = content.split('\n');
    const titleLine = lines.find(line => line.startsWith('#'));
    const contentLines = lines.filter(line => !line.startsWith('#')).join('\n').split('\n');

    return (
        <div className="prose max-w-none text-brand-text text-sm">
            {titleLine && <h1 className="text-xl font-extrabold text-brand-secondary mb-4 pb-2 border-b-2 border-brand-muted">{titleLine.substring(2)}</h1>}
            {contentLines.map((line, index) => {
                if (line.trim() === '') return null;
                if (line.startsWith('### ')) return <h3 key={index} className="text-base font-semibold mt-4 mb-1 text-brand-text-dim">{line.substring(4)}</h3>;
                if (line.startsWith('## ')) return <h2 key={index} className="text-lg font-bold mt-6 mb-2 text-brand-text">{line.substring(3)}</h2>;
                if (line.startsWith('> ')) return <blockquote key={index} className="border-l-4 border-brand-primary/50 pl-4 py-1 italic text-brand-text-dim my-3 bg-brand-bg/50 rounded-r-md">{line.substring(2)}</blockquote>;
                const cleanedLine = line.replace(/^\s*-\s/, '');
                const isListItem = line.match(/^\s*-\s/);

                const parts = cleanedLine.split(/(\*\*.*?\*\*|\*.*?\*)/g).filter(Boolean);
                const renderedParts = parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
                    if (part.startsWith('*') && part.endsWith('*')) return <em key={i} className="italic">{part.slice(1, -1)}</em>;
                    return part;
                });
                
                if(isListItem) return <li key={index} className="ml-5 list-disc my-1">{renderedParts}</li>;

                return <p key={index} className="my-2 leading-relaxed">{renderedParts}</p>;
            })}
        </div>
    );
};
