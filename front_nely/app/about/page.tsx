'use client';

import PageTransition from '@/components/PageTransition';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <PageTransition>

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl font-semibold mb-6 tracking-tight">
          О нас
        </h1>

        <p className="text-gray-700 text-base leading-relaxed mb-8">
          <strong>NelyLook</strong> — это современный бренд женской одежды, созданный с любовью к
          элегантности, комфорту и индивидуальности. Мы стремимся объединить в наших коллекциях
          минимализм, утонченность и повседневное удобство, чтобы каждая женщина чувствовала себя
          уверенно и естественно в любой ситуации.
        </p>

        <p className="text-gray-700 text-base leading-relaxed mb-8">
          Каждая вещь разрабатывается с вниманием к деталям: от выбора тканей и силуэтов до финальных
          штрихов. Мы сотрудничаем с локальными фабриками и мастерами, поддерживая развитие
          производства и высокое качество изделий.
        </p>

        <p className="text-gray-700 text-base leading-relaxed mb-8">
          Мы верим, что мода — это не только про одежду, но и про внутреннее состояние. Поэтому
          <strong> NelyLook </strong> создаёт пространство, где стиль становится естественным
          продолжением личности.
        </p>

        <div className="mt-12">
          <h2 className="text-2xl font-medium mb-4">Наши ценности</h2>
          <ul className="text-gray-700 text-base space-y-3 text-left sm:text-center">
            <li>— Уважение к женщине и её индивидуальности</li>
            <li>— Ответственный подход к производству</li>
            <li>— Простота и элегантность в каждой детали</li>
            <li>— Прозрачность и доверие к нашим клиентам</li>
          </ul>
        </div>

        <div className="mt-16">
          <p className="text-gray-600 text-sm">
            <em>“Красота в простоте. Уверенность — в гармонии.”</em>
          </p>
        </div>
      </main>

    </PageTransition>
  );
}
