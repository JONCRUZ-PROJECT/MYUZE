import React from 'react';
import { useParams } from 'react-router-dom';

const Player = () => {
  const { storeId } = useParams<{ storeId: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-myuze-black to-myuze-purple text-myuze-white p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Player da Loja</h1>
        <p className="text-xl text-gray-300 mb-8">
          Loja ID: <span className="font-semibold text-myuze-purple">{storeId}</span>
        </p>
        <p className="text-lg text-gray-400">
          Este é o player de música. A reprodução é controlada automaticamente.
        </p>
        {/* Player UI will go here */}
      </div>
    </div>
  );
};

export default Player;