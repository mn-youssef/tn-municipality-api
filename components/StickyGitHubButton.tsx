"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { GitHubIcon } from "./icons/GitHubIcon";

interface StickyGitHubButtonProps {
  repoUrl?: string;
  className?: string;
}

export function StickyGitHubButton({
  repoUrl = "https://github.com/youssef-of-web/tn-municipality-api",
  className,
}: StickyGitHubButtonProps) {
  return (
    <motion.div
      className={className}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <motion.a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Star the project on GitHub"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 50,
          padding: "16px 20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "white",
          fontWeight: 600,
          fontSize: 16,
          textDecoration: "none",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
        }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
          y: -5,
        }}
        whileTap={{ scale: 0.95 }}
        whileInView={{
          rotate: [0, -10, 10, 0],
          transition: { duration: 0.5, repeat: Infinity, repeatDelay: 3 },
        }}
      >
        <GitHubIcon size={20} />
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          Star
          <Star size={16} style={{ fill: "white" }} />
        </span>
      </motion.a>
    </motion.div>
  );
}
