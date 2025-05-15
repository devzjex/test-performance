'use client';
import Link from 'next/link';

export default function MyLink({ prefetch = true, children, ...props }) {
  return (
    <Link prefetch={prefetch} {...props}>
      {children}
    </Link>
  );
}
