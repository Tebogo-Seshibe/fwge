<template>
  <router-view />
</template>

<style>
html {
    --primary: #005fffff;
    --primary-light: #005ffff0;
    --secondary: #ff8c00ff;
    --secondary-light: #ff8c00f0;
    --tertiary: #272727ff;
    --tertiary-light: #272727f0;
    --tertiary-dark: #171717ff;
    --positive: #80ff80ff;
    --positive-light: #80ff80f0;
    --negative: #ff2f70ff;
    --negative-light: #ff2f70f0;
    --text: #aaaaaaff;
    --text-light: #ffffffff;
    --text-dark: #272727ff;

    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    background: var(--tertiary-dark);
    color: var(--text);
}

html,
body {
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    border: 0;
}
</style>
