const nome = document.querySelector('#nome');

const formPesquisar = document.querySelector('#form-pesquisar');

const btnPesquisar = document.querySelector('#btn-pesquisar');

const resultado = document.querySelector('#resultado');
var html = "";
var page = 1;
var achou = false;
var registros = 0;
var contador = 0;
var nome_jogo;

function convertData(dt){

	let data = dt.split('-');
	let retorno = data[2]+'/'+data[1]+'/'+data[0];
	
	return retorno;
	
}

function verificaPesquisa(){
	
	console.log("Verificando pesquisa!");
			
	resultado.innerHTML = html;
			
	let paginate = document.querySelector('#paginate');
	let links = paginacao(page, 10, registros, paginate); 
				
	loadPaginas(links);
	
}



	function paginacao(atual, limit, totalRegistros, divPaginacao){
		let links = new Array();
		let htmlCode = "<h2>";
		if(limit > 0){
			atual = parseInt(atual);
				
			let colunas = 10;
			let paginas = Math.ceil(totalRegistros/limit);

			let inicio = ((atual - 1) * limit) + 1;
			let fim;
			
			if((atual * limit) >= totalRegistros){
				fim = totalRegistros;
			}else{
				fim = atual * limit;
			} 
				
			linhas = Math.ceil(paginas/colunas);
				
			let pagina_inicial;
			let pagina_final;
			let final_bloco;
			let linha;
			let i;
			
			for(i = 1; i <= linhas; i++){
				
				final_bloco = i * colunas;
				
				if(final_bloco >= atual){
					
					pagina_inicial = ((i - 1) * colunas) + 1;
					
					if(final_bloco >= paginas){
						pagina_final = paginas;
					}else{
						pagina_final = final_bloco;
					}
					
					linha = i;
					break;
					
					}
				}
	
				let num;
				
				for(i = pagina_inicial; i <= pagina_final; i++){
					
					if(i == pagina_inicial){
						
						if(i > colunas){
							htmlCode += "<a class='pagina seta' href=''><<<</a>";
							num = i - 1;
							links.push(num);
						}
					}
					
					if(i == atual){
						
						htmlCode += " <strong><a class='pagina escolhido' href=''>"+i+"</a></strong>";
						num = i;
						links.push(num);
					}else{
						htmlCode += " <a class='pagina comum' href=''>"+i+"</a>";
						num = i;
						links.push(num);
					}
					
					if(i == pagina_final){
						if(i < paginas){
							htmlCode += " <a class='pagina seta' href=''>>>></a>";
							num = i + 1;
							links.push(num);
						}
					}
					
				}
				
				htmlCode += "</h2>";
				
				
			}else{
				htmlCode += " <strong><a class='pagina escolhido' href=''>1</a></strong>";
				links.push(1);
			}
			divPaginacao.innerHTML = htmlCode;
			return links;
			
		}
		
function loadPaginas(links){
	let a = document.querySelectorAll('.pagina');
	let i = 0;
	links.forEach(function(link){
		a[i].addEventListener('click', async function(event){
			event.preventDefault();
			page = link;
			buscar();
		});
		i++;
	});
}



function buscar(){
	
	if(nome_jogo != ""){
		
		resultado.innerHTML = "<h3>Pesquisando...</h3>";
		
		fetch('https://api.rawg.io/api/games?search='+nome_jogo+'&page='+page+'&page_size=10')
		
		.then(function(response){
			
			return response.json();
		}).then(function(response){
			
			console.log(response);
			
			preencheResultado(response);
			
		}).catch(function(erro){
		
			if(achou){
				console.log("Tempo expirou!");
				verificaPesquisa();
				achou = false;
				
			}else{
			
				resultado.innerHTML = "<h2>Nenhum jogo encontrado!</h2>";
				
			}
			
		});
		
		
	}else{
	
		alert("Preencha o nome!");
		
	}
	
}

function preencheResultado(response){
	
	if(response.count > 0){
				
		registros = response.count;
				
		html = "<h2>Resultados: "+response.count+"</h2>";
		html += "<div class='paginate' id='paginate'></div>";
		let i = 0;
		let results = response.results;
		let genres, platforms, tags;
				
		results.forEach(function(result){
					
			html += "<div class='item'>";
			html += "<h2>"+result.name+"</h2>"; 
			html += "<img class='game-image' src='"+result.background_image+"' alt='"+result.slug+"'>";
					
			genres = result.genres;
			genres.forEach(function(genre){
					
			if(i == 0){
						
				html += "<p><strong>Genres: </strong>"+genre.name;
							
			}else{
							
				html += ", "+genre.name;
			}
						
				i++;
						
			});
					
			i = 0;
					
			html += "</p>";
					
			platforms = result.platforms;
			platforms.forEach(function(platform){
					
				if(i == 0){
						
					html += "<p><strong>Platforms: </strong>"+platform.platform.name;
							
				}else{
							
					html += ", "+platform.platform.name;
				}
						
				i++;
						
			});
					
			i = 0;
					
			html += "</p>";
					
					
			tags = result.tags;
			tags.forEach(function(tag){
					
				if(i == 0){
						
					html += "<p><strong>Tags: </strong>"+tag.name;
							
				}else{
							
					html += ", "+tag.name;
				}
						
				i++;
						
			});
					
			i = 0;
					
			html += "</p>";
					
			html += "<p><strong>Rating: </strong>"+result.rating+"</p>";
			html += "<p><strong>Released: </strong>"+convertData(result.released)+"</p>";
					
			html += "</div>";
					
		});
				
		resultado.innerHTML = html;
				
		let paginate = document.querySelector('#paginate');
		let links = paginacao(page, 10, registros, paginate); 
				
		loadPaginas(links, nome_jogo);
		
		achou = true;
				
	}else{
				
		page = 1;
		resultado.innerHTML = "<h2>Nehum jogo encontrado!</h2>";
				
	}
	
}


formPesquisar.addEventListener('submit', function(event){
		
	event.preventDefault();
	
	page = 1;
	
	nome_jogo = nome.value;
	
	buscar();
	
	
});
