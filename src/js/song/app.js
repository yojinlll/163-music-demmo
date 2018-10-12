{
  let view = {
    el:'#app',
    template:`
      <audio src={{url}}></audio>
      <div>
        <button class="play">播放</button>
        <button class="pause">停止</button>
      </div>
    `,
    render(data){
      $(this.el).html(this.template.replace('{{url}}',data.url))
    },
    play(){
      let audio = $(this.el).find('audio')[0]
      audio.play()
    },
    pause(){
      let audio = $(this.el).find('audio')[0]
      audio.pause()
    }

  }
  let model = {
    data: {
      id:'',
      name:'',
      singer:'',
      url:'',
    },
    get(id){
      var query = new AV.Query('Song')
      return query.get(id).then((song)=>{
        console.log(song)
        Object.assign (this.data, {id:song.id,...song.attributes})    // setId 获取了id，get 获取其他数据
        return song
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      let id = this.getSongId()
      this.model.get(id).then(()=>{
          this.view.render(this.model.data)
          this.view.play()
      })
      this.bindEvents()

    },
    bindEvents(){
      $(this.view.el).on('click','.play',()=>{
        this.view.play()
      })
      $(this.view.el).on('click','.pause',()=>{
        this.view.pause()
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
  controller.init(view,model)
}



