import React from 'react';
import { createRoot } from 'react-dom/client';

// Debug version of the app
function DebugApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2563eb' }}>CeramicFlow - Debug Mode</h1>
      <p>✅ React está funcionando!</p>
      <p>🕐 Carregado em: {new Date().toLocaleString()}</p>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        border: '2px solid #10b981',
        borderRadius: '8px',
        backgroundColor: '#f0fdf4'
      }}>
        <h2>✅ Status do Sistema</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>✅ HTML carregado</li>
          <li>✅ Script principal executado</li>
          <li>✅ React inicializado</li>
          <li>✅ Componente renderizado</li>
        </ul>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        border: '1px solid #6b7280',
        borderRadius: '8px',
        backgroundColor: '#f9fafb'
      }}>
        <h3>🔧 Informações Técnicas</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '5px', fontWeight: 'bold' }}>URL:</td>
              <td style={{ padding: '5px' }}>{window.location.href}</td>
            </tr>
            <tr>
              <td style={{ padding: '5px', fontWeight: 'bold' }}>User Agent:</td>
              <td style={{ padding: '5px', fontSize: '12px' }}>{navigator.userAgent}</td>
            </tr>
            <tr>
              <td style={{ padding: '5px', fontWeight: 'bold' }}>React Version:</td>
              <td style={{ padding: '5px' }}>{React.version}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        border: '1px solid #3b82f6',
        borderRadius: '8px',
        backgroundColor: '#eff6ff'
      }}>
        <h3>📋 Próximos Passos</h3>
        <ol>
          <li>Se você está vendo isso na Vercel, o problema foi identificado</li>
          <li>Verifique o console do navegador para erros adicionais</li>
          <li>Substitua por App.tsx original para testar componentes específicos</li>
        </ol>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

console.log('🚀 Iniciando aplicação de debug...');
const root = createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <DebugApp />
    </React.StrictMode>
  );
  console.log('✅ Aplicação de debug renderizada com sucesso');
} catch (error) {
  console.error('❌ Erro ao renderizar aplicação:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; color: red; font-family: Arial;">
      <h1>Erro Fatal</h1>
      <p>Erro ao inicializar React: ${error}</p>
    </div>
  `;
}
