<template>
  <div class="smart-color">
    <div class="container">
      <v-card class="section rounded-xl" variant="outlined">
        <v-card-item>
          <v-img class='image' :src="(imageSrc.length) ? imageSrc : 'error'">
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

          <v-btn class="ml-2" variant="outlined" density="compact" @click="updateSource">Import</v-btn>
        </v-card-actions>
        <a target="_blank" href="https://unsplash.com/s/photos/random"> Click Here for Photos to Test</a>
      </v-card>

      <v-card class="section rounded-xl" variant="outlined" v-if="colorProperties" title="Color Properties">
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

      <v-card class="section rounded-xl" variant="outlined" v-if="textColors && bgColors && borderColors || loading"
        :loading="loading" title="Recommendations">
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
    <pre class='ai-window rounded-xl' v-if="answer">{{ answer }}</pre>
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
const answer = ref('');

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

  answer.value = ''
  colorProperties.value = data.value.colors.map((value) => rgbToHex(value[0], value[1], value[2]))
  dominantColor.value = rgbToHex(data.value.dominant[0], data.value.dominant[1], data.value.dominant[2])
}

const getGbtRecommendations = async () => {
  loading.value = true

  try {
    const { body } = await fetch("/api/chatGbt", {
      method: "POST",
      body: { dominant: dominantColor, colorProperties: colorProperties },
    });

    if (!body) throw new Error("Unknown error");
    useChatStream({
      stream: body,
      onChunk: ({ data }) => {
        answer.value += data;
      },
      onReady: () => {
        const json = JSON.parse(answer.value)

        loading.value = false
        textColors.value = json.textColors;
        bgColors.value = json.backgroundColors
        borderColors.value = json.borderColors
        shadowColors.value = json.shadowColors
      },
    });


  }
  catch (e) {
    console.log('Error', e)
  };


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
  margin-top: 50px;

  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.container {
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;

  padding: 24px;
}

.section {
  padding: 16px;
  overflow: hidden !important;
  text-align: center;
  max-width: 450px;
  width: 100%;
}

.image {
  height: 20rem;
  width: 20rem;
}

.color-bars {
  display: flex;
  flex-direction: row;
  height: 2em;
  border: solid black 0.5px;

  div {
    width: 2rem;
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

.ai-window {
  display: flex;
  flex-direction: column-reverse;
  border-radius: 15px;

  max-height: 150px;
  width: 50vw;

  background-color: black;
  color: white;
  padding: 5px;
  margin: 24px;
  overflow: auto;
}

.generate-action {
  margin: 24px;
}

@media screen and (max-width: 1024px) {

  .smart-color {
    display: flex;
    flex-direction: column;

    justify-content: space-evenly;
    align-items: center;
    height: fit-content;
    width: 100%;
  }

  .container {
    display: flex;
    flex-direction: column;
    margin: auto;
  }

  .section {
    padding: 16px;
    max-width: 300px;
    height: 100%;
    overflow: hidden !important;
    text-align: center;
  }

  ai-window {
    width: 80vw;
  }

}
</style>