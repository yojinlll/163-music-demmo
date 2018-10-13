window.eventHub = {
    events: {
        //'羊城晚报': [fn],
        //'楚天都市报': [],
    }, // hash
    emit(eventName, data) {         // 发布，根据 eventName 去执行相应的 fn，并给 fn 传 data 参数
        for (let key in this.events) {
            if (key === eventName) {
                let fnList = this.events[key]
                fnList.map((fn) => {
                    fn.call(undefined, data)
                })
            }
        }
    },
    on(eventName, fn) {             // 订阅，把 eventName 和 fn 两两对应 push 到 events
        if (this.events[eventName] === undefined) {
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    },
}