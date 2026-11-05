'use client';

import Image from 'next/image';
import styles from './ui.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NAV } from '@/content/cheetah';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const mobilePanel = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (mobile) mobileButton.current?.focus();
      const trigger = navRef.current?.querySelector<HTMLButtonElement>('button[aria-expanded="true"]');
      if (openMenu) trigger?.focus();
      setOpenMenu(null);
      setMobile(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobile, openMenu]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobile]);

  useEffect(() => {
    if (!mobile) return;
    mobilePanel.current?.querySelector<HTMLElement>('a')?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const links = mobilePanel.current?.querySelectorAll<HTMLElement>('a, button');
      const last = links?.[links.length - 1];
      if (event.shiftKey && document.activeElement === mobileButton.current) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); mobileButton.current?.focus();
      }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [mobile]);

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    const resize = () => { if (window.innerWidth >= 1024) setMobile(false); };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) setOpenMenu(null);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [openMenu]);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  const isActive = (href: string) => pathname === href || pathname === href.replace(/\/$/, '');

  return (
    <header
      className={`${styles.header} fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || mobile || openMenu
          ? 'border-b border-white/[0.07] bg-ink-900/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="relative block h-9 w-9 overflow-hidden rounded-full bg-white ring-1 ring-white/15">
            <Image src="/logo-cheetah-128.webp" alt="" width={36} height={36} className="h-full w-full object-cover" priority />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[1.0625rem] font-extrabold tracking-tight text-paper">
              CheetahSoft
            </span>
            <span className="mt-[3px] block font-mono text-[0.5625rem] uppercase tracking-[0.3em] text-steel-400 transition-colors group-hover:text-volt">
              Cost · Time · Doc
            </span>
          </span>
          <span className="sr-only"> — accueil</span>
        </Link>

        {/* Navigation desktop */}
        <nav ref={navRef} aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) =>
            'enfants' in item && item.enfants ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  cancelClose();
                  setOpenMenu(item.label);
                }}
                onMouseLeave={scheduleClose}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(null);
                }}
              >
                <button
                  type="button"
                  aria-expanded={openMenu === item.label}
                  aria-haspopup="true"
                  onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                  className={`flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                    openMenu === item.label ? 'text-volt' : 'text-steel-200 hover:text-paper'
                  }`}
                >
                  {item.label}
                  <svg
                    width="9"
                    height="6"
                    viewBox="0 0 9 6"
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${openMenu === item.label ? 'rotate-180' : ''}`}
                  >
                    <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.4" fill="none" />
                  </svg>
                </button>

                {openMenu === item.label && (
                  <div
                    className={`${styles.dropdown} absolute left-0 top-full w-[22rem] pt-3`}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="panel corner-ticks overflow-hidden p-1.5">
                      {item.enfants.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="group block rounded-sm px-3.5 py-3 transition-colors hover:bg-white/[0.045]"
                        >
                          <span className="block text-sm font-semibold text-paper transition-colors group-hover:text-volt">
                            {child.label}
                          </span>
                          <span className="mt-0.5 block text-xs text-steel-400">{child.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href) ? 'text-volt' : 'text-steel-200 hover:text-paper'
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:block">
          <Link href="/contact/" className="btn btn-primary !min-h-0 !px-4 !py-2.5 !text-[0.8125rem]">
            Demander une démonstration
          </Link>
        </div>

        {/* Bascule mobile */}
        <button
          type="button"
          className="-mr-2 flex h-12 w-12 items-center justify-center text-paper lg:hidden"
          aria-expanded={mobile}
          ref={mobileButton}
          aria-controls="menu-mobile"
          aria-label={mobile ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setMobile((v) => !v)}
        >
          <span className="relative block h-3.5 w-6">
            <span
              className={`absolute left-0 block h-px w-full bg-current transition-transform duration-300 ${
                mobile ? 'top-1.5 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-px w-full bg-current transition-opacity duration-200 ${
                mobile ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-full bg-current transition-transform duration-300 ${
                mobile ? 'top-1.5 -rotate-45' : 'top-3'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Panneau mobile */}
      {mobile && (
        <div
          id="menu-mobile"
          ref={mobilePanel}
          className={`${styles.mobileMenu} h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-white/[0.07] bg-ink-900 lg:hidden`}
        >
          <nav aria-label="Navigation mobile" className="shell flex flex-col py-6">
            {NAV.map((item) => (
              <div key={item.label} className="border-b border-white/[0.06] py-1">
                <Link
                  href={item.href}
                  className="flex min-h-[52px] items-center font-display text-xl font-bold tracking-tight text-paper"
                >
                  {item.label}
                </Link>
                {'enfants' in item && item.enfants && (
                  <div className="mb-3 flex flex-col gap-0.5 pl-3">
                    {item.enfants.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="flex min-h-[44px] items-center text-sm text-steel-300"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/contact/" className="btn btn-primary mt-7 w-full">
              Demander une démonstration
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
