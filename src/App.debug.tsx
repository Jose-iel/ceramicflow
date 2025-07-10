function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>CeramicFlow Debug</h1>
      <p>Se você está vendo isso, o React está funcionando!</p>
      <p>Timestamp: {new Date().toLocaleString()}</p>
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Informações do Ambiente</h2>
        <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'undefined'}</p>
        <p><strong>Mode:</strong> {import.meta.env.MODE || 'undefined'}</p>
        <p><strong>Base URL:</strong> {import.meta.env.BASE_URL || 'undefined'}</p>
        <p><strong>Prod:</strong> {import.meta.env.PROD ? 'true' : 'false'}</p>
        <p><strong>Dev:</strong> {import.meta.env.DEV ? 'true' : 'false'}</p>
      </div>
    </div>
  );
}

export default App;
