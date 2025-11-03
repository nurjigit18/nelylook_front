'use client';

import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { useState, FormEvent } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here (API call, etc.)
    alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
    setFormData({ fullName: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Contact Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold mb-3">
                Мы будем рады
                <br />
                услышать от вас.
              </h1>
              <p className="text-gray-600 text-base">
                Если у вас есть вопрос о вашем заказе, совет по продукту или идея сотрудничества — мы здесь.
              </p>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-0.5">Адрес</h3>
                  <p className="text-gray-600 text-sm">
                    ул. Токтогула 123<br />
                    Бишкек, Кыргызстан
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-0.5">Телефон</h3>
                  <p className="text-gray-600 text-sm">
                    +996 555 123 456<br />
                    +996 777 987 654
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-0.5">Email</h3>
                  <p className="text-gray-600 text-sm">
                    info@nelylook.com<br />
                    support@nelylook.com
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-0.5">Время работы</h3>
                  <p className="text-gray-600 text-sm">
                    Пн-Пт: 10:00 - 20:00<br />
                    Сб-Вс: 10:00 - 18:00
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4">
              <h3 className="font-semibold text-base mb-3">Свяжитесь с нами</h3>
              <div className="flex gap-3">
                <a
                  href="https://wa.me/996555123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href="https://t.me/nelylook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                  aria-label="Telegram"
                >
                  <Send className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-xs font-medium text-gray-700 mb-1.5">
                  Полное имя
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Камилов Камил"
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="kamilb@gmail.com"
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-1.5">
                  Отзыв
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Введите сообщение"
                  required
                  rows={5}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-6 rounded-sm hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                Отправить отзыв
              </button>
            </form>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Отправляя эту форму, вы соглашаетесь с нашей{' '}
                <a href="#" className="text-black underline hover:no-underline">
                  политикой конфиденциальности
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}