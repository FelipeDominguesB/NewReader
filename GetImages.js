class GetImages{


    constructor()
    {
        console.log('Abri')
        this.StartButtons();
    }

    StartButtons()
    {
        let btnAdc = document.querySelector('.btn-adicionar');
        let btnReset = document.querySelector('.btn-reset');
        
        btnAdc.addEventListener('change', e =>{
            this.getPhotos(e);
        }, true);

        btnReset.addEventListener('click', e =>{
            this.deletePhotos();
        }, false);
    }

    deletePhotos()
    {
        let photoTable = document.querySelectorAll('th');
        console.log(photoTable);

        photoTable.forEach((element, index, array)=>{
            element.parentNode.removeChild(element);
        });
    }

    getPhotos(event)
    {

        
        let arquivo = event.target.files;
        
        
        
        
        if(arquivo)
        {
            for(let i=0; i < arquivo.length; i++){

            let fileReader = new FileReader();

            fileReader.onloadend = ()=>{
                console.log(fileReader.result);
                this.AdicionarImagem(fileReader.result);
                fileReader.abort();
            }

            
            fileReader.readAsDataURL(arquivo[i]);
            }
        }

        

        
    }

    AdicionarImagem(arquivo)
    {
        let th = document.createElement('th');
        th.style.display = 'block';
        let imagem = document.createElement('img');
        imagem.src = arquivo;
        th.appendChild(imagem);
        document.querySelector('tr').appendChild(th);
        
    }
}