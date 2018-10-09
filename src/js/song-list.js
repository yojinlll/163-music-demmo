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
                $('<li></li>').text(song.name)      // <li>song.name</li>
            )
            $el.find('ul').empty()
            liList.map((domLi) => {
                $el.find('ul').append(domLi)
            })
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: []
        },
        find(){
            var query = new AV.Query('Song');                   // 创建 leancould Song class 实例
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{           // 将 Song class 中歌曲数据传给 data，但得到的 class 数据被封装过，用map去封装 
                    return {id:song.id,...song.attributes}
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
            window.eventHub.on('upload', () => {
                this.view.clearActive()
            })
            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        }

    }
    controller.init(view, model)

}