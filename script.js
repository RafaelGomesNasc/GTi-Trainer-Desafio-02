// Carrega times do Local Storage ou inicia um objeto vazio
const teams = JSON.parse(localStorage.getItem('teams')) || {};
let currentPokemonId = null;

// Função para buscar e exibir os Pokémon
async function fetchPokemonList() {
    // Pega o id da div
    const container = document.getElementById('pokemon-container');
    
    // Criador dos 151 pokemon-card
    for (let i = 1; i <= 151; i++) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const pokemon = await response.json();
        
        const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        const types = pokemon.types.map(type => 
            `<span class="type ${type.type.name}">${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</span>`
        ).join(' ');

        const card = document.createElement('div');
        card.classList.add('pokemon-card');
        card.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h2>${pokemonName}</h2>
            <p>ID: #${pokemon.id}</p>
            <p>Tipo: ${types}</p>
            <button onclick="openTeamModal(${pokemon.id})">Salvar</button>
        `;
        container.appendChild(card);
    }
}

// Função para abrir o modal de seleção de time
function openTeamModal(pokemonId) {
    currentPokemonId = pokemonId;
    document.getElementById('team-modal').style.display = 'flex';
}

// Função para salvar o Pokémon no time
function savePokemonToTeam() {
    // Pega o nome do time digitado
    const teamName = document.getElementById('team-name').value;
    
    // Verifica se o nome for vazio
    if (!teamName) {
        alert("Por favor, insira o nome do time.");
        return;
    }

    // Se o time for novo cria um novo time
    if (!teams[teamName]) {
        teams[teamName] = [];
    }

    // Alerta para caso o time ultrapasse os 6
    if (teams[teamName].length >= 6) {
        alert(`O time ${teamName} já possui 6 Pokémon.`);
        return;
    }

    // Armazena o pokemon em seu respectivo time
    teams[teamName].push(currentPokemonId);
    localStorage.setItem('teams', JSON.stringify(teams));

    // Fecha o modal e limpa o campo de entrada
    document.getElementById('team-modal').style.display = 'none';
    document.getElementById('team-name').value = '';
}

// Função para exibir os times salvos
async function displayTeams() {
    const container = document.getElementById('team-container');
    container.innerHTML = ''; // Limpa o conteúdo anterior

    // Cria os slots dos pokemons do time
    for (const [teamName, pokemons] of Object.entries(teams)) {
        const teamDiv = document.createElement('div');
        teamDiv.classList.add('team');
        const pokemonSlots = [];

        for (let i = 0; i < 6; i++) {
            const pokemonId = pokemons[i];
            if (pokemonId) {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
                const data = await response.json();
                pokemonSlots.push(`
                    <div class="pokemon-slot">
                        <div class="empty-slot">
                            <img src="${data.sprites.front_default}" alt="${data.name}" class="pokemon-img" />
                        </div>
                        <span class="pokemon-name">${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</span>
                    </div>
                `);
            } else { 
                pokemonSlots.push('<div class="empty-slot"></div>');
            }
        }

        // Mostra o tema-card
        teamDiv.innerHTML = `
            <h2 class="team-name">${teamName}</h2>  
            <div class="pokemon-images">${pokemonSlots.join('')}</div>
            <button class="delete-button" onclick="deleteTeam('${teamName}', this.parentElement.parentElement)">Excluir</button>
        `;

        container.appendChild(teamDiv);
    }
}

// Função para deletar um time
function deleteTeam(teamName, cardElement) {
    if (teams[teamName]) {
        delete teams[teamName];
        localStorage.setItem('teams', JSON.stringify(teams));
        cardElement.remove(); // Remove o elemento do DOM
        console.log(`Time "${teamName}" foi removido.`)
    } else {
        console.log(`Time "${teamName}" não encontrado.`);
    }
}

// Inicializa a exibição dos times ou Pokémon
// Se na página for a team.html
if (window.location.pathname.endsWith('team.html')) {
    displayTeams(); // Exibe os times na página de time
// Se não for, exibe a os pokemon-card
} else {
    fetchPokemonList(); // Busca Pokémon na outra página
}
