<template>

    <div>
        <p></p>
    </div>


</template>

<script>
    import routes from '../route'

    export default {
        name: "test",
        methods: {
            go (event) {
                event.preventDefault();
                this.$root.currentRoute = this.href;
                window.history.pushState(
                    null,
                    routes[this.href],
                    this.href
                )
            }
        }

    }
</script>

<style scoped>

    p {
        font-size: 12px;
    }

</style>