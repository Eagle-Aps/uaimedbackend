const db = require('./config/database');
const fetch = require('node-fetch'); 

// Função principal de coleta
async function collectAndInsertData() {
    console.log('--- Iniciando Pipeline de Coleta ---');
    
    let collectedData = [];

    try {

        const response = await fetch('https://api.publicapis.org/entries?title=health');
        const data = await response.json();
        
        collectedData = data.entries.slice(0, 10).map(entry => ({
            api_name: entry.API,
            description: entry.Description,
            category: entry.Category,
            url: entry.Link
        }));

        console.log(`Coletados ${collectedData.length} registros para inserção.`);

        // 2. Lógica de Inserção no Banco de Dados
        if (collectedData.length === 0) {
            console.warn('Nenhum dado coletado para inserção. Encerrando.');
            return;
        }

        const sql = `INSERT INTO USUARIOS (api_name, description, category, url, created_at) VALUES (?, ?, ?, ?, NOW())`;
        
        let insertedCount = 0;
        
        for (const item of collectedData) {
            db.query(sql, [item.api_name, item.description, item.category, item.url], (err, result) => {
                if (err) {
                    console.error('Erro ao inserir registro:', err.message);
                } else {
                    insertedCount++;
                }
            });
        }
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log(`--- Pipeline finalizada. Total de ${insertedCount} registros inseridos no DB. ---`);

    } catch (error) {
        console.error('ERRO CRÍTICO NA PIPELINE:', error.message);
        // Em caso de erro crítico, força o processo a falhar para que o GitHub Actions reporte a falha
        process.exit(1); 
    } finally {
        db.end();
    }
}

// Inicia a execução
collectAndInsertData();
