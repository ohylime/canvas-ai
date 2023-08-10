<template>
  <div class="smart-color">
    <div class="container">
      <v-card class="section">
        <v-card-item>
          <v-img width="300" height="300" :src="(imageSrc.length) ? imageSrc : 'error'">
            <template v-slot:error>
              <div>Error Loading Image, Try Again</div>
              <v-img class="mx-auto" height="300" width="500"
                src="https://images.unsplash.com/photo-1526297003708-f5a1c2c9c6e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80"></v-img>
              {{ imgErr = true }}
            </template>
          </v-img>
        </v-card-item>

        <v-card-actions class="flex justify-space-evenly">
          <v-text-field variant="outlined" density="compact" hide-details :error="imgErr" v-model="inputValue" clearable
            label="Image Url" />

          <v-btn class="ml-2" variant="outlined" density="compact" @click="updateSource">use image</v-btn>
        </v-card-actions>
        <a target="_blank" href="https://unsplash.com/s/photos/random"> Click Here for Photos to Test</a>
      </v-card>

      <v-card class="section" v-if="colorProperties" title="Color Properties">
        <div v-if="dominantColor" class="dominant">
          <h5> Dominant <br /> {{ dominantColor }} </h5>
          <div v-bind:style="{ 'background-color': dominantColor }" class=" color-display" />
        </div>


        <h5 v-if="colorProperties"> Color Properties </h5>
        <div class="color-bars lg">
          <v-tooltip location="center" v-for="color in colorProperties" :key="color" :text="color">
            <template v-slot:activator="{ props }">
              <div v-bind="props" :style="{ backgroundColor: color }"></div>
            </template>
          </v-tooltip>
        </div>
      </v-card>

      <v-card class="section" v-if="textColors && bgColors && borderColors || loading" :loading="loading"
        title="Recommendations">
        <v-card-item v-if="textColors && bgColors && borderColors || loading" :loading="loading">
          <v-card-item>
            <h5>Text Recommendations</h5>
            <div class="color-bars">
              <v-tooltip location="center" class="properties" v-for="{ color, accessible }  in  textColors" :key="color"
                :text="color">
                <template v-slot:activator="{ props }">
                  <div v-bind="props" :style="{ backgroundColor: color }" @mouseenter="() => isAssesible = accessible"
                    @mouseout="() => isAssesible = ''"></div>
                </template>
              </v-tooltip>
            </div>
          </v-card-item>

          <v-divider></v-divider>

          <v-card-item>
            <h5>Background Recommendations</h5>

            <div class="color-bars">
              <v-tooltip location="center" class="properties" v-for="{ color, accessible }  in  bgColors" :key="color"
                :text="color">
                <template v-slot:activator="{ props }">
                  <div v-bind="props" :style="{ backgroundColor: color }" @mouseenter="() => isAssesible = accessible"
                    @mouseout="() => isAssesible = ''"></div>
                </template>
              </v-tooltip>
            </div>
          </v-card-item>

          <v-divider></v-divider>

          <v-card-item>
            <h5>Border Recommendations</h5>

            <div class="color-bars">
              <v-tooltip location="center" class="properties" v-for="{ color, accessible }  in  borderColors" :key="color"
                :text="color">
                <template v-slot:activator="{ props }">
                  <div v-bind="props" :style="{ backgroundColor: color }" @mouseenter="() => isAssesible = accessible"
                    @mouseout="() => isAssesible = ''"></div>
                </template>
              </v-tooltip>
            </div>
          </v-card-item>

          <v-divider></v-divider>

          <v-card-item>
            <h5>Shadow Recommendations</h5>

            <div class="color-bars">
              <v-tooltip location="center" class="properties" v-for="{ color, accessible }  in  shadowColors" :key="color"
                :text="color">
                <template v-slot:activator="{ props }">
                  <div v-bind="props" :style="{ backgroundColor: color }" @mouseenter="() => isAssesible = accessible"
                    @mouseout="() => isAssesible = ''"></div>
                </template>
              </v-tooltip>
            </div>
          </v-card-item>
        </v-card-item>

        <h5 v-if="isAssesible !== ''"> Color is Accessible : {{ `${isAssesible}`.charAt(0).toUpperCase()
          + `${isAssesible}`.slice(1) }}</h5>
      </v-card>
    </div>
    <v-btn variant="outlined" class="generate-action" :disabled="!imageSrc.length" @click="getColorProperties">Generate
      Recommendations</v-btn>
  </div>
</template>


<script setup>

const imageSrc = ref("https://images.unsplash.com/photo-1464820453369-31d2c0b651af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sb3JmdWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=700&q=60");
const inputValue = ref('')
const colorProperties = ref('')
const dominantColor = ref('')
const textColors = ref('')
const bgColors = ref('')
const borderColors = ref('')
const shadowColors = ref('')
const loading = ref(false)
const imgErr = ref(false)
const isAssesible = ref('')

const resetValues = () => {
  colorProperties.value = ''
  dominantColor.value = ''
  textColors.value = ''
  bgColors.value = ''
  borderColors.value = ''
  shadowColors.value = ''
}

const updateSource = () => {
  // check url
  imageSrc.value = inputValue.value; //'https://d24xn8jvo7q7oc.cloudfront.net/profile500.png'
  resetValues()
  imgErr.vale = false
}

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
  if (dominantColor.value) {
    await getGbtRecommendations()
  }
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
  overflow: hidden !important;
  text-align: center;
}

.image {
  height: 25em;
  width: 25em;
}

.color-bars {
  display: flex;
  flex-direction: row;
  height: 2em;
  border: solid black 0.5px;

  div {
    width: 2em;
  }
}

.lg {
  height: 10em;
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
</style>