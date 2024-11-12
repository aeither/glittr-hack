"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/utils";

interface GradientBackgroundProps {
	children: ReactNode;
	className?: string;
	colors?: string;
	animate?: boolean;
	duration?: number;
}

export function GradientBackground({
	children,
	className,
	colors = "from-purple-500 via-pink-500 to-red-500",
	animate = true,
	duration = 15,
}: GradientBackgroundProps) {
	return (
		<div className="relative h-full w-full overflow-hidden">
			<div
				className={cn(
					"absolute inset-0 bg-gradient-to-r",
					colors,
					animate && "animate-gradient-x",
					className,
				)}
				style={
					animate
						? {
								backgroundSize: "400% 400%",
								animation: `gradientAnimation ${duration}s ease infinite`,
							}
						: undefined
				}
			/>
			<div className="relative z-10">{children}</div>

			<style jsx>{`
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
		</div>
	);
}
