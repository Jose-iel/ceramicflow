import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Componente muito básico para testar React
function BasicApp() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        color: '#2563eb', 
        marginBottom: '20px',
        fontSize: '2rem' 
      }}>
        🎉 CeramicFlow - React Funcionando!
      </h1>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f0f9ff', 
        border: '2px solid #0ea5e9',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>✅ Status do Sistema</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>✅ React {React.version} carregado</li>
          <li>✅ React-DOM inicializado</li>
          <li>✅ CSS funcionando</li>
          <li>✅ JavaScript executando</li>
        </ul>
      </div>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f9fafb', 
        border: '1px solid #d1d5db',
        borderRadius: '8px'
      }}>
        <h3>🔧 Informações Técnicas</h3>
        <p><strong>URL:</strong> {window.location.href}</p>
        <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
        <p><strong>User Agent:</strong> <small>{navigator.userAgent}</small></p>
      </div>

      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f0fdf4',
        border: '2px solid #10b981',
        borderRadius: '8px'
      }}>
        <h3>🚀 Próximos Passos</h3>
        <p>Se você está vendo isso na Vercel:</p>
        <ol style={{ paddingLeft: '20px' }}>
          <li>O problema React/React-DOM foi resolvido ✅</li>
          <li>Agora podemos reintroduzir componentes complexos</li>
          <li>Testar roteamento e Supabase</li>
        </ol>
      </div>
    </div>
  );
}

// Garantir que o elemento root existe
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

console.log('🚀 Iniciando React...');
console.log('React version:', React.version);

try {
  const root = createRoot(rootElement);
  root.render(<BasicApp />);
  console.log('✅ React renderizado com sucesso');
} catch (error) {
  console.error('❌ Erro ao renderizar:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; color: red; font-family: Arial;">
      <h1>Erro Fatal</h1>
      <p>Erro ao inicializar React: ${error}</p>
      <p>Verifique o console para mais detalhes.</p>
    </div>
  `;
}
