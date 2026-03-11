import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [produto, setProduto] = useState('')
  const [publico, setPublico] = useState('')
  const [dor, setDor] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [copy, setCopy] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Carregar a apiKey do localStorage ao iniciar
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // Salvar a API Key sempre que ela mudar
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produto || !publico || !dor) return;
    
    if (!apiKey) {
      alert("Por favor, insira sua Chave de API da OpenAI (OpenAI API Key) para gerar a copy.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ 
          model: 'gpt-4o-mini', // Modelo rápido, barato e muito inteligente
          messages: [
            {
              role: 'system',
              content: 'Você é um Copywriter milionário, focado em conversão e gatilhos mentais. Sua missão é criar uma copy de vendas curta, persuasiva e irresistível, voltada para anúncios e páginas de vendas de alta conversão. Use formatação limpa.'
            },
            {
              role: 'user',
              content: `Produto que eu vendo: ${produto}\nMeu Público-Alvo: ${publico}\nDor principal que eles têm: ${dor}\n\nEscreva a copy agora.`
            }
          ]
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error?.message || 'Erro ao comunicar com a OpenAI.');
      }
      
      setCopy(data.choices[0].message.content);
    } catch (err: any) {
      alert(`Erro de conexão com a IA: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(copy);
    alert('Copy copiada para usar na sua campanha!');
  };

  return (
    <div className="app-wrapper">
      <header className="header">
        <span className="badge">Inteligência Artificial Integrada</span>
        <h1 className="t-gradient">Máquina de Vendas</h1>
        <p className="t-sub">
          Apenas insira os dados do seu produto e deixe a IA trabalhar criando uma copy de conversão extrema.
        </p>
      </header>

      <div className="main-grid">
        <div className="glass-card">
          <form onSubmit={handleGenerate}>
            
            <div className="api-key-section">
              <label style={{color: '#a855f7', fontWeight: 600}}>Sua OpenAI API Key (Chave Secreta)</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="sk-proj-..." 
                value={apiKey}
                onChange={handleApiKeyChange}
                required
                style={{ borderColor: 'rgba(168, 85, 247, 0.4)' }}
              />
              <p style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px', marginBottom: '16px'}}>
                Sua chave fica salva apenas no seu navegador. Não guardamos em nenhum servidor.
              </p>
            </div>

            <div className="form-field">
              <label>O que você vende? (Seu Produto / Resumo)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: Mentoria de Emagrecimento 30 dias" 
                value={produto}
                onChange={(e) => setProduto(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Para quem você vende? (Seu Público-Alvo)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: Mulheres de 30 a 45 anos" 
                value={publico}
                onChange={(e) => setPublico(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Qual a DÚVIDA/DOR que mais tira o sono deles?</label>
              <textarea 
                className="form-input" 
                placeholder="Ex: Tiveram filhos, o metabolismo caiu e não conseguem voltar no peso antigo de jeito nenhum."
                value={dor}
                onChange={(e) => setDor(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-magic" disabled={isLoading}>
              {isLoading ? (
                <>
                   <svg className="spin-icon" fill="none" viewBox="0 0 24 24" height="20" width="20">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Escrevendo Mágica...
                </>
              ) : (
                'Gerar Copy Irresistível'
              )}
            </button>
          </form>
        </div>

        <div className="glass-card result-card">
          {!copy ? (
            <div className="result-placeholder">
              <svg fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
              </svg>
              <p>Sua Copy milionária aparecerá aqui.</p>
            </div>
          ) : (
             <div className="result-wrapper">
              <div className="result-content" style={{ whiteSpace: 'pre-wrap' }}>
                {copy}
              </div>
              <button className="btn-copy-action" onClick={copyToClipboard} style={{ marginTop: '1rem' }}>
                ✓ Copiar Texto para a Área de Transferência
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
