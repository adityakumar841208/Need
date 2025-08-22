'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type ServiceItem = { name?: string; price?: number };

type ProviderResult = {
    _id?: string;
    name?: string;
    services?: ServiceItem[] | unknown;
    isVerified?: boolean;
    distance?: number | null;
    [k: string]: unknown;
};

type PostResult = {
    _id?: string;
    content?: { text?: string } | unknown;
    text?: string;
    tags?: string[] | unknown;
    user?: { name?: string } | string | unknown;
    userName?: string;
    [k: string]: unknown;
};

type CustomerResult = {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    [k: string]: unknown;
};

type AnyResult = ProviderResult | PostResult | CustomerResult | Record<string, unknown>;

interface SearchComponentProps {
    query: string;
    onBack: () => void;
    results: AnyResult[]; // mixed providers/posts/customers
    isLoading: boolean;
}

export default function SearchComponent({ query, onBack, results, isLoading }: SearchComponentProps) {
    const [committedQuery, setCommittedQuery] = useState("");

    useEffect(() => {
        if (!isLoading && query) setCommittedQuery(query);
    }, [isLoading, query]);

    // Detect item type heuristically
    const detectType = (item: AnyResult) => {
        if (!item) return 'unknown';
        // post: has content.text or tags
        if ('content' in item || 'tags' in item || 'text' in item) return 'post';
        // provider: services array or services prop
        if ('services' in item && Array.isArray((item as ProviderResult).services)) return 'provider';
        // customer: email or phone
        if ('email' in item || 'phone' in item) return 'customer';
        // fallback: user indicates a post-like object
        if ('user' in item || 'userId' in item) return 'post';
        return 'unknown';
    };

    // (type guards removed — detectType is used to differentiate items)

    const formatDistance = (meters?: number) => {
        if (meters === undefined || meters === null) return null;
        if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
        return `${Math.round(meters)} m`;
    };

    // Use server-provided results directly for display; filtering is handled via FilterOption + server
    const displayed = Array.isArray(results) ? [...results] : [];

    const handleShare = (id?: string) => console.log('Share', id);
    const handleView = (id?: string) => console.log('View', id);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Search Results {committedQuery && <span className="text-sm font-medium text-gray-600">for “{committedQuery}”</span>}</h2>
                <div className="flex items-center gap-3">
                    <Button onClick={onBack} disabled={isLoading}>Go back</Button>
                </div>
            </div>

            {/* Filters are handled by the page-level `FilterOption` component (moved to Explore page) */}

            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Searching...</span>
                </div>
            )}

            {!isLoading && displayed.length === 0 && committedQuery && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No results for “{committedQuery}”</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayed.map((item, idx) => {
                    const t = detectType(item);
                    if (t === 'provider') {
                        const prov = item as ProviderResult;
                        const service = Array.isArray(prov.services) && prov.services[0] ? (prov.services[0] as ServiceItem) : undefined;
                        return (
                            <div key={(prov._id ?? String(idx)) as React.Key} className="p-4 rounded-lg border shadow-sm flex flex-col md:flex-row justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{prov.name ?? 'Service Provider'}</h3>
                                    {service && <p className="text-sm">{service.name} • ₹{service.price}</p>}
                                    {prov.isVerified && <span className="inline-block mt-2 text-xs px-2 py-1 rounded">Verified</span>}
                                    {prov.distance !== undefined && prov.distance !== null && <p className="text-sm mt-2">{formatDistance(prov.distance)}</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" onClick={() => handleView(String(prov._id))}>View</Button>
                                    <Button size="sm" variant="ghost" onClick={() => handleShare(String(prov._id))}>Share</Button>
                                </div>
                            </div>
                        );
                    }

                    if (t === 'post') {
                        const post = item as PostResult;
                        // safely extract text from possible shapes
                        let text = '';
                        if (post.content && typeof post.content === 'object' && 'text' in (post.content as Record<string, unknown>) && typeof ((post.content as Record<string, unknown>)['text']) === 'string') {
                            text = (post.content as Record<string, unknown>)['text'] as string;
                        } else if (typeof post.text === 'string') {
                            text = post.text;
                        }

                        // safely extract author
                        let author = 'Post';
                        if (post.user && typeof post.user === 'object' && 'name' in (post.user as Record<string, unknown>) && typeof ((post.user as Record<string, unknown>)['name']) === 'string') {
                            author = (post.user as Record<string, unknown>)['name'] as string;
                        } else if (typeof post.user === 'string') {
                            author = post.user;
                        } else if (typeof post.userName === 'string') {
                            author = post.userName;
                        }
                        return (
                            <div key={(post._id ?? String(idx)) as React.Key} className="p-4 rounded-lg border shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium">{author}</h4>
                                        <p className="text-sm line-clamp-3 mt-1">{text}</p>
                                        {Array.isArray(post.tags) && <div className="flex gap-2 mt-2">{(post.tags as unknown as string[]).slice(0,3).map((tag:string, i:number) => <span key={i} className="text-xs px-2 py-1 rounded">#{tag}</span>)}</div>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button size="sm" onClick={() => handleView(String(post._id))}>Open</Button>
                                        <Button size="sm" variant="ghost" onClick={() => handleShare(String(post._id))}>Share</Button>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    if (t === 'customer') {
                        const cust = item as CustomerResult;
                        return (
                            <div key={(cust._id ?? String(idx)) as React.Key} className="p-4 rounded-lg border shadow-sm flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">{cust.name ?? 'Customer'}</h3>
                                    {cust.email && <p className="text-sm">{cust.email}</p>}
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleView(String(cust._id))}>View</Button>
                                </div>
                            </div>
                        );
                    }

                    // fallback
                    return (
                        <div key={(String(((item as Record<string, unknown>)['_id'] as string) ?? idx)) as React.Key} className="p-4 rounded-lg border shadow-sm bg-white">
                            <pre className="text-xs text-gray-600 max-h-24 overflow-auto">{JSON.stringify(item, null, 2)}</pre>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}