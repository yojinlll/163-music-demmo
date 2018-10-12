{
  let view = {
    el: '#app',
    render(data){
      let {song,status} = data
      $(this.el).css('background-image',`url(${song.cover})`)   // 页面背景
      $(this.el).find('img.cover').attr('src', song.cover)      // 转盘背景 

      if($(this.el).find('audio').attr('src') !== song.url){    // 若 url 相等就不渲染，让歌曲连贯
        $(this.el).find('audio').attr('src', song.url)
      }

      if(status==='playing'){
        $(this.el).find('.disc-container').addClass('playing')
      }else{
        $(this.el).find('.disc-container').removeClass('playing')
      }
    },
    play(){
      $(this.el).find('audio')[0].play()
    },
    pause(){
      $(this.el).find('audio')[0].pause()
    }
  }
  let model = {
    data: {
      song: {
        id: '',
        name: '',
        singer: '',
        url: '',
      },
      status:'paused'

    },
    get(id) {
      var query = new AV.Query('Song')
      return query.get(id).then((song) => {
        console.log(song)
        Object.assign(this.data.song, { id: song.id, ...song.attributes })    // setId 获取了id，get 获取其他数据
        return song
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      let id = this.getSongId()
      this.model.get(id).then(() => {
        this.view.render(this.model.data)
        this.view.play()
      })
      this.bindEvents()

    },
    bindEvents() {
      $(this.view.el).on('click','.icon-play',()=>{
        this.model.data.status = 'playing'
        this.view.render(this.model.data)
        this.view.pause()
      })
      $(this.view.el).on('click','.icon-pause',()=>{
        this.model.data.status = 'paused'
        this.view.render(this.model.data)
        this.view.play()
      })
    },
    getSongId() {
      let search = window.location.search
      if (search.indexOf('?') === 0) {
        search = search.substring(1)
      }
      let array = search.split('&').filter(v => v)      // 过滤空字符串 (v)=>v
      let id = ''

      for (let i = 0; i < array.length; i++) {
        let keyValue = array[i].split('=')        // 将 array大数组 中的值拆分成 keyValue小数组
        if (keyValue[0] === 'id') {                 // 当 keyValue数组 的 key键 为 'id' 时，获取 id 的值
          id = keyValue[1]
          break
        }
      }
      return id
    },
  }
  controller.init(view, model)
}



