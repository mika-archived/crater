<template>
  <div>
    <section>
      <h2>保存データ</h2>
      <p>
        Crater にて保存されているデータ一覧です。 <br> 状態が「有効」になっているもののみ、次回アクセス時に自動で入力されます。
      </p>
    </section>
    <section>
      <b-table :items="stores.items" :fields="stores.fields">
        <template slot="url" slot-scope="data">
          <a :href="data.item.url" target="_blank">{{data.item.url}}</a>
        </template>
        <template slot="status" slot-scope="data">
          {{data.item.status === 0 ? "一時データ" : (data.item.status === 1 ? "有効" : "無効")}}
        </template>
        <template slot="data" slot-scope="data">
          <code>{{data.item.data}}</code>
        </template>
        <template slot="actions" slot-scope="data">
          <b-button size="sm" variant="danger" v-on:click="onClick(data)">
            削除
          </b-button>
        </template>
      </b-table>
    </section>
  </div>
</template>

<script>
import sortby from "lodash.sortby";
import jsSHA from "jssha";

const sha = new jsSHA("SHA-256", "TEXT");
sha.update("version");
const versionHash = sha.getHash("HEX");

export default {
  name: "store",
  data: function() {
    return {
      stores: {
        fields: {
          url: { label: "URL" },
          status: { label: "状態" },
          data: { label: "入力データ" },
          actions: { label: "*" }
        },
        items: []
      }
    };
  },
  methods: {
    onClick: function(data) {
      chrome.storage.local.remove(data.item.key, () => this.load());
    },
    load: function() {
      this.stores.items = [];
      const array = [];
      chrome.storage.local.get(items => {
        for (const key of Object.keys(items)) {
          if (key === versionHash || key === "version") {
            continue;
          }
          const value = JSON.parse(
            typeof items[key] === "string" ? items[key] : "{}"
          );
          array.push({
            key,
            url: value.url,
            status: value.status,
            data: value.data
          });
        }
        this.stores.items = sortby(array, w =>
          w.url.replace("http://", "").replace("https://", "")
        );
      });
    }
  },
  mounted: function() {
    this.load();
  }
};
</script>
