import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona para o locale padrão (pt)
  redirect('/pt');
  
  // Este retorno nunca será renderizado devido ao redirecionamento acima,
  // mas é necessário para o TypeScript reconhecer isso como um componente válido
  return null;
}

