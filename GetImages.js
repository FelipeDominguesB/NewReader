class GetImages{

    constructor()
    {
        

        this.btnAdc = document.querySelector('.btn-adicionar');
        this.btnReset = document.querySelector('.btn-reset');
        this.btnZoomIn = document.querySelector('.btnRight');
        this.btnZoomOut = document.querySelector('.btnLeft');
        this.filterCheckbox = document.querySelector('.checkboxBW');
        this.loopCheckbox = document.querySelector('.checkboxLoop');
        this.autoPlayCheckbox = document.querySelector('.checkboxAutoplay');
        this.tableClass = document.querySelector('.imagesTable');
        this.loadingElement = document.querySelector('.loadingImages');

        this.StartButtons();

        if(localStorage.getItem('files') != null)
        {
            let files = JSON.parse(localStorage.getItem('files'));
            console.log(files);
            let bwFilter = files[0].className == 'mediaSize bwFilter';
            this.AdicionarMidia(files, files[0].loop, files[0].autoplay, bwFilter);

            this.showTable();     
        }

        this.imagesWidth = 70;
        
    }

    StartButtons()
    {
        this.showNothing();

        this.btnAdc.addEventListener('change', e =>{
            this.showLoad();

            this.getPhotos(e).then((result) =>{
                this.AdicionarMidia(result, 
                    this.loopCheckbox.checked, 
                    this.autoPlayCheckbox.checked,
                    this.filterCheckbox.checked);
            }).finally((result) => {
                this.showTable();
            });
        }, true);

        this.btnReset.addEventListener('click', e =>{
            this.deletePhotos();
            this.showNothing();
        }, false);

        this.btnZoomIn.addEventListener('click', e =>{
            this.zoomInPhotos();  
        }, true);

        this.btnZoomOut.addEventListener('click', e =>{
            this.zoomOutPhotos();  
        }, true);

   
    }

    zoomInPhotos()
    {
        let images = document.querySelectorAll('.mediaSize');

        if(this.imagesWidth < 100) this.imagesWidth += 10;
        images.forEach(element => {
            element.style.width = this.imagesWidth + '%';
        });
    }

    zoomOutPhotos()
    {
        let images = document.querySelectorAll('.mediaSize');

        if(this.imagesWidth >50) this.imagesWidth -= 10;
        images.forEach(element => {
            element.style.width = this.imagesWidth + '%';
        });
    }

    showNothing()
    {
        this.tableClass.style.display = 'none';
        this.loadingElement.style.display = 'none';
    }

    showTable(tableClass, loadingElement)
    {
        this.loadingElement.style.display = 'none';
        this.tableClass.style.display = 'table';            
    }

    showLoad(tableClass, loadingElement)
    {
        this.loadingElement.style.display = 'flex';
        this.tableClass.style.display = 'none'; 
    }

    deletePhotos()
    {
        let photoTable = document.querySelectorAll('th');
        photoTable.forEach((element)=>{
            element.parentNode.removeChild(element);
        });

        localStorage.clear();
    }

    getPhotos(e)
    {
        return new Promise((resolve, reject) =>
        {
            let photos = e.target.files;

            if(photos)
            {
                let photosArray = []; 
                for(let i=0; i < photos.length; i++)
                {
                    let fileReader = new FileReader();
                    fileReader.onload = ()=>
                    {
                        let fileType = fileReader.result.slice(0, 10);
                        
                        switch(fileType)
                        {
                            case 'data:image':
                            case 'data:video':
                                photosArray.push({src: fileReader.result, fileType, id: i});

                                if(photos.length == photosArray.length) {
                                    fileReader.abort();
                                    resolve(photosArray);
                                }
                                break;

                            default:
                                alert('Insira um formato de arquivo valido');
                                reject();
                                break;
                        }
                        
                        fileReader.abort();
                    }
                    fileReader.readAsDataURL(photos[i]);
                }
            }
        });
    }  
        
    AdicionarMidia(files, loop=false, autoplay=false, bwFilter=false)
    {
        files.sort((element1, element2) =>{
            return element1.id - element2.id;
        });
        let mediaFiles = [];
        for(let i = 0; i < files.length; i++)
        {
            let td = document.createElement('th');
            td.style.display = 'block';

            let media = document.createElement(files[i].fileType == 'data:image' ? 'img' : 'video');
            
            Object.assign(media, {
                src: files[i].src,
                autoplay,
                loop, 
                controls: true,
                muted: true,
                className: 'mediaSize'
            });

            if(bwFilter==true)
            {
                media.className = 'mediaSize bwFilter';
            }
            
            mediaFiles.push({
                src: media.src, 
                autoplay: media.autoplay, 
                loop: media.loop,
                controls: true,
                muted: true,
                fileType: files[i].fileType,  
                className: media.className,
            });

            td.appendChild(media);
            document.querySelector('tr').appendChild(td);
        }

        console.log(JSON.stringify(mediaFiles));
        localStorage.setItem('files', JSON.stringify(mediaFiles));
        
    }
}