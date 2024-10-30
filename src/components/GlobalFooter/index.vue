<!--
 * Copyright (c) 2023 by Allen_sun email: Allen_sun_js@hotmail.com, All Rights Reserved.
-->
<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
    </template>
    <template v-slot:copyright>
      <!-- Copyright © 2023 <a href="http://www.jeequan.com" target="_blank">jeequan.com</a>. All rights reserved. -->
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
