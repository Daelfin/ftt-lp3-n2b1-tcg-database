//resultados por pagina, caminho, nome e imagem, carta, etc
var resultsPerPage = 18;
var pathname;
var newCards = false;
var images;
var cardimage;
var cardName;
var card;

//limpa tela quando randomizando mais carta
function clearScreen(){
    loadedResults = resultsPerPage;
    b=0;
    subtitle.innerHTML= '';
    setResults.innerHTML='';
    cardResults.innerHTML='';
    miniCardResults.innerHTML='';
    setsFilterBar.classList.add("d-none");
    if (pathname == "/advancedSearch.html"){
        advancedSearchBar.classList.add("d-none");
    }
}

//funcão para pegar ID carta
function cardID(e){
	e = e || window.event;
	e = e.target || e.srcElement
	console.log('cardID:' +e.id)
	cardId = e.id
	getCardBySet(cardId)
}

function createCard(card)
{
	
	//Parametros declarados da carta presente na API
	id = card.id
	name = card.name;
	name = name.toUpperCase()
	fname = card.fname 
	desc = card.desc
	type = card.type
	atk = card.atk
	def = card.def
	level = card.level
	race = card.race
	attribute = card.attribute
	link = card.link
	linkmarker = card.linkmarker
	linkvale = card.linkval
	scale = card.scale
	set = card.set
	archetype = card.archetype
	if (archetype == undefined){ archetype="-"}

	banlist_info = card.banlist
	misc_info = card.misc_info

	//condições para cartas não lançadas
	if (misc_info === undefined){
		releaseText="Essa carta ainda não foi lançada";
		
	} else { 
			if (misc_info[0].tcg_date == undefined){
			releaseText = `Essa carta foi lançada ${misc_info[0].ocg_date} no OCG mas não esta disponivel no TCG` 
		} if (misc_info[0].tcg_date !== undefined){
			releaseText=`Essa carta foi lançada ${misc_info[0].ocg_date} no OCG e ${misc_info[0].tcg_date} no TCG e esta disponivel no(s) seguinte(s) set(s): `
			}
		if (misc_info[0].tcg_date == undefined && misc_info[0].ocg_date == undefined  ){
				releaseText="Essa carta ainda não foi lançada"
				}
		}

	//Endereço das fotos das cartas (relaciona com o ID respectivo)
	if (card.card_images === undefined) {cardImage=`https://storage.googleapis.com/ygoprodeck.com/pics/${id}.jpg`} else{cardImage= card.card_images[0].image_url}
	
	if (images===false) {cardImage=`https://storage.googleapis.com/ygoprodeck.com/pics/${id}.jpg`}
	card_prices= card.card_prices;
	
	card_sets= [card.card_sets];

	function sortCardSets(){

		card_sets.sort(function(a, b) {
			return parseFloat(a.set_price) - parseFloat(b.set_price);
		});
		
	}
	
	//Caso a carta não tenha defesa, ataque, atributo, nivel (geralmente cartas magicas e de armadilha)
	banlist_info = card.banlist_info
	
	if (def=== undefined || def == null){
		def=' - '
	}
	if (atk=== undefined || atk == null){
		atk=' - '
	}
	if (attribute=== undefined){
		attribute=' - '
	}
	if (level === undefined){
		level = 'LINK -' + card.linkval
	}
		

	//Preço das cartas baseado em sites como https://www.tcgplayer.com
	if (card_prices !== undefined){
	} else { cardPrice = '' }	

	if (banlist_info == undefined ){
		banlist_info = "Unlimited";

	} 


	//Banlist da carta baseado no formato TCG/OCG/GOAT (tende a ser diferente para certas cartas)
	if (banlist == "tcg" ){
		banlist_info = banlist_info.ban_tcg;
		if (banlist_info == undefined ){
			banlist_info = "Unlimited";
	
		} 
	 } 

	if (banlist == "ocg" ){
		banlist_info = banlist_info.ban_ocg;
	} 

	
	if (banlist == "goat" ){
		banlist_info = banlist_info.ban_goat;
	} 

	//Identifica carta como SPELL (Magica), ou TRAP (Armadilha) e designa corretamente	 
	if (type=='Spell Card'){
		attribute = 'SPELL'


		level= '-'
	}
	if (type == 'Trap Card'){
		attribute = 'TRAP'
		level= '-'
	}

	//informações da carta se for Spell ou Trap (escrita para parte HTML com as informações e parametros JavaScript)
	if (type == "Trap Card" || type == "Spell Card" ){

		cardResults.innerHTML+= `
			<div>
				<div class="card cards" class='showCardInfo' style="width: 100%;">
					<div class="cardGrid" >
						<div class"cardGridIMG"> 
							<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#ModalID${id}">
							<img src="${cardImage}" class="card-img-bottom cardImages" id='${fname}' alt="${name}">
							</button>
  
						</div>
							<div class='cardInfo'  id='${name}'>
								<h5>${name}</h5>
								<span class="cardInfoText">
									${banlist_info}
								</span>  /  
								<span class="cardInfoText"> 
									${type} 
								</span> / 
								<span class="cardInfoText">
									${race}
								</span> / 
								<span class="cardInfoText"> 
									Archetype : 
								</span>
								<span onclick='cardArchetype(this.id)'> 
									<a href="#" class='getByArchetype' 
										id='${archetype}'>  ${archetype} 
									</a>
								</span>  / 
								<span class="cardInfoText"> Card ID : <span onclick='getIdCode(this.id)'> 
									<a href="#" class='getIdCode' class="close" data-dismiss="modal" aria-label="Close"id='${id}'>  
										${id}  
									</a> 
								</span>
								<br>
								<p class="cardDescription"
									>${desc}
								</p>


							
								<p id="${id}_setsTitles"> 
									${releaseText}
								</p>
								<table  class="priceTable"  id="${id}_setTable" >
									<tr>
										<th>Nome do Set</th>
										<th>Raridade</th>
										<th>Codigo</th>
										<th>Preço</th>
									</tr>
								</table>
								<br>
								<div id='prices'></div>
							</div>
						</div>
	  		
					</div>
				</div>
				
				

				<div class="miniCard" class="card" class="col-sm">
		

		<div class="modal fade modalCardImage" id="ModalID${id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content modalImage">
					<div class="modal-header">
					
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">
								&times;
							</span>
						</button>
						<img src="${cardImage}" class="card-img-bottom cardImages" id='${fname}' alt="${name}">
						
					</div>
					
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						</div>
 
				</div>
			</div>
		</div>
	</div>`
		//Cartas de monstro
	} else {
		
		let levelOrRankOrLink="level";

		if (type=="XYZ Monster" || type == "XYZ Pendulum Effect Monster"){ levelOrRankOrLink="rank"}

		if (type=="Link Monster"){ levelOrRankOrLink="link"}

		cardResults.innerHTML+= `
		<div>
		<div class="card cards" class='showCardInfo' style="width: 100%;">
		<div class="cardGrid" >
		
		<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#ModalID${id}">
			<img src="${cardImage}" class="card-img-bottom cardImages" id='${fname}' alt="${name}" >
			</button>

			<div class='cardInfo'  id='${name}'>
			
				<h5>${name}</h5>
				<span class="cardInfoText">${banlist_info}</span>  / <span class="cardInfoText"> ${type} </span>/ <span class="cardInfoText"> ${race}</span> / <span class="cardInfoText"> ${attribute}</span> /  ${level} /<span class="cardInfoText"> Archetype : </span><span onclick='cardArchetype(this.id)'> <a href="#" class='getByArchetype' id='${archetype}'>  ${archetype}  </a></span>  /  <span class="cardInfoText"><b> ATK </b>: </span> ${atk}  /  <span class="cardInfoText"><b> DEF </b>: </span> ${def} /<span class="cardInfoText">  Card ID : <span onclick='getIdCode(this.id)'> <a href="#" class='getIdCode' class="close" data-dismiss="modal" aria-label="Close" id='${id}'>  ${id}  </a></span> </span><br>
			
				<p class="cardDescription">${desc}</p>
				<p id="${id}_setsTitles"> ${releaseText}</p>
				<table class="priceTable" id="${id}_setTable" >
				<tr>
				<th>Nome do Set</th>
				<th>Raridade</th>
				<th>Codigo</th>
				<th>Preço</th>
				</tr>
				</table>
				<br>
				<div id='prices'>
				</div>
			</div>
		</div>
	  	
		</div>
	</div>
		
	<div class="miniCard" class="card" class="col-sm" >
			

			<div class="modal fade modalCardImage" id="ModalID${id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered" role="document">
					<div class="modal-content modalImage">
						<div class="modal-header">
						
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
						</button>
							<img src="${cardImage}" class="card-img-bottom cardImages" id='${fname}' alt="${name}" >
							
						</div>
					
						<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`
	}
			
	
	
	
	//Sets em que as cartas estão presente (inclui informações como Preço, Raridade, Codigo e Nome)
	if (card_sets[0] !== undefined ){

		sortCardSets();

	card_sets.forEach(function(setName,i){

		for (var b = 0; b < card_sets[0].length ; b++) {
			
			set_code= setName[b].set_code;
			set_name= setName[b].set_name;
			set_price= setName[b].set_price;
			set_rarity= setName[b].set_rarity;
		   document.getElementById(id+'_setTable').innerHTML+=`
		   <div onclick='addToCollection(this.id)' style='display:inline'>
			
		 


			<tr>
			<td><span onclick='cardSet(this.id)'>  <a  style="cursor: pointer" id="${setName[b].set_name}" class='getBySet'  class="close" data-dismiss="modal" aria-label="Close"> ${setName[b].set_name} </a></span>  </td>
			<td class="setRarity">  ${set_rarity}  </td>
			<td class="setCode" ><span onclick='getCardSetCode(this.id)'>  <a  style="cursor: pointer" id="${setName[b].set_code}" class='getBySet'  class="close" data-dismiss="modal" aria-label="Close"> ${setName[b].set_code} </a></span></td> 
			<td class="setPrice"> $${setName[b].set_price}  </td>
				
			</tr>

		   </div>`
		}

	 })} else {
		
		 document.getElementById(id+'_setTable').innerHTML = " ";
		 document.getElementById(id+'_setTable').innerHTML+=` `
		}

}

