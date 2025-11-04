'use client';

import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";

export default function Footer() {
  const footerLinks = {
    shop: [
      { name: 'Новинки', href: '/catalog/products?new_arrival=true' },
      { name: 'Распродажа', href: '/catalog/products?on_sale=true' },
      { name: 'Коллекции', href: '#' },
      { name: 'Зима 2025', href: '#' },
    ],
    help: [
      { name: 'Служба поддержки', href: '/contact' },
      { name: 'Мой профиль', href: '/account' },
      { name: 'Соглашения', href: '#' },
      { name: 'Контакты', href: '/contact' },
    ],
    about: [
      { name: 'О нас', href: '/about' },
      { name: 'Сертификаты', href: '#' },
      { name: 'Новости', href: '#' },
      { name: 'Партнерство', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'Youtube' },
  ];

  const paymentMethods = ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="bg-black text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">
              Подпишитесь на рассылку
            </h2>
            <p className="text-gray-300 mb-6">
              Подпишитесь чтобы оставаться в курсе всех скидок, акций и новостей.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-4 py-3 bg-white text-black rounded-sm focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-black hover:bg-gray-200 transition-colors rounded-sm font-medium"
              >
                Подписаться
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <div className="mb-4">
              <Link href="/">
                <Image 
                  src="/logo_purple.svg" 
                  alt="SEREIN Logo" 
                  width={120} 
                  height={40}
                  className="h-auto"
                />
              </Link>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-colors rounded-full"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Каталог
            </h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Помощь
            </h4>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Nely Look
            </h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2025 Nely Look. All rights reserved.
            </p>
            <div className="flex items-center gap-4">

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}