'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FakenewsCreatorProps {
  onComplete: (score: number) => void;
}

const FakenewsCreator: React.FC<FakenewsCreatorProps> = ({ onComplete }) => {
  const [gameStage, setGameStage] = useState<'create' | 'preview' | 'reaction' | 'lesson'>('create');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Fake news content state
  const [headline, setHeadline] = useState('');
  const [selectedImage, setSelectedImage] = useState(1);
  const [date, setDate] = useState('today');
  const [content, setContent] = useState('');
  
  // Sample image paths - you would need to create these images
  const imagePaths = [
    '/images/fakenews/news1.jpg',
    '/images/fakenews/news2.jpg',
    '/images/fakenews/news3.jpg',
    '/images/fakenews/news4.jpg',
  ];

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePublish = () => {
    if (headline && content && date) {
      setGameStage('preview');
      // Add some points for creating the news
      setScore(prevScore => prevScore + 5);
    } else {
      alert('Por favor preencha todos os campos para criar a notícia.');
    }
  };

  const handleShowReactions = () => {
    setGameStage('reaction');
    // Add more points for proceeding to see reactions
    setScore(prevScore => prevScore + 10);
  };

  const handleShowLesson = () => {
    setGameStage('lesson');
    // Add more points for learning the lesson
    setScore(prevScore => prevScore + 15);
  };

  const handleFinishGame = () => {
    onComplete(score);
  };

  const handleCreateNew = () => {
    setHeadline('');
    setSelectedImage(1);
    setDate('today');
    setContent('');
    setGameStage('create');
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-900">Carregando...</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Create stage - where users create the fake news
  if (gameStage === 'create') {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Cria a Tua Notícia</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Escolhe um Título</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          >
            <option value="">Selecione um título</option>
            <option value="URGENTE! Descoberta Criatura Misteriosa no Parque da Cidade!">
              URGENTE! Descoberta Criatura Misteriosa no Parque da Cidade!
            </option>
            <option value="INCRÍVEL! Criança de 10 Anos Inventou Robô que Faz os Trabalhos de Casa!">
              INCRÍVEL! Criança de 10 Anos Inventou Robô que Faz os Trabalhos de Casa!
            </option>
            <option value="ALERTA! Escolas Vão Acabar com Férias de Verão!">
              ALERTA! Escolas Vão Acabar com Férias de Verão!
            </option>
            <option value="NOTÍCIA BOMBA! Famoso Jogador de Futebol Vai Treinar Equipa Local!">
              NOTÍCIA BOMBA! Famoso Jogador de Futebol Vai Treinar Equipa Local!
            </option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Escolhe uma Imagem</label>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div 
                key={index} 
                className={`border-2 rounded-lg overflow-hidden cursor-pointer ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'}`}
                onClick={() => setSelectedImage(index)}
              >
                <div className="aspect-video relative bg-gray-100">
                  {/* Replace with your actual images */}
                  <div className="h-full flex items-center justify-center text-gray-500">Imagem {index+1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Escolhe uma Data</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          >
            <option value="today">Hoje</option>
            <option value="yesterday">Ontem</option>
            <option value="lastWeek">Semana passada</option>
            <option value="madeUp">Data inventada (2025)</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Escolhe o Conteúdo</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          >
            <option value="">Selecione o conteúdo</option>
            <option value="Várias testemunhas afirmam ter visto uma criatura estranha no parque da cidade ontem à noite. Alguns dizem que parecia um alienígena, outros acham que era um animal desconhecido. As autoridades não confirmam a informação.">
              Testemunhas viram criatura estranha no parque...
            </option>
            <option value="Um jovem estudante criou um robô que faz todos os trabalhos de casa sozinho! Os professores estão preocupados e dizem que vão proibir a invenção nas escolas. Os pais estão divididos sobre o assunto.">
              Estudante criou robô que faz trabalhos de casa...
            </option>
            <option value="Fontes anónimas indicam que as escolas estão a planear acabar com as férias de verão para melhorar as notas dos alunos. A medida seria implementada já no próximo ano letivo!">
              Escolas planejam acabar com férias de verão...
            </option>
            <option value="Segundo informações exclusivas, uma estrela do futebol mundial estaria em negociações secretas para treinar a equipa local. O anúncio oficial deve acontecer nos próximos dias!">
              Famoso jogador vai treinar equipe local...
            </option>
          </select>
        </div>
        
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
          onClick={handlePublish}
        >
          Publicar Notícia
        </button>
      </div>
    );
  }

  // Preview stage - where users see their created fake news
  if (gameStage === 'preview') {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">A Tua Notícia</h2>
        
        <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
          {/* Fake news preview */}
          <div className="bg-gray-100 p-2 border-b border-gray-300 flex justify-between items-center">
            <span className="text-sm text-gray-600">NotíciasInventadas.pt</span>
            <span className="text-sm text-gray-600">
              {date === 'today' ? 'Hoje' : 
               date === 'yesterday' ? 'Ontem' : 
               date === 'lastWeek' ? 'Semana passada' : 
               '15 de Janeiro, 2025'}
            </span>
          </div>
          
          <div className="p-4">
            <h3 className="text-xl font-bold mb-3 text-gray-900">{headline}</h3>
            
            <div className="aspect-video bg-gray-200 mb-3 rounded">
              {/* Replace with actual image */}
              <div className="h-full flex items-center justify-center text-gray-500">Imagem {selectedImage+1}</div>
            </div>
            
            <p className="text-gray-700 mb-4">{content}</p>
            
            <div className="border-t border-gray-200 pt-3 flex justify-between text-sm text-gray-500">
              <span>👍 423 Gostos</span>
              <span>💬 98 Comentários</span>
              <span>↗️ 215 Partilhas</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button 
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition"
            onClick={handleCreateNew}
          >
            Editar
          </button>
          <button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
            onClick={handleShowReactions}
          >
            Ver Reações
          </button>
        </div>
      </div>
    );
  }

  // Reactions stage - where users see the impact of fake news
  if (gameStage === 'reaction') {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Reações à Tua Notícia</h2>
        
        <div className="p-4 mb-6 bg-gray-100 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-bold">{headline}</span>
            <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">Viral</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-lg font-bold text-blue-600">1,240</div>
              <div className="text-sm text-gray-600">pessoas partilharam</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-lg font-bold text-orange-600">312</div>
              <div className="text-sm text-gray-600">comentários</div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">Reações populares:</h3>
            <div className="flex space-x-2">
              <span className="bg-white px-3 py-1 rounded-full text-sm">😱 86</span>
              <span className="bg-white px-3 py-1 rounded-full text-sm">😡 64</span>
              <span className="bg-white px-3 py-1 rounded-full text-sm">😲 58</span>
              <span className="bg-white px-3 py-1 rounded-full text-sm">🤔 31</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-2">Comentários:</h3>
            <div className="space-y-2">
              <div className="bg-white p-2 rounded">
                <div className="text-xs text-gray-500">Maria123</div>
                <div>Isto não pode ser verdade! Vou partilhar com toda a gente!</div>
              </div>
              <div className="bg-white p-2 rounded">
                <div className="text-xs text-gray-500">Pedro87</div>
                <div>A minha prima disse que também viu! É verdade!</div>
              </div>
              <div className="bg-white p-2 rounded">
                <div className="text-xs text-gray-500">Ana_Racional</div>
                <div>Não acreditem em tudo o que leem na internet...</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-xl font-bold mb-2 text-orange-600">Impacto da Tua Notícia</h3>
          <p className="mb-4">Vê como a tua notícia falsa poderia espalhar-se rapidamente e causar reações fortes nas pessoas.</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Causar medo ou pânico desnecessário</li>
            <li>Prejudicar a reputação de pessoas inocentes</li>
            <li>Levar a decisões erradas baseadas em informações falsas</li>
            <li>Diminuir a confiança em fontes de informação verdadeiras</li>
          </ul>
          <div className="text-xl font-bold text-center text-orange-600 mt-4">
            Vês como pode ser perigoso?
          </div>
        </div>
        
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
          onClick={handleShowLesson}
        >
          Continuar para a Lição
        </button>
      </div>
    );
  }

  // Lesson stage - where users learn about the dangers of fake news
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Lição Aprendida</h2>
      
      <div className="p-5 mb-6 bg-blue-50 rounded-lg">
        <p className="text-lg mb-4">
          Criar notícias falsas pode parecer divertido, mas na vida real pode ter consequências sérias.
        </p>
        
        <h3 className="text-lg font-bold mb-2">Factos importantes:</h3>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li>Mais de 50% das pessoas não verificam se uma notícia é verdadeira antes de partilhar</li>
          <li>Uma notícia falsa espalha-se 6 vezes mais rápido que uma verdadeira nas redes sociais</li>
          <li>Notícias falsas já causaram pânico real, violência e até influenciaram eleições</li>
        </ul>
        
        <h3 className="text-lg font-bold mb-2">O que fazer antes de partilhar uma notícia:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Verificar a fonte da notícia</li>
          <li>Procurar a mesma informação em sites confiáveis</li>
          <li>Verificar a data da publicação</li>
          <li>Questionar se o conteúdo parece demasiado incrível para ser verdade</li>
        </ul>
      </div>
      
      <div className="flex flex-col space-y-3">
        <button 
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition"
          onClick={handleCreateNew}
        >
          Criar Nova Notícia
        </button>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
          onClick={handleFinishGame}
        >
          Finalizar Jogo
        </button>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Pontuação atual: {score}
      </div>
    </div>
  );
};

export default FakenewsCreator;