<template>
  <div class="smart-color">
    <div class="container">
      <v-card title="Image" class="section">
        <img width="300" height="300" :src="imageSrc">
      </v-card>

      <v-card class="section image" v-if="colorProperties">
        <h4>Colors</h4>
        <div v-if="dominantColor" class="dominant">
          <h5> Dominant <br /> {{ dominantColor }} </h5>
          <div v-bind:style="{ 'background-color': dominantColor }" class=" color-display" />
        </div>

        <h5 v-if="colorProperties"> Color Properties </h5>
        <div class="properties" v-for="color  in  colorProperties">{{ color }}
          <div v-bind:style="{ 'background-color': color }" class=" color-display" />
        </div>
      </v-card>

      <v-card class="section" v-if="textColors && bgColors && borderColors">
        <h4>Recommendations</h4>
        <div v-if="textColors && bgColors && borderColors">
          <h5>Text Recommendations</h5>
          <div class="properties" v-for="color  in  textColors">{{ color.color }}
            <div v-bind:style="{ 'background-color': color.color }" class=" color-display" />
          </div>
          <v-divider></v-divider>
          <h5>Background Recommendations</h5>
          <div class="properties" v-for="color  in  bgColors">{{ color.color }}
            <div v-bind:style="{ 'background-color': color.color }" class=" color-display" />
          </div>
          <v-divider></v-divider>
          <h5>Border Recommendations</h5>
          <div class="properties" v-for=" color  in  borderColors">{{ color.color }}
            <div v-bind:style="{ 'background-color': color.color }" class=" color-display" />
          </div>
          <v-divider></v-divider>
          <h5>Shadow Recommendations</h5>
          <div class="properties" v-for=" color  in  shadowColors">{{ color.color }}
            <div v-bind:style="{ 'background-color': color.color }" class=" color-display" />
          </div>
        </div>

      </v-card>
    </div>
    <div v-if="loading" class="lds-facebook">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <pre>{{ recommendation }}</pre>
    <v-btn variant="outlined" class="generate-action" @click="getColorProperties">Generate Recommendations</v-btn>
  </div>
</template>


<script setup>
const imageSrc = ref("https://d181ynnxrxn8wz.cloudfront.net/MilliePhilipProfile.png");
const colorProperties = ref('')
const dominantColor = ref('')
const textColors = ref('')
const bgColors = ref('')
const borderColors = ref('')
const shadowColors = ref('')
const loading = ref(false)

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

const getColorProperties = async () => {
  const { data } = await useFetch('/api/extractColor', {
    method: 'post',
    body: { img: imageSrc }
  })
  colorProperties.value = data.value.colors.map((value) => rgbToHex(value[0], value[1], value[2]))
  dominantColor.value = rgbToHex(data.value.dominant[0], data.value.dominant[1], data.value.dominant[2])
}

const getGbtRecommendations = async () => {
  loading.value = true
  try {
    const { data } = await useFetch('/api/chatGbt',
      {
        method: 'post',
        body: { dominant: dominantColor, colorProperties: colorProperties }
      })

    console.log(data)
    loading.value = false
    textColors.value = data.value.textColors;
    bgColors.value = data.value.backgroundColors
    borderColors.value = data.value.borderColors
    shadowColors.value = data.value.shadowColors
  } catch (e) {
    console.log('Error', e)
  }



}


watch([dominantColor], async () => {
  await getGbtRecommendations()
})

onMounted(() => {

})

</script>

<style scoped lang="scss">
.smart-color {
  display: flex;
  flex-direction: column;
  margin: auto;
}

.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
}

.section {
  border: 1px solid black;
  margin: auto;
  padding: 16px;
  min-width: 300px;
  min-height: 400px;

  h4 {
    font-size: 24px;
    margin: 0px;
  }
}

.image {
  height: 25em;
  width: 25em;
}

.color-display {
  height: 100%;
  width: 100%;
  border: 0.5px solid black;
}

.dominant {
  display: grid;
  grid-template-columns: 1fr 2fr;

  width: 100%;
  text-align: center;
  align-items: center;
  margin: 36px 0px;

  h5 {
    margin: 0px
  }
}

.properties {
  display: grid;
  grid-template-columns: 1fr 2fr;

  height: 20px;
  width: 100%;
  text-align: center;
  align-items: center;
}

.generate-action {
  margin: 50px 500px
}

// Loader
.lds-facebook {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.lds-facebook div {
  display: inline-block;
  position: absolute;
  left: 8px;
  width: 16px;
  background: #dfc;
  animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}

.lds-facebook div:nth-child(1) {
  left: 8px;
  animation-delay: -0.24s;
}

.lds-facebook div:nth-child(2) {
  left: 32px;
  animation-delay: -0.12s;
}

.lds-facebook div:nth-child(3) {
  left: 56px;
  animation-delay: 0;
}

@keyframes lds-facebook {
  0% {
    top: 8px;
    height: 64px;
  }

  50%,
  100% {
    top: 24px;
    height: 32px;
  }
}
</style>