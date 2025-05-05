<template>
  <div class=" flex flex-col justify-center items-center">
    <div class="camera-wrapper" :class="{ captured: imageCaptured }">
      <video ref="video" autoplay playsinline v-if="!imageCaptured && cameraActive" class="camera-video" />
      <img v-if="imageCaptured" :src="capturedImage" alt="Captured Face" class="camera-image" />
      <canvas ref="canvas" class="hidden"></canvas>
    </div>
    <span class="mt-4 dark:text-gray-400">
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

const video = ref(null)
const canvas = ref(null)
const capturedImage = ref(null)
const imageCaptured = ref(false)
const cameraActive = ref(true)
const faceDistanceScore = ref(0)
const faceProperlyVisible = ref(false)
const eyesClosed = ref(false)
const lastLeftEyeDistance = ref(0)
const lastRightEyeDistance = ref(0)
const blinkDetected = ref(false)

let mediaStream = null

// 📐 Adjustable frame size and center logic
const FRAME_WIDTH = 320
const FRAME_HEIGHT = 320
const FRAME_CENTER = { x: FRAME_WIDTH / 2, y: FRAME_HEIGHT / 2 }
const MAX_ALLOWED_DISTANCE =100
const CAPTURE_DISTANCE_THRESHOLD = 75
const MIN_DETECTION_SCORE = 0.7
const EYE_CLOSED_THRESHOLD = 2 // Threshold for eyes being closed (in pixels)
const BLINK_THRESHOLD = 1 // Threshold for detecting a sudden blink

// Load models for face detection and landmarks
const loadModels = async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector')
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68')
}

// Calculate Euclidean distance
const distance = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y)

// Detect faces and eyes
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
  const nose = landmarks.getNose()[3] // Nose tip
  const leftEye = landmarks.getLeftEye()
  const rightEye = landmarks.getRightEye()

  // Calculate the distance between upper and lower eyelids for both eyes
  const leftEyeDistance = distance(leftEye[1], leftEye[5])
  const rightEyeDistance = distance(rightEye[1], rightEye[5])

  // Check for sudden blink (sharp change in distance)
  if (Math.abs(leftEyeDistance - lastLeftEyeDistance.value) > BLINK_THRESHOLD || 
      Math.abs(rightEyeDistance - lastRightEyeDistance.value) > BLINK_THRESHOLD) {
    if (!blinkDetected.value) {
    //  alert('❌Please keep your eyes open for capture.')
      blinkDetected.value = true
    }
  } else {
    blinkDetected.value = false
  }

  // Store the previous eye distances for comparison
  lastLeftEyeDistance.value = leftEyeDistance
  lastRightEyeDistance.value = rightEyeDistance

  // Check if eyes are closed
  if (leftEyeDistance < EYE_CLOSED_THRESHOLD && rightEyeDistance < EYE_CLOSED_THRESHOLD) {
    eyesClosed.value = true
  } else {
    eyesClosed.value = false
  }

  const videoBox = video.value.getBoundingClientRect()
  const scaleX = video.value.videoWidth / videoBox.width
  const scaleY = video.value.videoHeight / videoBox.height

  const nosePosition = {
    x: nose.x / scaleX,
    y: nose.y / scaleY
  }

  const distToCenter = distance(nosePosition, FRAME_CENTER)

  const normalizedScore = Math.max(0, Math.min(100, 100 - (distToCenter / MAX_ALLOWED_DISTANCE) * 100))
  faceDistanceScore.value = normalizedScore
  faceProperlyVisible.value = detection.detection.score > MIN_DETECTION_SCORE

  if (normalizedScore >= CAPTURE_DISTANCE_THRESHOLD && faceProperlyVisible.value && !eyesClosed.value) {
    captureImage()
  }
}

// Capture the image from the video stream
const captureImage = () => {
  const ctx = canvas.value.getContext('2d')
  canvas.value.width = video.value.videoWidth
  canvas.value.height = video.value.videoHeight
  ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
  capturedImage.value = canvas.value.toDataURL('image/png')
  imageCaptured.value = true
  stopCamera()
}

// Stop the camera stream
const stopCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    cameraActive.value = false
  }
}

// Start the face detection loop
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
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: FRAME_WIDTH, height: FRAME_HEIGHT } })
    video.value.srcObject = mediaStream
    video.value.onloadeddata = () => startDetectionLoop()
  } catch (err) {
    console.error('Camera error:', err)
  }
})
</script>



<style scoped>
.camera-wrapper {
  width: 300px;
  height: 300px;
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

.camera-wrapper.captured {
  border-color: #00FF00;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
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
