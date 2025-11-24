"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Indicator {
    id: string;
    code: string;
    description: string | null;
}

interface Standard {
    id: string;
    code: string;
    name: string;
    indicators?: Indicator[];
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
                "rounded-xl border bg-card transition-all duration-300 shadow-sm",
                isOpen
                    ? "ring-2 ring-primary/10 shadow-md border-primary/20"
                    : "hover:shadow-lg hover:shadow-accent/10 hover:border-accent/30"
            )}
        >
            <div
                className="p-4 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <Badge variant={isOpen ? "default" : "outline"} className="text-sm px-3 py-1 h-7 transition-colors">
                            {domain.code}
                        </Badge>
                        <span className="font-bold text-2xl text-foreground">{domain.name}</span>
                    </div>
                    {domain.standards && domain.standards.length > 0 && (
                        <div className={cn(
                            "text-muted-foreground transition-transform duration-200 bg-muted/50 rounded-full p-1",
                            isOpen && "rotate-180 bg-primary/10 text-primary"
                        )}>
                            <ChevronDown className="h-4 w-4" />
                        </div>
                    )}
                </div>
                {domain.description && (
                    <p className="text-base text-muted-foreground line-clamp-2 pl-1 mt-1">
                        {domain.description}
                    </p>
                )}
            </div>

            <div
                className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="overflow-hidden">
                    {domain.standards && domain.standards.length > 0 && (
                        <div className="px-4 pb-4 pt-0">
                            <div className="space-y-3 border-t pt-4">
                                {domain.standards.map((standard) => (
                                    <StandardItem key={standard.id} standard={standard} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StandardItem({ standard }: { standard: Standard }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={cn(
                "rounded-lg border transition-all duration-200",
                isOpen
                    ? "bg-muted/40 border-primary/20 shadow-sm"
                    : "bg-muted/30 border-transparent hover:border-accent/30 hover:bg-accent/5"
            )}
        >
            <div
                className="p-3 cursor-pointer flex items-start gap-3"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Badge
                    variant="secondary"
                    className="px-2.5 py-1 text-xs font-mono shrink-0 h-7 flex items-center bg-background border shadow-sm text-primary mt-0.5"
                >
                    {standard.code}
                </Badge>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-foreground leading-relaxed">
                            {standard.name}
                        </span>
                        {standard.indicators && standard.indicators.length > 0 && (
                            <div className={cn(
                                "text-muted-foreground transition-transform duration-200 ml-2 shrink-0",
                                isOpen && "rotate-180 text-primary"
                            )}>
                                <ChevronDown className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div
                className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="overflow-hidden">
                    {standard.indicators && standard.indicators.length > 0 && (
                        <div className="px-3 pb-3 pt-0">
                            <div className="pl-3 ml-2 border-l-2 border-primary/10 space-y-2 pt-1">
                                {standard.indicators.map((indicator) => (
                                    <div key={indicator.id} className="group flex items-start gap-2 text-base pl-3 py-2 rounded-md hover:bg-background/80 transition-colors">
                                        <span className="font-mono text-muted-foreground/80 shrink-0 font-bold text-base pt-0.5 group-hover:text-primary transition-colors">
                                            {indicator.code}
                                        </span>
                                        <span className="text-lg font-medium text-foreground leading-relaxed">
                                            {indicator.description}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
