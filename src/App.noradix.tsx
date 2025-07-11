import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas básicas sem Radix UI
function HomePage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>🏠 CeramicFlow - Home</h1>
      <p>Bem-vindo ao sistema de gestão ceramistas!</p>
      <nav style={{ marginTop: '20px' }}>
        <a href="/login" style={{ marginRight: '20px', color: 'blue' }}>Login</a>
        <a href="/about" style={{ color: 'blue' }}>Sobre</a>
      </nav>
    </div>
  );
}

function LoginPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>🔐 Login</h1>
      <form style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input type="email" style={{ marginLeft: '10px', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Senha:</label>
          <input type="password" style={{ marginLeft: '10px', padding: '8px' }} />
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
          Entrar
        </button>
      </form>
      <p style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: 'blue' }}>← Voltar para Home</a>
      </p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>404 - Página não encontrada</h1>
      <p><a href="/" style={{ color: 'blue' }}>← Voltar para Home</a></p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
