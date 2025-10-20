import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-myuze-black to-myuze-purple text-myuze-white font-sans flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 px-4 md:py-32 flex-grow">
        <div className="absolute inset-0 bg-myuze-black opacity-70"></div> {/* Dark overlay */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <img src="/logo/logomyuzew.png" alt="Myuze Logo" className="h-24 md:h-32 mx-auto mb-4" />
          <p className="text-2xl md:text-3xl mb-8 font-light">
            A trilha sonora inteligente da sua marca
          </p>
          <Link to="/auth">
            <Button className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white px-8 py-6 text-lg rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              Testar agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Product Explanation Section */}
      <section className="py-16 px-4 bg-myuze-black text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-semibold mb-6 text-myuze-white">
            Música ambiente que aumenta as vendas e melhora a experiência do cliente
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Com Myuze, você transforma o ambiente da sua loja em uma experiência sonora envolvente.
            Nossa plataforma inteligente seleciona as melhores músicas para o seu público,
            garantindo que cada nota contribua para um clima perfeito e um aumento nas suas vendas.
          </p>
        </div>
      </section>

      {/* Vantagens Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-myuze-purple to-myuze-black text-myuze-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-myuze-gray-translucent p-8 rounded-lg shadow-xl backdrop-blur-sm">
            <h3 className="text-2xl font-semibold mb-4">Automação Total</h3>
            <p className="text-gray-200">
              Defina horários e deixe o Myuze cuidar da sua trilha sonora.
              Música perfeita, sempre no momento certo, sem intervenção manual.
            </p>
          </div>
          <div className="bg-myuze-gray-translucent p-8 rounded-lg shadow-xl backdrop-blur-sm">
            <h3 className="text-2xl font-semibold mb-4">Playlists Personalizadas</h3>
            <p className="text-gray-200">
              Crie playlists por estilo, humor e BPM. Adapte a música ao perfil da sua marca
              e ao fluxo de clientes ao longo do dia.
            </p>
          </div>
          <div className="bg-myuze-gray-translucent p-8 rounded-lg shadow-xl backdrop-blur-sm">
            <h3 className="text-2xl font-semibold mb-4">Anúncios Programáveis</h3>
            <p className="text-gray-200">
              Integre anúncios de 30 segundos a cada 15 minutos, promovendo ofertas
              e comunicados importantes de forma estratégica e não invasiva.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-myuze-black text-center text-gray-400">
        <div className="max-w-5xl mx-auto">
          <p className="mb-4">&copy; {new Date().getFullYear()} Myuze. Todos os direitos reservados.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:text-myuze-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-myuze-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-myuze-white transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;