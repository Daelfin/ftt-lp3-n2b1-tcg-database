function getCards() {
    var nome = document.getElementById("entrada");
    var url = "https://api.pokemontcg.io/v2/cards?q=name:" + nome.value;
    fetch(url, {
            method: "GET",
            withCredencials: true,
            headers: {
                "X-Auth-Token": "2e83df12-a66c-4976-974d-6632c30b7ae4",
            }
        })
        .then(req => req.json())
        .then(show => showCards(show));
}

function showCards(jsonObj) {
    const divTag = document.getElementById("cartas");
    divTag.innerHTML = "";
    console.log(jsonObj.data[0]);
    jsonObj.data.forEach(item => {

        let tgFig = document.createElement("figure");
        let tgImg = document.createElement('img');
        let tgFigC = document.createElement('figcaption');

        tgImg.src = item.images.small;
        tgFig.appendChild(tgImg);

        tgFigC.textContent = item.name;
        tgFig.appendChild(tgFigC);

        divTag.appendChild(tgFig);

    });
}