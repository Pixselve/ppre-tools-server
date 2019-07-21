<template>
  <div>
    secured
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    middleware: "auth"
  })
  export default class ProtectedPage extends Vue {
  }

</script>
