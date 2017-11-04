<template>
  <div>
    <section>
      <h2>ブロックリスト</h2>
      <p>
        下記リストに含まれている URL から、意図しないページ移動を行わないようにします。 <br> 以下を除く全てのページ移動のブロックを試みます。

        <ul>
          <li>フォームデータの送信</li>
          <li>
            <code>a</code> タグのリンクでないもの</li>
        </ul>
      </p>
    </section>
    <section>
      <h4>追加</h4>
      <b-card>
        <b-form @submit="onSubmit">
          <b-form-group id="url" label="URL (hostname) :" label-for="URL">
            <b-form-input id="url" type="text" v-model="form.url" required placeholder="example.com"></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">追加</b-button>
        </b-form>
      </b-card>
    </section>
    <section>
      <h4>一覧</h4>
      <b-table :items="blocks.items" :fields="blocks.fields">
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
import uniq from "lodash.uniq";

export default {
  name: "blocklist",
  data: function() {
    return {
      form: {
        url: ""
      },
      blocks: {
        fields: {
          hostname: { label: "Hostname" },
          actions: { label: "" }
        },
        items: []
      }
    };
  },
  methods: {
    onClick(data) {
      chrome.storage.local.get("blocks", value => {
        console.log(data);
        value.blocks = value.blocks.filter(w => w !== data.item.hostname);
        console.log(value);
        chrome.storage.local.set(value, () => {
          this.load();
        });
      });
    },
    onSubmit(event) {
      event.preventDefault();
      chrome.storage.local.get("blocks", w => {
        const value = Object.keys(w).length === 0 ? { blocks: [] } : w;
        value.blocks.push(this.form.url);
        value.blocks = uniq(value.blocks);
        chrome.storage.local.set(value, () => {
          this.form.url = "";
          this.load();
        });
      });
    },
    load() {
      this.blocks.items = [];
      const array = [];
      chrome.storage.local.get("blocks", value => {
        this.blocks.items = sortby(value["blocks"], w => w).map(w => {
          return { hostname: w };
        });
      });
    }
  },
  mounted() {
    this.load();
  }
};
</script>