//Limpa tela para as cartas
function clearScreenForMiniCards(){
				
    loadedResults = resultsPerPage;
    b=0;
    setResults.innerHTML='';
    cardResults.innerHTML='';
    miniCardResults.innerHTML='';
    setsFilterBar.classList.add("d-none");

}

//Pega x cartas aleatorias
function fetchxRandomCards(x){

    
   // clean screen    
   clearScreen()


moreFilteredResults = false;
newCards = false;
   banlist = "tcg";

   window.location.hash = '/randomCards'

    subtitle.innerHTML= ''
    x = resultsPerPage
    
    results=[]
    results[0]=[]
    
    for (var i = 0; i < 18; i++) { //Chama vetor com resultados por pagina
   
        fetchRandomCards()
     }
     
    return 
}

//Onde pega as cartas e com qual endpoint é chamado
function fetchRandomCards(where){
            
    var cardResults = document.querySelector('#cardResults')
    where="https://db.ygoprodeck.com/api/v7/randomcard.php"
    fetch(where)
    .then( cardInfo => cardInfo.json())
    .then(data => {
        results[0].push(data)
        createCard(data)
        fetchRandom=true;
        
})};

function getMoreRandomCards(){
    let x = 10
    for (var i = 0; i < 18; i++) {
    fetchRandomCards()
     }
    
     
    return 
}


 
