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
        
        let btnZoomIn = document.querySelector('.btnRight');
        let btnZoomOut = document.querySelector('.btnLeft');

        btnAdc.addEventListener('change', e =>{
            this.getPhotos(e);
        }, true);

        btnReset.addEventListener('click', e =>{
            this.deletePhotos();
            
        }, false);

        btnZoomIn.addEventListener('click', e =>{
            this.zoomInPhotos();  
        }, true);

        btnZoomOut.addEventListener('click', e =>{
            this.zoomOutPhotos();  
        }, true);
    }

    zoomInPhotos()
    {
        
        let images = document.querySelectorAll('.mediaSize');

        images.forEach(element => {
            element.style.width = '100%';
        });
    }

    zoomOutPhotos()
    {
        let images = document.querySelectorAll('.mediaSize');

        images.forEach(element => {
            element.style.width = '70%';
        });
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
                
                let fileType = fileReader.result.slice(0, 10);
                console.log(fileType);

                switch(fileType)
                {
                    case 'data:image':
                        this.AdicionarImagem(fileReader.result);
                        break;
                    
                    case 'data:video':
                        this.AdicionarVideo(fileReader.result);
                        break;

                    default:
                        alert('Insira um formato de arquivo valido');
                        break;
                }
                
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
        imagem.className = 'mediaSize';
        th.appendChild(imagem);
        document.querySelector('tr').appendChild(th);
        
    }

    AdicionarVideo(arquivo)
    {
        let th = document.createElement('th');
        th.style.display = 'block';
        let video = document.createElement('video');

        Object.assign(video, { 
            src: arquivo,
            autoplay: true,
            loop: true, 
            controls: true,
            muted: true,
            className: 'mediaSize'
        });
        
        

        th.appendChild(video);
        document.querySelector('tr').appendChild(th);
        
    }
}