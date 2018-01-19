<template>
    <div>

        <router-view name="login"></router-view>

        <router-view name="header"></router-view>
        <router-view name="navbar"></router-view>
        <router-view name="footer"></router-view>
        <router-view name="main"></router-view>

        <router-view name="foo"></router-view>
        <router-view name="bar"></router-view>


    </div>
</template>

<script>
    export default {
        name: "bran-main"
    }
</script>

<style scoped>

</style>