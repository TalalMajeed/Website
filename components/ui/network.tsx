"use client";

import { useEffect, useState } from "react";

type Node = {
  id: string;
  label: string;
  href: string;
  x: number;
  y: number;
};

type Edge = {
  from: string;
  to: string;
};

const links = [
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/talalmajeed" },
  { id: "instagram", label: "Instagram", href: "https://instagram.com/talalmajeed" },
  { id: "github", label: "GitHub", href: "https://github.com/TalalMajeed" },
  { id: "mail", label: "Mail", href: "mailto:m.talal.majeed@gmail.com" },
  { id: "upwork", label: "Upwork", href: "#" },
  { id: "resume", label: "Resume", href: "#" },
];

function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

function makeNetwork() {
  const centerX = 50;
  const centerY = 50;
  const radiusX = 36;
  const radiusY = 34;
  const angleStep = (2 * Math.PI) / links.length;
  const angleJitter = angleStep * 0.25;

  const nodes = links.map((link, index) => {
    const angle = angleStep * index - Math.PI / 2 + randomBetween(-angleJitter * 100, angleJitter * 100) / 100;
    const radiusJitter = randomBetween(85, 100) / 100;

    return {
      ...link,
      x: Math.round(centerX + Math.cos(angle) * radiusX * radiusJitter),
      y: Math.round(centerY + Math.sin(angle) * radiusY * radiusJitter),
    };
  });
  const edges: Edge[] = [];

  nodes.forEach((node, index) => {
    edges.push({ from: node.id, to: nodes[(index + 1) % nodes.length].id });
  });

  while (edges.length < 9) {
    const from = nodes[randomBetween(0, nodes.length - 1)].id;
    const to = nodes[randomBetween(0, nodes.length - 1)].id;

    if (from !== to && !edges.some((edge) => edge.from === from && edge.to === to)) {
      edges.push({ from, to });
    }
  }

  return { nodes, edges };
}

function NetworkIcon({ id }: { id: string }) {
  if (id === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="5" width="14" height="14" rx="4" />
        <circle cx="12" cy="12" r="3" />
        <circle cx="16.5" cy="7.5" r="1" />
      </svg>
    );
  }

  if (id === "mail") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="6" width="16" height="12" />
        <path d="M5 7l7 6 7-6" />
      </svg>
    );
  }

  if (id === "resume") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4h7l3 3v13H7z" />
        <path d="M14 4v4h4M9 12h6M9 16h6" />
      </svg>
    );
  }

  if (id === "github") {
    return <span aria-hidden="true">GH</span>;
  }

  if (id === "linkedin") {
    return <span aria-hidden="true">in</span>;
  }

  return <span aria-hidden="true">up</span>;
}

export function ContactNetwork() {
  const [network, setNetwork] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setNetwork(makeNetwork()));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!network) {
    return <div className="contact-network reveal delay-1" aria-hidden="true" />;
  }

  const nodeById = new Map(network.nodes.map((node) => [node.id, node]));

  return (
    <div className="contact-network reveal delay-1" aria-label="Contact links network">
      <svg className="contact-network-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {network.edges.map((edge) => {
          const from = nodeById.get(edge.from);
          const to = nodeById.get(edge.to);

          if (!from || !to) return null;

          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
            />
          );
        })}
      </svg>

      {network.nodes.map((node) => (
        <a
          className="contact-node"
          data-link
          href={node.href}
          key={node.id}
          rel={node.href.startsWith("http") ? "noopener" : undefined}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          target={node.href.startsWith("http") ? "_blank" : undefined}
        >
          <span className="contact-node-icon">
            <NetworkIcon id={node.id} />
          </span>
          <span>{node.label}</span>
        </a>
      ))}
    </div>
  );
}
