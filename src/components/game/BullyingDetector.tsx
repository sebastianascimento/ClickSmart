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
    if (gameOver) return;

    // Find the post
    const clickedPost = posts.find(post => post.id === id);
    if (!clickedPost) return;
    
    // Toggle selection
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
    
    // Toggle results button visibility
    if (postsChecked > 0 || !clickedPost.checked) {
      setShowResults(true);
    } else if (postsChecked === 1 && clickedPost.checked) {
      setShowResults(false);
    }
  };

  // Finish the game and calculate final score
  const finishGame = () => {
    setGameOver(true);
    
    // Calculate score
    let newScore = 0;
    let correctlyIdentified = 0;
    const totalBullyingPosts = posts.filter(post => post.isBullying).length;
    
    posts.forEach(post => {
      if (selectedPosts.includes(post.id)) {
        if (post.isBullying) {
          newScore += 10;
          correctlyIdentified++;
        } else {
          newScore = Math.max(0, newScore - 5);
        }
      }
    });
    
    const accuracyScore = totalBullyingPosts > 0 ? Math.round((correctlyIdentified / totalBullyingPosts) * 20) : 0;
    const finalScore = newScore + accuracyScore;
    
    setScore(finalScore);
    
    setTimeout(() => {
      onComplete(finalScore);
    }, 5000);
  };

  if (showInstructions) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
          {bullyingT('gameTitle')}
        </h2>
        
        <div className="bg-gradient-to-b from-green-50 to-green-50/30 rounded-lg p-8 mb-8 border border-green-100">
          <h3 className="font-bold text-lg text-green-600 mb-4">
            {bullyingT('instructions.title')}
          </h3>
          <ul className="space-y-3 mb-6">
            <li className="pl-7 text-gray-800 leading-relaxed relative before:content-['→'] before:absolute before:left-0 before:text-green-500 before:font-bold">
              {bullyingT('instructions.point1')}
            </li>
            <li className="pl-7 text-gray-800 leading-relaxed relative before:content-['→'] before:absolute before:left-0 before:text-green-500 before:font-bold">
              {bullyingT('instructions.point2')}
            </li>
            <li className="pl-7 text-gray-800 leading-relaxed relative before:content-['→'] before:absolute before:left-0 before:text-green-500 before:font-bold">
              {bullyingT('instructions.point3')}
            </li>
          </ul>
          <p className="text-gray-800 mb-4 leading-relaxed">
            {bullyingT('instructions.remember')}
          </p>
          <p className="text-green-600 font-semibold">
            {bullyingT('instructions.selectAll')}
          </p>
        </div>
        
        <button 
          onClick={() => setShowInstructions(false)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-all font-semibold hover:shadow-lg active:translate-y-0.5"
        >
          {bullyingT('startGame')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[3px] after:bg-green-600 after:rounded-md">
        {bullyingT('gameTitle')}
      </h2>
      
      {/* Game Status */}
      <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-gray-800 font-medium text-sm">
          {bullyingT('status.postsChecked')}: {postsChecked} / {posts.length}
        </span>
        {gameOver && (
          <span className="text-green-600 font-bold text-lg">
            {bullyingT('status.score')}: {score}
          </span>
        )}
      </div>
      
      {/* Social Media Wall */}
      <div className="flex flex-col gap-5 mb-8">
        {posts.map(post => (
          <div
            key={post.id}
            onClick={(e) => {
              e.stopPropagation();
              if (!gameOver) handlePostClick(post.id);
            }}
            className={`
              rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer shadow-sm
              ${gameOver && post.checked && post.isBullying ? 'border-red-600 shadow-red-100' : ''}
              ${gameOver && post.checked && !post.isBullying ? 'border-green-600 shadow-green-100' : ''}
              ${!gameOver && post.checked ? 'border-green-500 shadow-green-100 -translate-y-1' : 'border-gray-200'}
              ${!gameOver && !post.checked ? 'hover:border-green-300 hover:-translate-y-1' : ''}
            `}
          >
            {/* Post Header */}
            <div className="flex items-center p-4 border-b border-gray-200">
              <div className="h-10 w-10 bg-green-400 rounded-full mr-4 flex items-center justify-center text-white font-semibold text-lg">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{post.author}</h3>
                <p className="text-xs text-gray-500">{post.timestamp}</p>
              </div>
            </div>
            
            {/* Post Content */}
            <div className="p-5 bg-white">
              <p className="text-gray-800 leading-relaxed">{post.content}</p>
            </div>
            
            {/* Post Footer */}
            <div className="flex items-center p-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center text-gray-500 mr-6">
                <span className="mr-1.5" role="img" aria-label="like">👍</span>
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <span className="mr-1.5" role="img" aria-label="comment">💬</span>
                <span>{Math.floor(Math.random() * 5) + 1}</span>
              </div>
            </div>
            
            {/* Simple feedback during game */}
            {post.checked && !gameOver && (
              <div className="p-4 bg-green-50 text-green-600 border-t border-green-200">
                <p className="font-medium">
                  {bullyingT('feedback.selected')}
                </p>
              </div>
            )}
            
            {/* Complete feedback only after game is over */}
            {gameOver && post.checked && (
              <div className={`p-4 border-t ${post.isBullying 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'bg-green-50 text-green-600 border-green-200'}`}
              >
                <p className="font-semibold mb-2">
                  {post.isBullying 
                    ? bullyingT('feedback.correct') 
                    : bullyingT('feedback.incorrect')}
                </p>
                <p className="text-sm opacity-90">{post.explanation}</p>
              </div>
            )}
            
            {/* Show explanation for non-selected posts after game over */}
            {gameOver && !post.checked && (
              <div className={`p-4 border-t ${post.isBullying 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'bg-green-50 text-green-600 border-green-200'}`}
              >
                <p className="font-semibold mb-2">
                  {post.isBullying 
                    ? bullyingT('feedback.missedBullying') 
                    : bullyingT('feedback.correctlySkipped')}
                </p>
                <p className="text-sm opacity-90">{post.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div>
        {postsChecked > 0 && !gameOver && (
          <>
            <button
              onClick={finishGame}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-all font-semibold hover:shadow-lg active:translate-y-0.5"
            >
              {bullyingT('finishGame')}
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">
              {bullyingT('selectAllBefore')} ({postsChecked}/{posts.length})
            </p>
          </>
        )}
        
        {gameOver && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 animate-fadeIn">
            <h3 className="font-semibold text-lg text-green-600 mb-3">
              {bullyingT('gameOver.title')}
            </h3>
            <p className="text-gray-800 mb-3 leading-relaxed">
              {bullyingT('gameOver.description')}
            </p>
            <p className="flex items-center gap-2 font-bold text-green-600 text-lg before:content-['🏆']">
              {bullyingT('gameOver.finalScore')}: {score}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}