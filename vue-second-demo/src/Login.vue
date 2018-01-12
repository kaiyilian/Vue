<template>
    <div v-bind:class="class_list.index">
        这是首页
    </div>
</template>

<script>

    export default {
        name: "login",
        data: () => {
            return {

                class_list: {
                    index: "col-xs-2"
                },

            }
        }
    }

</script>

<style scoped>

</style>