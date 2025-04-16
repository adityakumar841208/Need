import { motion } from "framer-motion";

export default function Skeleton() {
    return (
        Array(4)
            .fill(0)
            .map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="mt-2 overflow-hidden flex flex-col border shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300 relative bg-card text-card-foreground animate-pulse"
                    style={{ height: '100%', width: '100%' }}
                >
                    {/* Header */}
                    <div className="flex flex-row items-center gap-4 p-4">
                        <div className="h-10 w-10 rounded-full bg-muted/40"></div>
                        <div className="flex flex-col flex-1">
                            <div className="h-4 w-24 bg-muted/40 rounded mb-2"></div>
                            <div className="h-3 w-16 bg-muted/40 rounded"></div>
                        </div>
                    </div>
                    {/* Content */}
                    <div className="px-4 pb-4 flex-grow space-y-2">
                        <div className="h-4 w-3/4 bg-muted/40 rounded"></div>
                        <div className="h-4 w-5/6 bg-muted/40 rounded"></div>
                        <div className="h-40 bg-muted/40 rounded-md mt-4"></div>
                    </div>
                    {/* Footer */}
                    <div className="flex justify-between border-t py-2.5 bg-background/50 px-4">
                        <div className="h-4 w-16 bg-muted/40 rounded"></div>
                        <div className="h-4 w-16 bg-muted/40 rounded"></div>
                        <div className="h-4 w-16 bg-muted/40 rounded"></div>
                        <div className="h-4 w-16 bg-muted/40 rounded"></div>
                    </div>
                </motion.div>
            )
        )
    );
}