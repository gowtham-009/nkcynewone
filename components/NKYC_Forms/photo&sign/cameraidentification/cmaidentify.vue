<template>
  <div class="flex flex-col justify-center items-center">
    <div
      class="camera-wrapper"
      :class="{
        captured: imageCaptured,
        'centered-capture-ready': faceProperlyVisible && isNoseCenteredFlag,
      }"
    >
      <video
        ref="video"
        autoplay
        playsinline
        v-if="!imageCaptured && cameraActive"
        class="camera-video"
      />
      <img
        v-if="imageCaptured"
        :src="capturedImage"
        alt="Captured Face"
        class="camera-image"
      />
      <canvas ref="canvas" class="hidden"></canvas>
    </div>

    <span class="mt-3 dark:text-gray-400">
      Face distance score: {{ faceDistanceScore.toFixed(2) }}%
    </span>
    <span class="dark:text-gray-400">
      Face Visible:
      <span :class="{ 'text-green-500': faceProperlyVisible, 'text-red-500': !faceProperlyVisible }">
        {{ faceProperlyVisible ? '✅ Yes' : '❌ No' }}
      </span>
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as faceapi from 'face-api.js'

const emit = defineEmits(['captured'])

const video = ref(null)
const canvas = ref(null)
const capturedImage = ref(null)
const imageCaptured = ref(false)
const cameraActive = ref(true)
const faceDistanceScore = ref(0)
const faceProperlyVisible = ref(false)
const eyesClosed = ref(false)
const blinkDetected = ref(false)
const isNoseCenteredFlag = ref(false)

const lastLeftEyeDistance = ref(0)
const lastRightEyeDistance = ref(0)

let mediaStream = null

// Frame settings
const FRAME_WIDTH = 320
const FRAME_HEIGHT = 320
const FRAME_CENTER = ref({ x: FRAME_WIDTH / 2, y: FRAME_HEIGHT / 2 })
const MAX_ALLOWED_DISTANCE = 100
const CAPTURE_CENTER_TOLERANCE = 15 // nose must be within 15px of center
const MIN_DETECTION_SCORE = 0.5
const EYE_CLOSED_THRESHOLD = 2
const BLINK_THRESHOLD = 1

const loadModels = async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector')
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68')
}

const distance = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y)

const isNoseCentered = (nosePos, center) => {
  return (
    Math.abs(nosePos.x - center.x) <= CAPTURE_CENTER_TOLERANCE &&
    Math.abs(nosePos.y - center.y) <= CAPTURE_CENTER_TOLERANCE
  )
}

const detectFaces = async () => {
  if (!video.value || video.value.readyState !== 4 || imageCaptured.value) return

  const detections = await faceapi
    .detectAllFaces(video.value, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()

  if (detections.length > 1) {
    alert('❌ Multiple faces detected. Please ensure only one face is in frame.')
    faceProperlyVisible.value = false
    return
  }

  if (detections.length === 0) {
    faceProperlyVisible.value = false
    return
  }

  const detection = detections[0]
  const landmarks = detection.landmarks
  const nose = landmarks.getNose()[3]
  const leftEye = landmarks.getLeftEye()
  const rightEye = landmarks.getRightEye()

  const leftEyeDistance = distance(leftEye[1], leftEye[5])
  const rightEyeDistance = distance(rightEye[1], rightEye[5])

  if (
    Math.abs(leftEyeDistance - lastLeftEyeDistance.value) > BLINK_THRESHOLD ||
    Math.abs(rightEyeDistance - lastRightEyeDistance.value) > BLINK_THRESHOLD
  ) {
    blinkDetected.value = true
  } else {
    blinkDetected.value = false
  }

  lastLeftEyeDistance.value = leftEyeDistance
  lastRightEyeDistance.value = rightEyeDistance

  eyesClosed.value =
    leftEyeDistance < EYE_CLOSED_THRESHOLD && rightEyeDistance < EYE_CLOSED_THRESHOLD

  const videoBox = video.value.getBoundingClientRect()
  const scaleX = video.value.videoWidth / videoBox.width
  const scaleY = video.value.videoHeight / videoBox.height

  const nosePosition = {
    x: nose.x / scaleX,
    y: nose.y / scaleY,
  }

  const distToCenter = distance(nosePosition, FRAME_CENTER.value)
  faceDistanceScore.value = Math.max(
    0,
    Math.min(100, 100 - (distToCenter / MAX_ALLOWED_DISTANCE) * 100)
  )

  faceProperlyVisible.value = detection.detection.score > MIN_DETECTION_SCORE
  isNoseCenteredFlag.value = isNoseCentered(nosePosition, FRAME_CENTER.value)

  if (
    isNoseCenteredFlag.value &&
    faceProperlyVisible.value &&
    !eyesClosed.value &&
    !blinkDetected.value
  ) {
    captureImage()
  }
}

const captureImage = () => {
  const ctx = canvas.value.getContext('2d')
  canvas.value.width = video.value.videoWidth
  canvas.value.height = video.value.videoHeight
  ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
  capturedImage.value = canvas.value.toDataURL('image/png')
  emit('captured', capturedImage.value)
  imageCaptured.value = true
  stopCamera()
}

const stopCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop())
    cameraActive.value = false
  }
}

const startDetectionLoop = () => {
  const loop = async () => {
    await detectFaces()
    requestAnimationFrame(loop)
  }
  loop()
}

onMounted(async () => {
  await loadModels()
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { width: FRAME_WIDTH, height: FRAME_HEIGHT },
    })
    video.value.srcObject = mediaStream
    video.value.onloadeddata = () => startDetectionLoop()
  } catch (err) {
    console.error('Camera error:', err)
  }
})
</script>

<style scoped>
.camera-wrapper {
  width: 370px;
  height: 370px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #00BFFF;
  box-shadow: 0 0 15px rgba(0, 191, 255, 0.5);
  position: relative;
}
.camera-wrapper::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(0, 0, 0, 0.3);
}
.camera-wrapper::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(0, 0, 0, 0.3);
}
.camera-wrapper.centered-capture-ready {
  border-color: #00FF00;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
}
.camera-wrapper.captured {
  border-color: #00FF00;
}
.camera-video,
.camera-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
canvas.hidden {
  display: none;
}
</style>
