<template>
  <div id="app">
    <b-navbar fixed="top" toggleable="md" type="dark" variant="info">
      <b-container>
        <b-navbar-brand to="/">Crater</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
          <!-- Right aligned nav items -->
          <b-nav is-nav-bar class="ml-auto">
            <b-nav-item to="/store">Store</b-nav-item>
            <b-nav-item to="/blacklist">Blacklist</b-nav-item>
            <b-nav-item to="/about">About</b-nav-item>
          </b-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
    <b-container class="crater-container" style="padding-top: 70px">
      <router-view />
    </b-container>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>
