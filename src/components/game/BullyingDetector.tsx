'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Post {
  id: string;
  author: string;
  content: string;
  avatar: string;
  timestamp: string;
  likes: number;
  isBullying: boolean;
  explanation: string;
  checked?: boolean;
}

export default function BullyingDetector({ onComplete }: { onComplete: (score: number) => void }) {
  const bullyingT = useTranslations('bullying');
  const [posts, setPosts] = useState<Post[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [postsChecked, setPostsChecked] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  // Initialize posts from translations
  useEffect(() => {
    // Create an array with all posts from translations
    const initialPosts: Post[] = [
      {
        id: 'post1',
        author: bullyingT('posts.post1.author'),
        content: bullyingT('posts.post1.content'),
        avatar: '/images/avatars/avatar1.png',
        timestamp: bullyingT('posts.post1.timestamp'),
        likes: 5,
        isBullying: true,
        explanation: bullyingT('posts.post1.explanation')
      },
      {
        id: 'post2',
        author: bullyingT('posts.post2.author'),
        content: bullyingT('posts.post2.content'),
        avatar: '/images/avatars/avatar2.png',
        timestamp: bullyingT('posts.post2.timestamp'),
        likes: 12,
        isBullying: false,
        explanation: bullyingT('posts.post2.explanation')
      },
      {
        id: 'post3',
        author: bullyingT('posts.post3.author'),
        content: bullyingT('posts.post3.content'),
        avatar: '/images/avatars/avatar3.png',
        timestamp: bullyingT('posts.post3.timestamp'),
        likes: 23,
        isBullying: true,
        explanation: bullyingT('posts.post3.explanation')
      },
      {
        id: 'post4',
        author: bullyingT('posts.post4.author'),
        content: bullyingT('posts.post4.content'),
        avatar: '/images/avatars/avatar4.png',
        timestamp: bullyingT('posts.post4.timestamp'),
        likes: 2,
        isBullying: false,
        explanation: bullyingT('posts.post4.explanation')
      },
      {
        id: 'post5',
        author: bullyingT('posts.post5.author'),
        content: bullyingT('posts.post5.content'),
        avatar: '/images/avatars/avatar5.png',
        timestamp: bullyingT('posts.post5.timestamp'),
        likes: 45,
        isBullying: true,
        explanation: bullyingT('posts.post5.explanation')
      },
      {
        id: 'post6',
        author: bullyingT('posts.post6.author'),
        content: bullyingT('posts.post6.content'),
        avatar: '/images/avatars/avatar6.png',
        timestamp: bullyingT('posts.post6.timestamp'),
        likes: 9,
        isBullying: true,
        explanation: bullyingT('posts.post6.explanation')
      },
      {
        id: 'post7',
        author: bullyingT('posts.post7.author'),
        content: bullyingT('posts.post7.content'),
        avatar: '/images/avatars/avatar7.png',
        timestamp: bullyingT('posts.post7.timestamp'),
        likes: 17,
        isBullying: false,
        explanation: bullyingT('posts.post7.explanation')
      }
    ];

    // Shuffle posts
    const shuffledPosts = [...initialPosts].sort(() => 0.5 - Math.random());
    setPosts(shuffledPosts);
  }, [bullyingT]);

  // Handle clicking on a post
  const handlePostClick = (id: string) => {
    console.log('Post clicked:', id); // Debug log
    
    if (gameOver) return;

    // Find the post
    const clickedPost = posts.find(post => post.id === id);
    if (!clickedPost) return;
    
    // Se já está selecionado, desmarque
    if (clickedPost.checked) {
      setSelectedPosts(prev => prev.filter(postId => postId !== id));
      
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === id) {
            return {
              ...post,
              checked: false
            };
          }
          return post;
        })
      );
      
      setPostsChecked(prev => prev - 1);
    } else {
      // Se não está selecionado, marque
      setSelectedPosts(prev => [...prev, id]);
      
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === id) {
            return {
              ...post,
              checked: true
            };
          }
          return post;
        })
      );
      
      setPostsChecked(prev => prev + 1);
    }
    
    // Mostrar botão de finalizar assim que houver pelo menos uma seleção
    if (postsChecked > 0 || !clickedPost.checked) {
      setShowResults(true);
    } else if (postsChecked === 1 && clickedPost.checked) {
      setShowResults(false);
    }
  };

  // Finish the game and calculate final score
  const finishGame = () => {
    setGameOver(true);
    
    // Calculate score based on correct identifications
    let newScore = 0;
    let correctlyIdentified = 0;
    const totalBullyingPosts = posts.filter(post => post.isBullying).length;
    
    // Calculate which selected posts were actually bullying (correct identifications)
    posts.forEach(post => {
      if (selectedPosts.includes(post.id)) {
        if (post.isBullying) {
          // Correctly identified bullying post
          newScore += 10;
          correctlyIdentified++;
        } else {
          // Incorrectly identified non-bullying post
          newScore = Math.max(0, newScore - 5);
        }
      }
    });
    
    // Bonus for accuracy
    const accuracyScore = totalBullyingPosts > 0 ? Math.round((correctlyIdentified / totalBullyingPosts) * 20) : 0;
    const finalScore = newScore + accuracyScore;
    
    setScore(finalScore);
    
    // Wait a bit to show results before completing
    setTimeout(() => {
      onComplete(finalScore);
    }, 5000); // Longer time to allow reading the results
  };

  if (showInstructions) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          {bullyingT('gameTitle')}
        </h2>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-lg text-blue-800 mb-3">
            {bullyingT('instructions.title')}
          </h3>
          <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2">
            <li>{bullyingT('instructions.point1')}</li>
            <li>{bullyingT('instructions.point2')}</li>
            <li>{bullyingT('instructions.point3')}</li>
          </ul>
          <p className="text-gray-700 mb-4">{bullyingT('instructions.remember')}</p>
          <p className="text-gray-700 font-medium">{bullyingT('instructions.selectAll')}</p>
        </div>
        
        <button
          onClick={() => setShowInstructions(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition w-full"
        >
          {bullyingT('startGame')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">
        {bullyingT('gameTitle')}
      </h2>
      
      {/* Game Status */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-gray-700">
            {bullyingT('status.postsChecked')}: {postsChecked} / {posts.length}
          </span>
        </div>
        {gameOver && (
          <div>
            <span className="text-gray-700 font-semibold">
              {bullyingT('status.score')}: {score}
            </span>
          </div>
        )}
      </div>
      
      {/* Social Media Wall */}
      <div className="space-y-4 mb-6">
        {posts.map(post => (
          <div
            key={post.id}
            className={`border rounded-lg overflow-hidden transition cursor-pointer
              ${post.checked && !gameOver ? 'border-blue-500 bg-blue-50' : ''}
              ${gameOver && post.checked && post.isBullying ? 'border-red-500 bg-red-50' : ''}
              ${gameOver && post.checked && !post.isBullying ? 'border-green-500 bg-green-50' : ''}
              ${!post.checked ? 'hover:border-blue-300 border-gray-200' : ''}
            `}
            onClick={(e) => {
              e.stopPropagation();
              if (!gameOver) handlePostClick(post.id);
            }}
          >
            {/* Post Header */}
            <div className="flex items-center p-3 border-b">
              <div className="h-10 w-10 bg-gray-300 rounded-full mr-3 overflow-hidden">
                {/* Placeholder for avatar */}
                <div className="h-full w-full flex items-center justify-center text-gray-500 text-xs font-bold">
                  {post.author.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">{post.author}</h3>
                <p className="text-xs text-gray-500">{post.timestamp}</p>
              </div>
            </div>
            
            {/* Post Content */}
            <div className="p-4">
              <p className="text-gray-800">{post.content}</p>
            </div>
            
            {/* Post Footer */}
            <div className="flex items-center p-3 border-t bg-gray-50">
              <div className="text-gray-500 flex items-center mr-4">
                <span className="mr-1">👍</span>
                <span>{post.likes}</span>
              </div>
              <div className="text-gray-500 flex items-center">
                <span className="mr-1">💬</span>
                <span>{Math.floor(Math.random() * 5) + 1}</span>
              </div>
            </div>
            
            {/* Simple feedback during game */}
            {post.checked && !gameOver && (
              <div className="p-3 bg-blue-100 text-blue-800">
                <p className="font-medium">
                  {bullyingT('feedback.selected')}
                </p>
              </div>
            )}
            
            {/* Complete feedback only after game is over */}
            {gameOver && post.checked && (
              <div className={`p-3 ${post.isBullying ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                <p className="font-semibold">
                  {post.isBullying 
                    ? bullyingT('feedback.correct') 
                    : bullyingT('feedback.incorrect')}
                </p>
                <p className="text-sm mt-1">{post.explanation}</p>
              </div>
            )}
            
            {/* Show explanation for non-selected posts after game over */}
            {gameOver && !post.checked && (
              <div className={`p-3 ${post.isBullying ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                <p className="font-semibold">
                  {post.isBullying 
                    ? bullyingT('feedback.missedBullying') 
                    : bullyingT('feedback.correctlySkipped')}
                </p>
                <p className="text-sm mt-1">{post.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="mt-6">
        {postsChecked > 0 && !gameOver && (
          <>
            <button
              onClick={finishGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition w-full"
            >
              {bullyingT('finishGame')}
            </button>
            <p className="text-center text-sm text-gray-500 mt-2">
              {bullyingT('selectAllBefore')} ({postsChecked}/{posts.length})
            </p>
          </>
        )}
        
        {gameOver && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-blue-800">
              {bullyingT('gameOver.title')}
            </h3>
            <p className="text-gray-700 my-2">
              {bullyingT('gameOver.description')}
            </p>
            <p className="font-medium">
              {bullyingT('gameOver.finalScore')}: {score}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}