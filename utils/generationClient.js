import GenerationService from "../generation/generation_pb_service";
import Generation from "../generation/generation_pb";
import { grpc } from "@improbable-eng/grpc-web";

// Set up image parameters
const imageParams = new Generation.ImageParameters();
imageParams.setWidth(512);
imageParams.setHeight(512);
imageParams.addSeed(1234);
imageParams.setSamples(1);
imageParams.setSteps(50);

// Use the `k-dpmpp-2` sampler
const transformType = new Generation.TransformType();
transformType.setDiffusion(Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M);
imageParams.setTransform(transformType);

// Use Stable Diffusion 2.0
const request = new Generation.Request();
request.setEngineId("stable-diffusion-v1-5");
request.setRequestedType(Generation.ArtifactType.ARTIFACT_IMAGE);
request.setClassifier(new Generation.ClassifierParameters());

// Use a CFG scale of `13`
const samplerParams = new Generation.SamplerParameters();
samplerParams.setCfgScale(13);

const stepParams = new Generation.StepParameter();
const scheduleParameters = new Generation.ScheduleParameters();

// Set the schedule to `0`, this changes when doing an initial image generation
stepParams.setScaledStep(0);
stepParams.setSampler(samplerParams);
stepParams.setSchedule(scheduleParameters);

imageParams.addParameters(stepParams);
request.setImage(imageParams);

// Set our text prompt
const promptText = new Generation.Prompt();
promptText.setText(
  "A dream of a distant galaxy, by Caspar David Friedrich, matte painting trending on artstation HQ"
);

request.addPrompt(promptText);

// Authenticate using your API key, don't commit your key to a public repository!
const metadata = new grpc.Metadata();
metadata.set(
  "Authorization",
  "Bearer sk-wqeQWw53BDvFiePZTEw2hSZ2gez4fCdsEPcHp9PcQ6FyekIh"
);

metadata.delete("X-Requested-With");

// Create a generation client
export const generationClient = new GenerationService.GenerationServiceClient(
  "https://grpc.stability.ai",
  {}
);

export const generation = generationClient.generate(request, metadata);

export { request, metadata };
