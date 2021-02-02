class GetImages{


    constructor()
    {
        console.log('Abri')
        this.StartButtons();
    }

    StartButtons()
    {
        let btnAdc = document.querySelector('.btn-adicionar');
        btnAdc.addEventListener('change', e =>{
            this.getPhotos(e);
        }, true);
    }

    getPhotos(event)
    {

        
        let arquivo = event.target.files[0];
        this.AdicionarImagem(arquivo);

    }

    AdicionarImagem(arquivo)
    {
        let th = document.createElement('th');
        th.style.display = 'block';
        let imagem = document.createElement('img');
        imagem.src = arquivo.name;
        th.appendChild(imagem);
        document.querySelector('tr').appendChild(th);
        
    }
}