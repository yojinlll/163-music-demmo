{
    let view = {
        el: '#songList-container',
        template: `
          <ul class="songList">
          </ul>
        `,
        render(data) {         // 将歌名以 <li> 渲染到 <ul> 中
            let $el = $(this.el)
            $el.html(this.template)
            let { songs } = data
            let liList = songs.map((song) =>
                $('<li></li>').text(song.name).attr('data-song-id', song.id)      // <li>song.name</li>
            )
            $el.find('ul').empty()
            liList.map((domLi) => {
                $el.find('ul').append(domLi)
            })
        },
        activeItem(li) {
            let $li = $(li)
            $li.addClass('active')
                .siblings('.active').removeClass('active')
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: []
        },
        find() {
            var query = new AV.Query('Song');                   // 创建 leancould Song class 实例
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {           // 将 Song class 中歌曲数据传给 data，但得到的 class 数据被封装过，用map去封装 
                    return { id: song.id, ...song.attributes }
                })
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventsHub()
            this.getAllSongs()

        },
        getAllSongs() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            $(this.view.el).on('click', 'li', (e) => {
                this.view.activeItem(e.currentTarget)
                let songId = e.currentTarget.getAttribute('data-song-id')
                let data
                let songs = this.model.data.songs
                for (let i = 0; i < songs.length; i++) {        // 匹配 id ，将歌曲信息传给data
                    if (songs[i].id === songId) {
                        data = songs[i]
                        break
                    }
                }
                // 深拷贝，避免引用同一个地址出 bug
                window.eventHub.emit('select', JSON.parse(JSON.stringify(data)))
            })
        },
        bindEventsHub() {
            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('update',(song)=>{
                console.log(11111111111111111111)
                console.log(song)
                let songs = this.model.data.songs
                for(let i=0; i<songs.length; i++){
                    if(songs[i].id === song.id){
                        Object.assign(songs[i], song)
                    }
                }
                this.view.render(this.model.data)
            })

        }

    }
    controller.init(view, model)

}