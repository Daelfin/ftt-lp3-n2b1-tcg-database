
function PegaCarta() {
    var nome = document.getElementById("nome")
    var CartaURL = "https://api.magicthegathering.io/v1/cards?name=" + nome.value;

    fetch(CartaURL)
        .then(req => req.json())   
        .then(show => mostraImagem(show)); 

}

function mostraImagem(nomeIMG) {
    
    const divIMG = document.getElementById('Imagem')
    divIMG.innerHTML = "";
    console.log(nomeIMG);

    nomeIMG.cards.forEach(item => {
        console.log(item.multiverseid);
        if (item.multiverseid != undefined){
            
            let tgFig = document.createElement("figure");
            let tgImg = document.createElement('img');
            let tgFigC = document.createElement('figcaption');

            tgImg.src = item.imageUrl;
            tgFig.appendChild(tgImg);

            tgFigC.textContent = item.name;
            tgFig.appendChild(tgFigC);

            divIMG.appendChild(tgFig);
        }

    });
/*
    const divIMG = document.getElementById('Imagem')

    let tgFig = document.createElement('figure');
    let tgImg = document.createElement('img');
    let tgFigC = document.createElement('figcaption');

    tgImg.src = nomeIMG.imageUrl;
    tgFig.appendChild(tgImg);

    tgFigC.textContent = nomeIMG.name;
    tgFig.appendChild(tgFigC);

    divIMG.appendChild(tgFig);*/
}

//var CartaURL = "https://api.magicthegathering.io/v1/cards?name=" + nome;
// POR ID https://api.magicthegathering.io/v1/cards/386616
//TODOS OS CARDS   https://api.magicthegathering.io/v1/cards
// BUSCA POR NOME https://api.magicthegathering.io/v1/cards?name={nome}  VERIFICAR SE A CARTA TEM ID... PESQUISA POR ID?

//imageUrl VERIFICAR PARAMETRO ESPECIFICO DE IMAGEM E PASSAR LINK DE URL    -   O URL da imagem de um cartão. Só existe se o cartão tiver um id de multiverso.