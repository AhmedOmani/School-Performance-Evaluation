"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Standard {
    id: string;
    code: string;
    name: string;
}

interface Domain {
    id: string;
    code: string;
    name: string;
    description: string | null;
    standards: Standard[];
}

interface DomainItemProps {
    domain: Domain;
}

export function DomainItem({ domain }: DomainItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={cn(
                "rounded-lg border bg-card transition-all duration-200",
                isOpen ? "bg-accent/50 ring-1 ring-primary/20" : "hover:bg-accent/50"
            )}
        >
            <div
                className="p-3 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{domain.name}</span>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] h-5">
                            {domain.code}
                        </Badge>
                        {domain.standards && domain.standards.length > 0 && (
                            <div className="text-muted-foreground">
                                {isOpen ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {domain.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {domain.description}
                    </p>
                )}
            </div>

            {isOpen && domain.standards && domain.standards.length > 0 && (
                <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-1 fade-in-0 duration-200">
                    <div className="space-y-1.5 border-t pt-2">
                        {domain.standards.map((standard) => (
                            <div key={standard.id} className="flex items-start gap-2 text-xs">
                                <Badge
                                    variant="secondary"
                                    className="px-1.5 py-0 text-[10px] font-mono shrink-0 h-5 flex items-center"
                                >
                                    {standard.code}
                                </Badge>
                                <span className="text-muted-foreground leading-tight pt-0.5">
                                    {standard.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
