'use client';
// This will be a loding skeleton component
import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-pulse space-y-4">
            <div className="w-64 h-8 bg-gray-300 rounded"></div>
            <div className="w-48 h-6 bg-gray-300 rounded"></div>
            <div className="w-64 h-6 bg-gray-300 rounded"></div>
            <div className="w-full h-64 bg-gray-300 rounded"></div>
            <div className="w-full h-64 bg-gray-300 rounded"></div>
            <div className="w-full h-64 bg-gray-300 rounded"></div>
        </div>
    </div>
  );
}

