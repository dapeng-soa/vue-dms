<template>
    <div class="s-video-show">
        <!-- <video-player ref="videoPlayer" class="video-player vjs-custom-skin" :playsinline="true" :options="playerOptions" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" /> -->
    
    
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions" :playsinline="true" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" @ended="onPlayerEnded($event)" @loadeddata="onPlayerLoadeddata($event)" @waiting="onPlayerWaiting($event)"
            @playing="onPlayerPlaying($event)" @timeupdate="onPlayerTimeupdate($event)" @canplay="onPlayerCanplay($event)" @canplaythrough="onPlayerCanplaythrough($event)" @ready="playerReadied" @statechanged="playerStateChanged($event)">
        </video-player>
    
    
    </div>
</template>

<script>
export default {
    name: "s-video-show",
    data () {
        return {
            playerOptions: {
                height: '360',
                autoplay: true,
                muted: true,
                language: 'en',
                playbackRates: [0.8, 1.0, 1.25, 1.5,2.0],

                autoplay: true, // 如果true,浏览器准备好时开始回放。

                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                    type: 'video/mp4', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
                    // src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm' // url地址
                    src: this.$route.params.id // url地址
                }],
                hls: true,
                //  poster: "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg",
                poster: "http://pic.hzways.com/pic_go062.jpg",

                width: document.documentElement.clientWidth, // 播放器宽度
                notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    fullscreenToggle: true // 全屏按钮
                }
            }
            // this.playerOptions.sources[0].src = this.$route.params.id
        }
    },
    mounted () {
        // console.log('this is current player instance object', this.player)
        setTimeout(() => {
            console.log('dynamic change options', this.player)
            // change src
            // this.playerOptions.sources[0].src = 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm';
            // change item
            // this.$set(this.playerOptions.sources, 0, {
            //   type: "video/mp4",
            //   src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm',
            // })
            // change array
            // this.playerOptions.sources = [{
            //   type: "video/mp4",
            //   src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm',
            // }]
            this.player.muted(false)
        }, 5000)
    },
    computed: {
        player () {
            return this.$refs.videoPlayer.player
        }
    },
    methods: {
        // listen event
        onPlayerPlay (player) {
            // console.log('player play!', player)
        },
        onPlayerPause (player) {
            // console.log('player pause!', player)
        },
        onPlayerEnded (player) {
            // console.log('player ended!', player)
        },
        onPlayerLoadeddata (player) {
            // console.log('player Loadeddata!', player)
        },
        onPlayerWaiting (player) {
            // console.log('player Waiting!', player)
        },
        onPlayerPlaying (player) {
            // console.log('player Playing!', player)
        },
        onPlayerTimeupdate (player) {
            // console.log('player Timeupdate!', player.currentTime())
        },
        onPlayerCanplay (player) {
            // console.log('player Canplay!', player)
        },
        onPlayerCanplaythrough (player) {
            // console.log('player Canplaythrough!', player)
        },
        // or listen state event
        playerStateChanged (playerCurrentState) {
            // console.log('player current update state', playerCurrentState)
        },
        // player is ready
        playerReadied (player) {
            // seek to 10s
            console.log('example player 1 readied', player)
            player.currentTime(0)
            // console.log('example 01: the player is readied', player)
        }
    }
}
</script>


<style lang="scss">

</style>