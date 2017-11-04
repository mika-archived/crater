<template>
  <div>
    <section>
      <h2>Creter について</h2>
      <p>
        Crater は、フォームに入力した値を、自動で保存・復元することが出来る拡張機能です。
        <b>暗号化は行っていません。</b>
      </p>
    </section>
    <section>
      <h4>オープンソース</h4>
      <p>
        Crater は、下記のオープンソース・ソフトウェアを使用しています。
        <ul>
          <li v-for="w in softwares" :key="w.link">
            <a :href="w.link" target="_blank">{{w.name}}</a>
          </li>
        </ul>
      </p>
    </section>
    <section>
      <h4>リンク</h4>
      <ul>
        <li>
          <a href="https://github.com/mika-f/crater" target="_blank">GitHub</a>
        </li>
        <li>
          <a href="https://twitter.com/MikazukiFiyuno" target="_blank">Twitter</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: "about",
  data: function() {
    return {
      softwares: [
        {
          name: "Bootstrap Vue",
          link: "https://github.com/bootstrap-vue/bootstrap-vue"
        },
        { name: "jsSHA", link: "https://github.com/Caligatio/jsSHA" },
        { name: "lodash.sortby", link: "https://github.com/lodash/lodash" },
        { name: "Vue.js", link: "https://github.com/vuejs/vue" },
        { name: "vue-router", link: "https://github.com/vuejs/vue-router" }
      ]
    };
  }
};
</script>
