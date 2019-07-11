<template>
  <a-card style="width: 100%" class="daily-article" :loading="loading">
    <template slot="actions" class="ant-card-actions">
      <a-icon type="step-backward" class="article-button" @click="getPreArticle" />
      <a-icon type="step-forward" class="article-button" @click="getNextArticle" />
    </template>
    <a-card-meta
      :title="article.title"
      :description="article.date.curr + ' · ' + article.author + ' · 字数：' + article.wc"
    />
    <span class="article-content" v-html="article.content" />
  </a-card>
</template>
<script>
export default {
  data() {
    return {
      loading: true,
      article: {
        title: '',
        content: '',
        date: {},
        author: '',
        wc: ''
      },
      today: ''
    }
  },
  mounted() {
    this.getArticle()
  },
  methods: {
    getPreArticle() {
      this.getArticle(this.article.date.prev)
    },
    getNextArticle() {
      if (this.article.date.next > this.today) {
        this.$message.warning('明天的文章小编还没准备好哦')
        return
      }
      this.getArticle(this.article.date.next)
    },
    getArticle(date = '') {
      this.$get('article?date=' + date).then((r) => {
        this.loading = false
        let data = JSON.parse(r.data.data)
        data = data.data
        this.article = { ...data }
        if (date === '') {
          this.today = this.article.date.curr
        }
      }).catch((e) => {
        console.error(e)
        this.$message.error('获取每日文章失败')
      })
    }
  }
}
</script>
<style lang="less">
  .daily-article {
    .article-button {
      font-size: 1.2rem !important;
    }
    .ant-card-body {
      padding: 18px !important;
    }
    .ant-card-head {
      padding: 0 1rem;
    }
    .ant-card-meta {
      margin-bottom: 1rem;
    }
    .article-content {
      p {
        word-wrap: break-word;
        word-break: break-all;
        text-overflow: initial;
        white-space: normal;
        font-size: .9rem !important;
        margin-bottom: .8rem;
      }
    }
  }
</style>
