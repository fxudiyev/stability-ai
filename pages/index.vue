<template>
  <div class="pt-10">
    <link
      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css"
      rel="stylesheet"
    />

    <h1 class="text-center text-4xl">Nuxt App</h1>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { generationClient, request, metadata } from "../utils/generationClient";
import Generation from "../generation/generation_pb";

export default Vue.extend({
  name: "IndexPage",
  data: function () {
    return {};
  },
  mounted() {
    const generation = generationClient.generate(request, metadata);
    generation.on("data", (data) => {
      data.getArtifactsList().forEach((artifact) => {
        // Oh no! We were filtered by the NSFW classifier!
        if (
          artifact.getType() === Generation.ArtifactType.ARTIFACT_TEXT &&
          artifact.getFinishReason() === Generation.FinishReason.FILTER
        ) {
          return console.error(
            "Your image was filtered by the NSFW classifier."
          );
        }

        // Make sure we have an image
        if (artifact.getType() !== Generation.ArtifactType.ARTIFACT_IMAGE)
          return;

        // You can convert the raw binary into a base64 string
        const buffer = Buffer.from(artifact.getBinary());
        const base64Image = buffer.toString("base64");

        // Here's how you get the seed back if you set it to `0` (random)
        const seed = artifact.getSeed();

        // We're done!
        this.someFunctionToCallWhenFinished({ seed, base64Image });
      });
    });
    generation.on("status", (status) => {
      console.log("status", status);
      if (status.code === 0) return;
      console.error(
        "Your image could not be generated. You might not have enough credits."
      );
    });
    console.clear();
    console.log("here!!!!!!!!!!!!!");
  },
  methods: {
    someFunctionToCallWhenFinished: function someFunctionToCallWhenFinished({
      seed,
      base64Image,
    }: {
      seed: number;
      base64Image: string;
    }) {
      console.log(seed);
      if (document) {
        const image = document.createElement("img");
        image.src = `data:image/png;base64,${base64Image}`;
        document.body.appendChild(image);
      }
    },
  },
});
</script>
